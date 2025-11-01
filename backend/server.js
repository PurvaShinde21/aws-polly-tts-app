require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { PollyClient, SynthesizeSpeechCommand } = require('@aws-sdk/client-polly');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors());
app.use(express.json());

// Rate limiting: 12 requests per day per IP
const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 12, // 12 requests per day
  message: { error: 'Rate limit exceeded. You can only make 12 requests per day.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// AWS Polly client
const pollyClient = new PollyClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Polly TTS API is running' });
});

// TTS endpoint with rate limiting
app.post('/api/speech', limiter, async (req, res) => {
  try {
    const { text, voice = 'Joanna' } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Limit text length to prevent abuse
    if (text.length > 3000) {
      return res.status(400).json({ error: 'Text too long. Maximum 3000 characters.' });
    }

    const command = new SynthesizeSpeechCommand({
      Text: text,
      OutputFormat: 'mp3',
      VoiceId: voice,
      Engine: 'neural', // Use neural engine for better quality
    });

    const response = await pollyClient.send(command);
    
    // Stream audio back to client
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'inline',
    });

    const audioStream = response.AudioStream;
    for await (const chunk of audioStream) {
      res.write(chunk);
    }
    res.end();

  } catch (error) {
    console.error('Polly error:', error);
    res.status(500).json({ 
      error: 'Failed to synthesize speech',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Polly TTS Backend running on port ${PORT}`);
  console.log(`⚡ Rate limit: 12 requests per day per IP`);
});
