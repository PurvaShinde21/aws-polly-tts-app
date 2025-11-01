# Polly TTS Web App

A minimal text-to-speech web application using Amazon Polly with dark/light mode support.

## Features

-  **Amazon Polly Integration** with standard voices
-  **Rate Limiting**: 10 requests per day per IP (perfect for demos)
-  **Responsive Design** with gradients and shadows
-  **Free Tier Hosting** on Vercel + Render
-  **Dark & Light Mode** with smooth transitions and HSL color system

## Project Structure

```
polly-tts-app/
├── backend/          # Node.js + Express API
│   ├── server.js     # Main API with Polly integration
│   ├── package.json
│   └── .env.example
└── frontend/         # Next.js 14 + TypeScript
    ├── app/
    │   ├── components/
    │   │   ├── ThemeProvider.tsx
    │   │   └── ThemeToggle.tsx
    │   ├── page.tsx
    │   ├── layout.tsx
    │   └── globals.css
    ├── package.json
    └── .env.local.example
```

## Setup Instructions

### 1. AWS Setup

1. Create an AWS account (free tier includes Polly credits)
2. Go to IAM → Users → Create User
3. Attach policy: `AmazonPollyFullAccess`
4. Create access keys and save them securely

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and add your AWS credentials:
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
PORT=3001
```

Run locally:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

Run locally:
```bash
npm run dev
```

Visit `http://localhost:3000`

## Deployment

### Deploy Backend to Render

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. New → Web Service → Connect your repo
4. Select `backend` directory
5. Add environment variables (AWS keys)
6. Deploy!

**Copy the Render URL** (e.g., `https://polly-tts-backend.onrender.com`)

### Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import Project → Select your GitHub repo
3. Framework: Next.js
4. Root Directory: `frontend`
5. Add environment variable:
   - `NEXT_PUBLIC_BACKEND_URL` = your Render backend URL
6. Deploy!

## How to Pause/Stop (Save Costs)

### Render (Backend)
- **Auto-suspend**: Free tier automatically spins down after 15 min inactivity
- **Manual suspend**: Dashboard → Service → Settings → Suspend Service
- **Resume**: Click "Resume" or wait for next request (cold start ~30s)

### Vercel (Frontend)
- **Disable auto-deploy**: Settings → Git → Disable
- **Pause deployments**: Delete deployment temporarily
- **Note**: Frontend has no compute cost when idle (static files)

### AWS Polly
- **No infrastructure to stop** - only pay per request
- **Set billing alert**: AWS Console → Billing → Budgets → Create $1 alert
- **Free tier**: 1 million characters/month forever (after initial 5M for 12 months)

## Rate Limiting

- **12 requests per day per IP address**
- Resets every 24 hours
- Perfect for portfolio demos
- Can be adjusted in `backend/server.js` (line 19)

## Theme Details

### Color Palette (HSL)

**Dark Mode:**
- Background Dark: `hsl(0, 0%, 0%)`
- Background: `hsl(0, 0%, 5%)`
- Background Light: `hsl(0, 0%, 10%)`
- Text: `hsl(0, 0%, 95%)`
- Text Muted: `hsl(0, 0%, 70%)`

**Light Mode:**
- Background Dark: `hsl(0, 0%, 90%)`
- Background: `hsl(0, 0%, 95%)`
- Background Light: `hsl(0, 0%, 100%)`
- Text: `hsl(0, 0%, 5%)`
- Text Muted: `hsl(0, 0%, 30%)`

### Design Features
- Gradient backgrounds on panels
- Gradient buttons with hover effects
- Card shadows (different for light/dark)
- Minimal circular toggle button (top-right)
- Smooth transitions

## Cost Monitoring

1. **AWS Polly**: Check [AWS Billing Dashboard](https://console.aws.amazon.com/billing/)
2. **Render**: 750 free hours/month (auto-suspend saves hours)
3. **Vercel**: Unlimited bandwidth on Hobby plan

## Troubleshooting

### Backend won't start
- Check AWS credentials in `.env`
- Verify IAM policy includes Polly access
- Check `npm install` completed successfully

### Frontend can't reach backend
- Verify `NEXT_PUBLIC_BACKEND_URL` is correct
- Check Render service is running (not suspended)
- CORS is enabled in backend

### Rate limit errors
- Wait 24 hours for reset
- Or adjust limit in `server.js` (line 19)

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, AWS SDK v3
- **TTS**: Amazon Polly (Neural engine)
- **Deployment**: Vercel (frontend), Render (backend)

## License

MIT



