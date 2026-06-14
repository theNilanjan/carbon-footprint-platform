# Vercel Deployment Guide

This guide will help you deploy the Carbon Footprint Platform to Vercel.

## Prerequisites

- A Vercel account (free tier works)
- GitHub repository with the project code
- Node.js installed locally

## Deployment Steps

### 1. Push Code to GitHub

Ensure your code is pushed to GitHub:
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository: `theNilanjan/carbon-footprint-platform`

### 3. Configure Project Settings

#### Root Directory
- Set to: `./` (root of the project)

#### Framework Preset
- Select: "Other"

#### Build Command
- Leave empty (Vercel will use the vercel.json configuration)

#### Output Directory
- Leave empty

#### Environment Variables

Add these environment variables in Vercel dashboard:

**For Production:**
- `NODE_ENV`: `production`
- `FRONTEND_URL`: Your Vercel app URL (e.g., `https://carbon-footprint-platform.vercel.app`)

**Optional:**
- `OPENAI_API_KEY`: Your OpenAI API key (if using AI features)
- `CLAUDE_API_KEY`: Your Claude API key (if using AI features)

### 4. Deploy

Click "Deploy" and wait for the deployment to complete.

## How It Works

The `vercel.json` configuration file handles the monorepo structure:

- **Frontend**: Serves the React app from the `client` directory
- **Backend**: API routes are handled by the Express server in the `server` directory
- **Routing**: All `/api/*` requests are routed to the server, everything else goes to the frontend

## Post-Deployment Steps

1. **Update CORS Origin**
   - Go to Vercel dashboard → Settings → Environment Variables
   - Update `FRONTEND_URL` to your actual Vercel app URL
   - Redeploy the application

2. **Test the Application**
   - Visit your Vercel app URL
   - Test logging activities
   - Verify the dashboard displays correctly

3. **Set Up Custom Domain (Optional)**
   - Go to Vercel dashboard → Settings → Domains
   - Add your custom domain
   - Follow the DNS instructions

## Troubleshooting

### API Requests Failing
- Check that `FRONTEND_URL` is set correctly in Vercel environment variables
- Verify the CORS configuration in `server/src/index.ts`

### Build Errors
- Ensure all dependencies are in `package.json` files
- Check that TypeScript compiles without errors locally

### Server Not Responding
- Check Vercel deployment logs
- Verify the server exports the Express app correctly
- Ensure the vercel.json routes are configured properly

## Local Development

To run locally after deployment:
```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

The client will use the Vite proxy to forward API requests to the local server.

## Architecture

```
Vercel Deployment Structure:
├── client/ (React Frontend)
│   ├── dist/ (Built static files)
│   └── index.html
├── server/ (Express Backend)
│   ├── src/
│   │   └── index.ts (Serverless function)
│   └── dist/ (Compiled TypeScript)
└── vercel.json (Vercel configuration)
```

## Support

For issues with deployment:
- Check Vercel deployment logs
- Review the vercel.json configuration
- Ensure all environment variables are set
