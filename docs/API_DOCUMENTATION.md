# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All API requests require an API key in the Authorization header:
```
Authorization: Bearer <api_key>
```

## API Keys Format
- **Organization-level:** `org_<org_id>_direct_<random_string>`
- **Brand-level:** `org_<org_id>_brand_<brand_id>_<random_string>`

## Endpoints

### 1. Get Organization Info
```
GET /api/org/info
```

**Response:**
```json
{
  "success": true,
  "data": {
    "organization": {
      "id": 1,
      "name": "TechCorp",
      "description": "Technology education company"
    },
    "brand": {
      "id": 1,
      "name": "TechCorp Education",
      "description": "Educational courses for students"
    },
    "accessLevel": "brand"
  }
}
```

### 2. Get All Courses
```
GET /api/courses
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Python Basics",
      "description": "Learn Python programming from scratch",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "organization": {
        "id": 1,
        "name": "TechCorp"
      },
      "brand": {
        "id": 1,
        "name": "TechCorp Education"
      }
    }
  ],
  "count": 1,
  "context": {
    "organization": "TechCorp",
    "brand": "TechCorp Education"
  }
}
```

### 3. Get Course by ID
```
GET /api/courses/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Python Basics",
    "description": "Learn Python programming from scratch",
    "content": "Introduction to Python syntax, variables, loops, and functions",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "organization": {
      "id": 1,
      "name": "TechCorp"
    },
    "brand": {
      "id": 1,
      "name": "TechCorp Education"
    }
  },
  "context": {
    "organization": "TechCorp",
    "brand": "TechCorp Education"
  }
}
```

### 4. Search Courses
```
GET /api/courses/search?q=<query>&limit=<limit>&offset=<offset>
```

**Parameters:**
- `q` (required): Search query
- `limit` (optional): Number of results (default: 10)
- `offset` (optional): Number of results to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Python Basics",
      "description": "Learn Python programming from scratch",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "organization": {
        "id": 1,
        "name": "TechCorp"
      },
      "brand": {
        "id": 1,
        "name": "TechCorp Education"
      }
    }
  ],
  "count": 1,
  "query": "python",
  "pagination": {
    "limit": 10,
    "offset": 0
  },
  "context": {
    "organization": "TechCorp",
    "brand": "TechCorp Education"
  }
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "error": "API key required. Format: Bearer <api_key>"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Course not found or access denied"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Failed to fetch courses"
}
```

## Test API Keys

For testing purposes, use these API keys:

- **TechCorp Education:** `org_1_brand_1_abc123def456`
- **TechCorp Professional:** `org_1_brand_2_xyz789uvw012`
- **EduSoft Direct:** `org_2_direct_ghi789jkl012`
- **LearnHub Kids:** `org_3_brand_3_def456ghi789`
- **LearnHub Adults:** `org_3_brand_4_mno123pqr456`

## Example Usage

### Using curl
```bash
# Get organization info
curl -X GET "http://localhost:3000/api/org/info" \
  -H "Authorization: Bearer org_1_brand_1_abc123def456"

# Get all courses
curl -X GET "http://localhost:3000/api/courses" \
  -H "Authorization: Bearer org_1_brand_1_abc123def456"

# Search courses
curl -X GET "http://localhost:3000/api/courses/search?q=python" \
  -H "Authorization: Bearer org_1_brand_1_abc123def456"
```

### Using JavaScript
```javascript
const response = await fetch('http://localhost:3000/api/courses', {
  headers: {
    'Authorization': 'Bearer org_1_brand_1_abc123def456'
  }
});
const data = await response.json();
console.log(data);
```
