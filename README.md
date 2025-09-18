# 🎓 Organization Access API - Multi-Tenant Course Management System

A complete **multi-tenant Course Management System API** with React frontend that demonstrates organization and brand-level data isolation. This POC showcases how to build a secure, scalable system that prevents data leakage between different organizations and their brands.

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  Node.js API    │    │  PostgreSQL DB  │
│   (Port 3001)   │◄──►│  (Port 3000)    │◄──►│   (Multi-tenant)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## ✨ **Key Features**

- 🔒 **Multi-tenant Organization Isolation** - Organizations cannot access each other's data
- 🏢 **Brand-level Access Control** - Brands within organizations are properly isolated
- 🔑 **API Key Authentication** - Secure access with organization/brand-scoped keys
- 📚 **Course Management** - Create, read, and search courses with proper scoping
- 🛡️ **Security Testing** - Comprehensive test suite for isolation validation
- 📱 **Modern React Frontend** - Beautiful, responsive demo interface
- ⚡ **Performance Optimized** - Sub-100ms response times

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js (v14 or higher)
- PostgreSQL (with pgAdmin)
- Git

### **Installation & Setup**

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd org-access-api
```

2. **Install backend dependencies:**
```bash
npm install
```

3. **Install frontend dependencies:**
```bash
cd frontend
npm install
cd ..
```

4. **Set up PostgreSQL database:**
   - Create database: `org_access_api`
   - Create user: `org_api_user` (optional)
   - Update `.env` file with your database credentials

5. **Set up environment variables:**
```bash
# Create .env file in root directory
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=org_access_api
DB_USER=org_api_user
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
```

6. **Initialize database:**
```bash
npm run sync-db    # Create tables
npm run seed       # Add test data
```

7. **Start the application:**
```bash
# Option 1: Use startup script
start-demo.bat     # Windows
./start-demo.sh    # Linux/Mac

# Option 2: Manual start
npm run dev        # Backend (Terminal 1)
cd frontend && npm start  # Frontend (Terminal 2)
```

8. **Access the demo:**
- **Backend API:** http://localhost:3000
- **Frontend Demo:** http://localhost:3001

## 🧪 **Testing**

### **Automated Tests**
```bash
npm run test:security    # Security isolation tests
npm run test:performance # Performance tests
npm run test:all         # All tests
node validate-poc.js     # POC validation
```

### **Manual Testing**
1. **Frontend Demo:** http://localhost:3001
2. **API Testing:** Use the provided curl commands in `/docs`
3. **Database:** Check data in pgAdmin

## 📊 **Test Data**

The system comes with pre-configured test data:

### **Organizations:**
- **TechCorp** (2 brands: Education, Professional)
- **EduSoft** (direct organization-level courses)
- **LearnHub** (2 brands: Kids, Adults)

### **API Keys for Testing:**
- `org_1_brand_1_abc123def456` - TechCorp Education
- `org_1_brand_2_xyz789uvw012` - TechCorp Professional  
- `org_2_direct_ghi789jkl012` - EduSoft Direct
- `org_3_brand_3_def456ghi789` - LearnHub Kids
- `org_3_brand_4_mno123pqr456` - LearnHub Adults

## 🔧 **API Endpoints**

| Endpoint | Method | Description | Authentication |
|----------|--------|-------------|----------------|
| `/api/org/info` | GET | Get organization/brand info | API Key Required |
| `/api/courses` | GET | List accessible courses | API Key Required |
| `/api/courses/:id` | GET | Get specific course | API Key Required |
| `/api/courses/search` | GET | Search courses | API Key Required |

## 🛡️ **Security Features**

- ✅ **Multi-tenant Isolation** - Zero cross-organization data access
- ✅ **Brand-level Access Control** - Proper brand isolation
- ✅ **API Key Authentication** - Secure, scoped access
- ✅ **Input Validation** - All inputs validated and sanitized
- ✅ **Error Handling** - No sensitive data in error messages
- ✅ **Rate Limiting Ready** - Structure supports per-organization limits

## 📁 **Project Structure**

```
org-access-api/
├── src/
│   ├── controllers/     # API controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Authentication & validation
│   ├── config/         # Database configuration
│   ├── seeders/        # Test data
│   └── tests/          # Test suites
├── frontend/           # React frontend
├── docs/              # Documentation
├── .env               # Environment variables
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## 🎯 **Use Cases**

### **Real-World Scenario:**
- **Organization A** (TechCorp) creates courses for their brands
- **Organization C** (EduSoft) wants to display courses on their website
- **API Key** is shared with Organization C
- **Organization C** can only access their own courses, not TechCorp's
- **Brand Isolation** ensures TechCorp Education can't see TechCorp Professional courses

## 📈 **Performance Metrics**

- **Response Time:** < 100ms average
- **Concurrent Requests:** Tested with 10+ concurrent users
- **Database:** Optimized queries with proper indexing
- **Security:** 100% multi-tenant isolation verified

## 🔍 **Testing Results**

```
✅ POC Validation: 6/6 tests passed
✅ Security Tests: All isolation tests pass
✅ Performance Tests: < 100ms response times
✅ Frontend Tests: All features working
✅ Integration Tests: Frontend-backend communication verified
```

## 🛠️ **Tech Stack**

### **Backend:**
- **Runtime:** Node.js with Express.js
- **Database:** PostgreSQL with Sequelize ORM
- **Authentication:** API key-based with multi-tenant context
- **Security:** Helmet, CORS, input validation, bcrypt

### **Frontend:**
- **Framework:** React 19 with modern hooks
- **Styling:** CSS3 with gradients and animations
- **HTTP Client:** Axios for API communication
- **Design:** Responsive, mobile-first approach

## 📚 **Documentation**

- [API Documentation](docs/API_DOCUMENTATION.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [Security Guide](docs/SECURITY_GUIDE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 **Demo**

**Live Demo:** http://localhost:3001 (when running locally)

**Features to showcase:**
- Multi-tenant organization isolation
- Brand-level access control
- API key authentication
- Course management with proper scoping
- Security testing suite
- Modern, responsive UI

## 📞 **Support**

For questions or support, please open an issue in the GitHub repository.

---

**Built with ❤️ for demonstrating multi-tenant SaaS architecture and security best practices.**
