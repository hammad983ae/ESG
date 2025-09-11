# Sustaino Pro Unified Server Guide

## 🚀 **Unified Backend Server**

The Sustaino Pro server now combines both OCR processing and valuation management in a single, unified backend server. This eliminates port conflicts and provides a cleaner architecture.

## 📋 **Features**

### ✅ **OCR Processing**
- Document text extraction (PDF, images)
- AI-powered form data parsing
- Multi-page document support
- Base64 and file upload support

### ✅ **Valuation Management**
- Complete CRUD operations for valuations
- MongoDB persistence
- Search and filtering
- Export functionality (JSON, CSV, PDF)
- Statistics and analytics
- 17 different valuation types supported

### ✅ **Unified API**
- Single server on port 3001
- Shared MongoDB database
- Consistent error handling
- Security middleware
- Rate limiting

## 🛠️ **Setup Instructions**

### 1. **Install Dependencies**
```bash
# Install server dependencies
npm run server:install
```

### 2. **Environment Configuration**
Create a `.env` file in the `server` directory:
```bash
cd server
cp env.example .env
```

Edit the `.env` file:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/sustaino_pro

# CORS
CORS_ORIGIN=http://localhost:8080

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# OCR Configuration
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
OPENAI_API_KEY=your-openai-api-key

# JWT (for future authentication)
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
```

### 3. **Start the Unified Server**
```bash
# Production mode
npm run server:unified

# Development mode (with auto-restart)
npm run server:unified:dev
```

### 4. **Seed Sample Data**
```bash
npm run server:seed
```

### 5. **Run Tests**
```bash
npm run server:test
```

## 🌐 **API Endpoints**

### **Health & Status**
- `GET /health` - Server health check
- `GET /api/status` - Detailed API status

### **OCR Processing**
- `POST /api/ocr/extract` - File upload OCR
- `POST /api/ocr/extract-base64` - Base64 OCR

### **Valuation Management**
- `POST /api/valuations` - Create valuation
- `GET /api/valuations` - Get all valuations
- `GET /api/valuations/:id` - Get specific valuation
- `PUT /api/valuations/:id` - Update valuation
- `DELETE /api/valuations/:id` - Delete valuation
- `PATCH /api/valuations/:id/archive` - Archive valuation
- `GET /api/valuations/search` - Search valuations
- `GET /api/valuations/stats` - Get statistics
- `GET /api/valuations/types` - Get supported types
- `POST /api/valuations/export` - Export valuations

## 🔧 **Server Architecture**

```
Unified Server (Port 3001)
├── OCR Processing
│   ├── File Upload Handler
│   ├── Base64 Handler
│   ├── PDF Processor
│   └── AI Parser
├── Valuation Management
│   ├── CRUD Operations
│   ├── Search & Filter
│   ├── Export Functions
│   └── Statistics
├── MongoDB Integration
│   ├── Valuation Model
│   ├── Connection Management
│   └── Data Validation
└── Security & Performance
    ├── CORS
    ├── Rate Limiting
    ├── Data Sanitization
    └── Compression
```

## 📊 **Database Schema**

### **Valuation Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  valuationType: String, // ARY, ESG_Adjusted_ARY, etc.
  propertyName: String,
  propertyAddress: String,
  data: Mixed, // Flexible schema for different valuation types
  isShared: Boolean,
  sharedWith: [ObjectId],
  tags: [String],
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 **Quick Start Commands**

```bash
# 1. Install dependencies
npm run server:install

# 2. Start the unified server
npm run server:unified

# 3. Seed sample data
npm run server:seed

# 4. Start frontend
npm run dev
```

## 🔍 **Verification**

### **Check Server Status**
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-01-27T...",
  "service": "Sustaino Pro Unified Server",
  "version": "1.0.0",
  "features": ["OCR Processing", "Valuation Management", "MongoDB Integration"],
  "endpoints": {
    "ocr": "/api/ocr/extract",
    "valuation": "/api/valuations",
    "health": "/health"
  }
}
```

### **Check API Status**
```bash
curl http://localhost:3001/api/status
```

### **Test OCR Endpoint**
```bash
curl -X POST http://localhost:3001/api/ocr/extract \
  -F "file=@test-document.pdf" \
  -F "formType=crop"
```

### **Test Valuation Endpoint**
```bash
curl http://localhost:3001/api/valuations
```

## 🗄️ **MongoDB Requirements**

### **Local MongoDB**
```bash
# Install MongoDB locally
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Or start manually
mongod --dbpath /usr/local/var/mongodb
```

### **MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### **Docker MongoDB**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## 🚨 **Troubleshooting**

### **Port Already in Use**
```bash
# Find process using port 3001
lsof -ti:3001

# Kill the process
kill -9 $(lsof -ti:3001)
```

### **MongoDB Connection Issues**
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Start MongoDB
brew services start mongodb-community
```

### **Dependencies Issues**
```bash
# Clear and reinstall
cd server
rm -rf node_modules package-lock.json
npm install
```

### **Environment Variables**
Make sure all required environment variables are set in the `.env` file.

## 📈 **Performance Optimization**

### **Production Settings**
```env
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/sustaino_pro
RATE_LIMIT_MAX_REQUESTS=1000
```

### **Database Indexing**
The server automatically creates indexes for:
- `userId` (for user data isolation)
- `valuationType` (for filtering)
- Text search on `propertyName`, `propertyAddress`, `notes`, `tags`

## 🔒 **Security Features**

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Prevent abuse
- **Data Sanitization** - NoSQL injection protection
- **XSS Protection** - Cross-site scripting prevention
- **HPP Protection** - HTTP parameter pollution prevention

## 📝 **Logging**

The server includes comprehensive logging:
- **Morgan** - HTTP request logging
- **Console** - Application logs
- **Error tracking** - Detailed error information

## 🧪 **Testing**

```bash
# Run all tests
npm run server:test

# Run tests in watch mode
cd server && npm run test:watch

# Run tests with coverage
cd server && npm run test:coverage
```

## 📚 **API Documentation**

For detailed API documentation, visit:
- **Health Check:** `http://localhost:3001/health`
- **API Status:** `http://localhost:3001/api/status`

## 🎯 **Next Steps**

1. **Authentication** - Implement JWT-based authentication
2. **User Management** - Add user registration/login
3. **Real-time Updates** - WebSocket integration
4. **Advanced Analytics** - More detailed reporting
5. **Mobile API** - Mobile-specific endpoints

## 🆘 **Support**

For technical support or questions:
- Check the server logs for error details
- Verify all environment variables are set
- Ensure MongoDB is running and accessible
- Check network connectivity and firewall settings

The unified server is now ready to handle both OCR processing and valuation management in a single, efficient backend! 🎉
