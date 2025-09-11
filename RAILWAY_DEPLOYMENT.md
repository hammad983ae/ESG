# Railway Deployment Guide

## 🚀 Deploying the Sustaino Pro Backend to Railway

### Prerequisites
- Railway account
- MongoDB database (Railway provides this)
- Environment variables configured

### Step 1: Environment Variables
Set these environment variables in your Railway project:

#### Required Variables:
```
NODE_ENV=production
PORT=3001
HOST=0.0.0.0
SESSION_SECRET=your-super-secret-session-key-here
JWT_SECRET=your-jwt-secret-key-here
```

#### Database (Railway will provide):
```
MONGODB_URI=railway-provided-mongodb-uri
```

#### Optional API Keys:
```
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
OPENAI_API_KEY=your-openai-api-key
CORELOGIC_CLIENT_KEY=your-corelogic-client-key
CORELOGIC_CLIENT_SECRET=your-corelogic-client-secret
```

### Step 2: Railway Configuration
The project includes:
- `railway.json` - Railway configuration
- `Procfile` - Process definition
- Updated `package.json` with proper start script

### Step 3: Deploy
1. Connect your GitHub repository to Railway
2. Railway will automatically detect the configuration
3. Set the environment variables in Railway dashboard
4. Deploy!

### Step 4: Health Check
The server includes a health check endpoint:
```
GET /health
```

### Troubleshooting

#### Common Issues:
1. **Build fails**: Check that all dependencies are in `server/package.json`
2. **Port issues**: Ensure `PORT` environment variable is set
3. **Database connection**: Verify `MONGODB_URI` is set correctly
4. **CORS errors**: Update `ALLOWED_ORIGINS` with your frontend URL

#### Logs:
Check Railway logs for detailed error messages:
```bash
railway logs
```

### File Structure:
```
/
├── railway.json          # Railway configuration
├── Procfile             # Process definition
├── package.json         # Root package.json with start script
└── server/
    ├── package.json     # Server dependencies
    ├── server.js        # Main server file
    └── .env.example     # Environment variables template
```
