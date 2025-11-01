"use client";

import { useState, useRef, useEffect } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function Home() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("Joanna");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number>(10);
  const audioRef = useRef<HTMLAudioElement>(null);

  const voices = [
    { id: "Joanna", name: "Joanna (Female, US)" },
    { id: "Matthew", name: "Matthew (Male, US)" },
    { id: "Emma", name: "Emma (Female, UK)" },
    { id: "Brian", name: "Brian (Male, UK)" },
    { id: "Amy", name: "Amy (Female, UK)" },
  ];

  // Fetch rate limit status on mount
  useEffect(() => {
    const fetchRateLimit = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/rate-limit-status`);
        if (response.ok) {
          const remainingHeader = response.headers.get('RateLimit-Remaining') || 
                                  response.headers.get('ratelimit-remaining');
          if (remainingHeader) {
            setRemaining(parseInt(remainingHeader));
          }
        }
      } catch (err) {
        console.error('Failed to fetch rate limit:', err);
      }
    };
    fetchRateLimit();
  }, []);

  const handleSynthesize = async () => {
    if (!text.trim()) {
      setError("Please enter some text");
      return;
    }

    setLoading(true);
    setError("");
    
    // Clear previous audio
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/speech`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, voice }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to synthesize speech");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      // Update remaining requests from response headers
      const remainingHeader = response.headers.get('X-Requests-Remaining') ||
                              response.headers.get('RateLimit-Remaining') ||
                              response.headers.get('ratelimit-remaining');
      if (remainingHeader) {
        setRemaining(parseInt(remainingHeader));
      }

      // Auto-play
      setTimeout(() => {
        audioRef.current?.play();
      }, 100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen gradient-bg flex items-center justify-center p-6 relative">
      
      <div className="w-full max-w-2xl">
        <div className="gradient-button card-shadow rounded-2xl p-8 backdrop-blur-sm">
          <h1 className="text-4xl font-bold mb-2">
            Text to Speech
          </h1>
          <p className="text-muted mb-8" style={{ color: 'hsl(var(--text-muted))' }}>
            Convert your text to natural speech using Amazon Polly
          </p>

          {/* Voice selector */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">
              Voice
            </label>
            <select
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              className="w-full px-4 py-3 rounded-lg gradient-bg card-shadow 
                         border-2 transition-all focus:outline-none focus:ring-2 
                         focus:ring-blue-500"
              style={{ 
                borderColor: 'hsl(var(--bg-light))',
                background: 'hsl(var(--bg-light))'
              }}
            >
              {voices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* Text input */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">
              Text (max 3000 characters)
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to convert to speech..."
              rows={6}
              maxLength={3000}
              className="w-full px-4 py-3 rounded-lg gradient-bg card-shadow 
                         border-2 transition-all focus:outline-none focus:ring-2 
                         focus:ring-blue-500 resize-none"
              style={{ 
                borderColor: 'hsl(var(--bg-light))',
                background: 'hsl(var(--bg-light))'
              }}
            />
            <div className="text-sm mt-2" style={{ color: 'hsl(var(--text-muted))' }}>
              {text.length} / 3000 characters
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border-2 border-red-500/20">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* Synthesize button */}
          <button
            onClick={handleSynthesize}
            disabled={loading || !text.trim()}
            className="w-full py-4 rounded-lg gradient-button card-shadow font-semibold 
                       text-lg transition-all hover:scale-[1.02] active:scale-[0.98] 
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? "Synthesizing..." : "Synthesize"}
          </button>

          {/* Audio player */}
          {audioUrl && (
            <div className="mt-6 p-6 rounded-lg gradient-bg card-shadow">
              <h3 className="font-semibold mb-3">Audio Player</h3>
              <audio
                ref={audioRef}
                src={audioUrl}
                controls
                className="w-full"
              />
            </div>
          )}

          {/* Rate limit notice */}
          <p className="text-xs mt-6 text-center" style={{ color: 'hsl(var(--text-muted))' }}>
            Limited to 10 requests per day per IP address
          </p>
        </div>
      </div>

      {/* Usage counter - bottom left */}
      <div className="fixed bottom-6 left-6 px-4 py-2 rounded-lg gradient-bg card-shadow backdrop-blur-sm">
        <p className="text-xs" style={{ color: 'hsl(var(--text-muted))' }}>
          Requests remaining: <span className="font-bold text-sm">{remaining}/10</span>
        </p>
      </div>
    </main>
  );
}
