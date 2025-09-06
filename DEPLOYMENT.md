# Deployment Guide

This guide covers environment variable setup for different deployment environments.

## Prerequisites

- Node.js 18+ and npm/yarn/bun
- Supabase CLI installed
- OpenAI API account
- Google Cloud Platform account (for Vision API)

## Environment Variables Overview

The application requires the following environment variables:

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes | `https://your-project.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key | Yes | `eyJhbGciOiJIUzI1NiIs...` |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ID | Yes | `your-project-id` |
| `OPENAI_API_KEY` | OpenAI API key for AI functions | Yes | `sk-...` |
| `GOOGLE_CLOUD_VISION_API_KEY` | Google Cloud Vision API key | Yes | `AIza...` |

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd create-my-playground
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Configure your .env file**
   - Open `.env` in your editor
   - Replace placeholder values with actual credentials
   - See [API Key Setup](#api-key-setup) for detailed instructions

5. **Start Supabase locally**
   ```bash
   supabase start
   ```

6. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

## API Key Setup

### Supabase Configuration

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings > API
4. Copy the following values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_PUBLISHABLE_KEY`
   - **Project ID** → `VITE_SUPABASE_PROJECT_ID`

### OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and set it as `OPENAI_API_KEY`
5. **Important**: Add billing information to your OpenAI account

### Google Cloud Vision API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Vision API:
   - Go to APIs & Services > Library
   - Search for "Cloud Vision API"
   - Click "Enable"
4. Create credentials:
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "API Key"
   - Copy the key and set it as `GOOGLE_CLOUD_VISION_API_KEY`
5. **Optional**: Restrict the API key to Vision API only

## Production Deployment

### Vercel Deployment

1. **Connect your repository to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure environment variables**
   - Go to Project Settings > Environment Variables
   - Add all required variables from the table above
   - Set appropriate environments (Production, Preview, Development)

3. **Deploy**
   - Vercel will automatically deploy on push to main branch
   - Check deployment logs for any issues

### Netlify Deployment

1. **Connect your repository to Netlify**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure environment variables**
   - Go to Site Settings > Environment Variables
   - Add all required variables
   - Use the same values as your local `.env` file

3. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Deploy**
   - Netlify will build and deploy automatically

### Supabase Edge Functions Deployment

1. **Set up Supabase project**
   ```bash
   supabase link --project-ref your-project-id
   ```

2. **Set environment variables for functions**
   ```bash
   supabase secrets set OPENAI_API_KEY=your-openai-key
   supabase secrets set GOOGLE_CLOUD_VISION_API_KEY=your-google-key
   ```

3. **Deploy functions**
   ```bash
   supabase functions deploy
   ```

## Environment-Specific Configurations

### Development
- Use local Supabase instance
- Set `NODE_ENV=development`
- Enable debug logging

### Staging
- Use staging Supabase project
- Set `NODE_ENV=staging`
- Use staging API keys

### Production
- Use production Supabase project
- Set `NODE_ENV=production`
- Use production API keys
- Enable all security features

## Security Best Practices

1. **Never commit `.env` files**
   - The `.gitignore` is configured to exclude environment files
   - Use `.env.example` as a template

2. **Use different API keys for different environments**
   - Create separate OpenAI projects for dev/staging/prod
   - Use different Supabase projects for each environment

3. **Rotate API keys regularly**
   - Set up a schedule for key rotation
   - Update all environments when rotating keys

4. **Monitor API usage**
   - Set up billing alerts for OpenAI
   - Monitor Google Cloud usage

5. **Use secrets management services for production**
   - Consider using AWS Secrets Manager
   - Or Azure Key Vault
   - Or HashiCorp Vault

## Troubleshooting

### Common Issues

1. **"Environment variable not found" errors**
   - Check that all required variables are set
   - Verify variable names match exactly (case-sensitive)
   - Restart your development server after changes

2. **Supabase connection issues**
   - Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Check Supabase project status
   - Ensure RLS policies are configured

3. **OpenAI API errors**
   - Verify API key is valid and has credits
   - Check rate limits
   - Ensure billing is set up

4. **Google Cloud Vision API errors**
   - Verify API key is valid
   - Check that Vision API is enabled
   - Verify API key has proper permissions

### Getting Help

- Check the application logs in browser console
- Review Supabase function logs in dashboard
- Check API provider dashboards for usage and errors
- Refer to individual API documentation

## Support

For deployment issues:
1. Check this documentation first
2. Review error logs
3. Check API provider status pages
4. Contact the development team
