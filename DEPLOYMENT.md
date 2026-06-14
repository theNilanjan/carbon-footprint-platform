# Vercel Deployment Guide

This guide will help you deploy the Carbon Footprint Platform to Vercel.

## Architecture

This is a monorepo with separate frontend and backend. For production, we'll deploy:
- **Frontend**: React app on Vercel
- **Backend**: Express server on Render (free tier)

## Prerequisites

- Vercel account (free tier)
- Render account (free tier)
- GitHub repository with the project code

## Part 1: Deploy Backend to Render

### 1. Push Code to GitHub

Ensure your code is pushed to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy Backend to Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `carbon-footprint-backend`
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `FRONTEND_URL`: Your Vercel frontend URL (add after deploying frontend)
6. Click "Create Web Service"

### 3. Get Backend URL

After deployment, Render will provide a URL like:
`https://carbon-footprint-backend.onrender.com`

## Part 2: Deploy Frontend to Vercel

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository: `theNilanjan/carbon-footprint-platform`

### 2. Configure Project Settings

#### Root Directory
- Set to: `./` (root of the project)

#### Framework Preset
- Select: "Other"

#### Build Command
- Leave empty (Vercel will use vercel.json)

#### Output Directory
- Leave empty

#### Environment Variables

Add these environment variables in Vercel dashboard:
- `VITE_API_URL`: Your Render backend URL (e.g., `https://carbon-footprint-backend.onrender.com`)

### 3. Deploy

Click "Deploy" and wait for the deployment to complete.

## Part 3: Update CORS Configuration

### 1. Update Backend CORS

Go to your Render dashboard → carbon-footprint-backend → Environment Variables:
- Update `FRONTEND_URL` to your Vercel frontend URL
- Click "Save Changes"
- Render will automatically redeploy

### 2. Update Client API URL

If needed, update the client's API service to use the production URL:
```bash
# In client/.env.production
VITE_API_URL=https://your-backend-url.onrender.com
```

## Post-Deployment Steps

1. **Test the Application**
   - Visit your Vercel app URL
   - Test logging activities
   - Verify the dashboard displays correctly

2. **Set Up Custom Domain (Optional)**
   - Go to Vercel dashboard → Settings → Domains
   - Add your custom domain
   - Follow the DNS instructions

## Troubleshooting

### API Requests Failing
- Check that `VITE_API_URL` is set correctly in Vercel environment variables
- Verify the backend is running on Render
- Check CORS configuration in Render environment variables

### Build Errors
- Ensure all dependencies are in `package.json` files
- Check that TypeScript compiles without errors locally

### Backend Not Responding
- Check Render deployment logs
- Verify the start command is correct
- Ensure the server exports the Express app correctly

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
Production Deployment Structure:
├── Frontend (Vercel)
│   ├── React app built to dist/
│   └── Serves static files
└── Backend (Render)
    ├── Express server
    ├── Handles API requests
    └── CORS configured for frontend URL
```

## Support

For issues with deployment:
- Check Vercel deployment logs
- Check Render deployment logs
- Review environment variables
- Ensure CORS is configured correctly
