# Organization Access API - Frontend Demo

A React frontend application that demonstrates the multi-tenant Course Management System API.

## Features

- 🔑 **API Key Selection**: Choose from different organization and brand API keys
- 🏢 **Organization Info**: View organization and brand details
- 📚 **Course Management**: Browse and search courses with proper tenant isolation
- 🔒 **Security Demo**: Test multi-tenant isolation and security features
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Backend API server running on http://localhost:3000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

**Note:** The frontend runs on port 3001 to avoid conflict with the backend API server (port 3000).

## API Keys for Testing

The frontend includes pre-configured API keys for testing:

- **TechCorp Education**: `org_1_brand_1_abc123def456`
- **TechCorp Professional**: `org_1_brand_2_xyz789uvw012`
- **EduSoft Direct**: `org_2_direct_ghi789jkl012`
- **LearnHub Kids**: `org_3_brand_3_def456ghi789`
- **LearnHub Adults**: `org_3_brand_4_mno123pqr456`

## Demo Features

### 1. API Key Selection
- Select different API keys to simulate different organizations/brands
- Each API key provides access to different course data

### 2. Organization Information
- View organization and brand details
- See access level (organization vs brand)

### 3. Course Management
- Browse all courses accessible to the selected API key
- Search courses by title or description
- View course details and metadata

### 4. Security Demonstration
- Test cross-organization isolation
- Verify brand-level access control
- Test invalid API key rejection

## Architecture

- **React 19**: Modern React with hooks
- **Axios**: HTTP client for API calls
- **CSS3**: Modern styling with gradients and animations
- **Responsive Design**: Mobile-first approach

## Security Features Demonstrated

- ✅ Multi-tenant organization isolation
- ✅ Brand-level access control
- ✅ API key authentication
- ✅ Cross-organization access prevention
- ✅ Input validation and error handling

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm run build`: Builds the app for production
- `npm test`: Launches the test runner
- `npm run eject`: Ejects from Create React App

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)