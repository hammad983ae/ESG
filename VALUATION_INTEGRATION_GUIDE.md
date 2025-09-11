# Valuation Backend Integration Guide

## Overview

This guide explains how to integrate the valuation backend with the frontend application. The integration provides a complete MERN stack solution for property valuation management with MongoDB persistence.

## Architecture

```
Frontend (React + TypeScript)
├── ValuationContext (State Management)
├── ValuationApiService (API Communication)
├── ValuationList (UI Component)
└── ValuationAnalysis (Main Page)

Backend (Node.js + Express + MongoDB)
├── ValuationModel (Mongoose Schema)
├── ValuationService (Business Logic)
├── ValuationController (API Endpoints)
└── ValuationRoutes (Route Definitions)
```

## Features

### ✅ Completed Features

1. **Backend API**
   - Complete REST API for valuation CRUD operations
   - MongoDB integration with Mongoose
   - Data validation and error handling
   - Search and filtering capabilities
   - Export functionality (JSON, CSV, PDF)
   - Statistics and analytics

2. **Frontend Integration**
   - React Context for state management
   - API service layer for backend communication
   - Valuation list component with search/filter
   - Integration with existing valuation forms
   - Real-time data synchronization

3. **Data Persistence**
   - All valuation calculations are saved to MongoDB
   - User-specific data isolation
   - Session management
   - Data export capabilities

## Setup Instructions

### 1. Backend Setup

```bash
# Install backend dependencies
npm run server:install

# Start the valuation backend
npm run valuation:backend

# Seed the database with sample data
npm run valuation:seed

# Run backend tests
npm run valuation:test
```

### 2. Environment Configuration

Create a `.env` file in the server directory:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/valuation_db
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
```

### 3. Frontend Configuration

The frontend is already configured to connect to the backend. The API service automatically detects the backend URL from environment variables.

## API Endpoints

### Valuation Management

- `POST /api/valuations` - Create new valuation
- `GET /api/valuations` - Get all valuations for user
- `GET /api/valuations/:id` - Get specific valuation
- `PUT /api/valuations/:id` - Update valuation
- `DELETE /api/valuations/:id` - Delete valuation
- `PATCH /api/valuations/:id/archive` - Archive valuation

### Search & Filtering

- `GET /api/valuations/search` - Search valuations
- `GET /api/valuations/stats` - Get valuation statistics
- `GET /api/valuations/types` - Get supported valuation types

### Export

- `POST /api/valuations/export` - Export valuations (JSON/CSV/PDF)

## Usage Examples

### 1. Creating a Valuation

```typescript
import { useValuation } from '@/contexts/ValuationContext';

const { createValuation } = useValuation();

const handleSubmit = async (formData) => {
  const valuationData = {
    propertyName: "Sample Property",
    propertyLocation: "123 Main St, Melbourne VIC 3000",
    propertyType: "commercial",
    valuationType: "ary",
    results: calculatedResults,
    inputs: formData,
    calculationMethod: "All Risks Yield Analysis",
    esgIncluded: false,
    status: "completed"
  };

  const success = await createValuation(valuationData);
  if (success) {
    console.log("Valuation saved successfully!");
  }
};
```

### 2. Loading Valuations

```typescript
import { useValuation } from '@/contexts/ValuationContext';

const { state, loadValuations } = useValuation();

// Load all valuations
useEffect(() => {
  loadValuations();
}, []);

// Load with filters
const loadFilteredValuations = () => {
  loadValuations({
    valuationType: 'ary',
    propertyType: 'commercial',
    status: 'completed'
  });
};
```

### 3. Searching Valuations

```typescript
const { searchValuations } = useValuation();

const handleSearch = (query) => {
  searchValuations(query, {
    valuationType: 'ary',
    esgIncluded: true
  });
};
```

## Data Models

### ValuationData Interface

```typescript
interface ValuationData {
  _id?: string;
  propertyName: string;
  propertyLocation: string;
  propertyType: string;
  valuationType: string;
  userId: string;
  sessionId: string;
  status?: 'draft' | 'completed' | 'archived';
  esgIncluded?: boolean;
  esgFactor?: number;
  results: Record<string, any>;
  inputs: Record<string, any>;
  calculationMethod: string;
  isPublic?: boolean;
  tags?: string[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### Supported Valuation Types

1. **ARY** - All Risks Yield
2. **ESG_Adjusted_ARY** - ESG-Adjusted ARY
3. **Capitalization_Sensitivity** - Cap Rate Sensitivity
4. **Net_Income_Approach** - Net Income Approach
5. **ESG_Capitalization_Analysis** - ESG Cap Analysis
6. **ESG_Comparable_Sales** - ESG Comparable Sales
7. **Cap_Net_Income** - Cap Net Income
8. **Summation_Approach** - Summation Approach
9. **Direct_Comparison** - Direct Comparison
10. **Hypothetical_Development** - Hypothetical Development
11. **Hospitality_Commercial** - Hospitality & Commercial
12. **Childcare_Facilities** - Childcare Facilities
13. **Comprehensive_ESG** - Comprehensive ESG
14. **Petrol_Stations** - Petrol Stations
15. **Deferred_Management** - Deferred Management
16. **DCF_Analysis** - DCF Analysis
17. **Sports_Stadium** - Sports Stadium

## UI Components

### ValuationList Component

```typescript
<ValuationList
  onSelectValuation={(valuation) => {
    // Handle valuation selection
    console.log('Selected valuation:', valuation);
  }}
  onEditValuation={(valuation) => {
    // Handle valuation editing
    console.log('Edit valuation:', valuation);
  }}
  showActions={true}
/>
```

### Valuation Context

```typescript
const {
  state,                    // Current state
  loadValuations,          // Load all valuations
  createValuation,         // Create new valuation
  updateValuation,         // Update existing valuation
  deleteValuation,         // Delete valuation
  searchValuations,        // Search valuations
  exportValuations,        // Export valuations
  filteredValuations,      // Filtered valuation list
  selectedValuationData    // Selected valuations
} = useValuation();
```

## Error Handling

The integration includes comprehensive error handling:

1. **API Errors** - Network and server errors are caught and displayed
2. **Validation Errors** - Form validation errors are shown to users
3. **Loading States** - Loading indicators during API calls
4. **Retry Logic** - Automatic retry for failed requests

## Testing

### Backend Tests

```bash
cd server
npm test
```

### Frontend Testing

The frontend components can be tested using React Testing Library or similar tools.

## Deployment

### Backend Deployment

1. Set up MongoDB Atlas or local MongoDB instance
2. Configure environment variables
3. Deploy to your preferred hosting platform (Heroku, AWS, etc.)

### Frontend Deployment

1. Build the frontend: `npm run build`
2. Deploy to your preferred hosting platform
3. Update API URLs in environment variables

## Troubleshooting

### Common Issues

1. **CORS Errors** - Ensure backend CORS is configured for frontend URL
2. **Database Connection** - Check MongoDB connection string
3. **API Timeout** - Increase timeout values in API service
4. **Missing Dependencies** - Run `npm install` in both frontend and backend

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in the backend environment.

## Security Considerations

1. **Authentication** - Implement proper user authentication
2. **Authorization** - Add user-based access control
3. **Data Validation** - Validate all input data
4. **Rate Limiting** - Implement API rate limiting
5. **HTTPS** - Use HTTPS in production

## Performance Optimization

1. **Pagination** - Implement pagination for large datasets
2. **Caching** - Add Redis caching for frequently accessed data
3. **Indexing** - Optimize MongoDB indexes
4. **Compression** - Enable gzip compression
5. **CDN** - Use CDN for static assets

## Future Enhancements

1. **Real-time Updates** - WebSocket integration
2. **Advanced Analytics** - More detailed reporting
3. **Collaboration** - Multi-user collaboration features
4. **Mobile App** - React Native mobile application
5. **AI Integration** - Machine learning for valuation predictions

## Support

For technical support or questions about the integration, please contact the development team or refer to the API documentation in the server directory.
