# RealEstatePro CRM

**Next-generation multi-tenant real estate management platform**

[![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.3.0-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## 🎉 Sprint 1 Complete!

**Status**: ✅ **COMPLETED** - Authentication, RBAC, User Management, and Database Seeding

### ✅ Sprint 1 Deliverables
- **Authentication System**: JWT-based login with secure password validation
- **Role-Based Access Control**: Complete RBAC with role hierarchy and middleware
- **User Management**: Full CRUD operations with filtering and pagination
- **Database Seeding**: Comprehensive initial data with sample users and companies
- **API Documentation**: Interactive Swagger UI documentation
- **Logging System**: Structured logging for all user actions and system events
- **UAT Guide**: Comprehensive testing procedures and test cases

### 🚀 Quick Start (Sprint 1)

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd CREM
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp env.local.example .env.local
   # Edit .env.local with your MongoDB Atlas connection string
   ```

3. **Seed Database**
   ```bash
   npm run db:seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Test the System**
   - Visit: `http://localhost:3000/api/docs` for API documentation
   - Login with: `superadmin@realestatepro.com` / `SuperAdmin123!`
   - Run UAT tests: See `docs/sprint1-uat-guide.md`

## 📋 Project Overview

RealEstatePro CRM is a comprehensive, enterprise-grade real estate management platform designed for multi-tenant operations. The system supports Super Admins who onboard and manage real estate companies, each with their own admins, buildings, flats, and users across different roles.

### 🏗️ Architecture

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes with MongoDB/Mongoose
- **Database**: MongoDB Atlas (cloud-hosted)
- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-Based Access Control (RBAC)
- **Logging**: Winston with structured logging
- **Documentation**: Swagger/OpenAPI 3.0

### 👥 User Roles & Permissions

| Role | Permissions | Access Level |
|------|-------------|--------------|
| **Super Admin** | Full system access | Global |
| **Admin** | Company management | Real Estate |
| **Sales** | Sales operations | Building |
| **Maintenance** | Maintenance requests | Building |
| **Receptionist** | Visitor management | Building |
| **Tenant** | Personal account | Unit |

### 🏢 Multi-Tenant Structure

```
Super Admin
├── Real Estate Company A
│   ├── Admin A
│   ├── Building A1
│   │   ├── Sales A1
│   │   ├── Maintenance A1
│   │   ├── Receptionist A1
│   │   └── Tenants A1
│   └── Building A2
│       └── ...
└── Real Estate Company B
    └── ...
```

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm 9+
- MongoDB Atlas account
- Git

### Environment Setup

1. **Copy environment template**
   ```bash
   cp env.local.example .env.local
   ```

2. **Configure MongoDB Atlas**
   - Create cluster at [MongoDB Atlas](https://cloud.mongodb.com)
   - Get connection string
   - Update `MONGODB_URI` in `.env.local`

3. **Set JWT Secret**
   ```bash
   # Generate a secure random string
   openssl rand -base64 32
   # Add to .env.local as JWT_SECRET
   ```

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript checks
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage

# Database
npm run db:seed          # Seed database with initial data
npm run db:test          # Test database connection
npm run db:verify-atlas  # Verify Atlas connection

# Docker
npm run docker:dev       # Start development containers
npm run docker:prod      # Start production containers
```

### API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/health` | System health check | No |
| `GET` | `/api/docs` | API documentation | No |
| `POST` | `/api/auth/login` | User authentication | No |
| `GET` | `/api/users` | List users | Admin+ |
| `POST` | `/api/users` | Create user | Admin+ |

### Testing

#### Manual Testing
1. **Start the server**: `npm run dev`
2. **Seed the database**: `npm run db:seed`
3. **Access API docs**: `http://localhost:3000/api/docs`
4. **Test login**: Use credentials from seeding output

#### Automated Testing
```bash
# Run UAT guide tests
# See docs/sprint1-uat-guide.md for comprehensive test cases

# Test specific endpoints
curl http://localhost:3000/api/health
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@realestatepro.com","password":"SuperAdmin123!"}'
```

## 📚 Documentation

- **[Sprint 1 UAT Guide](docs/sprint1-uat-guide.md)** - Comprehensive testing procedures
- **[MongoDB Atlas Setup](docs/mongodb-atlas-setup.md)** - Database configuration guide
- **[API Documentation](http://localhost:3000/api/docs)** - Interactive Swagger UI
- **[Project Overview](docs/overview.md)** - Detailed project documentation

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **RBAC**: Role-based access control with hierarchy
- **Multi-tenant Isolation**: Data separation between companies
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Secure cross-origin requests

## 📊 Monitoring & Logging

- **Structured Logging**: JSON format with timestamps
- **User Actions**: All user operations logged
- **System Events**: Startup, shutdown, errors
- **Performance Metrics**: Response times, database queries
- **Error Tracking**: Stack traces and error codes

## 🚀 Deployment

### Environment Configuration

1. **Development**: Copy `env.local.example` to `.env.local`
2. **UAT**: Copy `env.uat.example` to `.env.uat`
3. **Production**: Copy `env.production.example` to `.env.production`

### Docker Deployment

```bash
# Development
npm run docker:dev

# Production
npm run docker:prod
```

### Environment Variables

Key environment variables:

```bash
# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Logging
LOG_LEVEL=info
```

## 🤝 Contributing

### Branch Strategy

- `main` → Production
- `uat` → User Acceptance Testing
- `develop` → Integration
- `feature/{module-name}` → Feature development

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(auth): add JWT refresh token support
fix(api): resolve user creation validation error
docs(readme): update installation instructions
```

## 📈 Roadmap

### ✅ Sprint 1 (COMPLETED)
- [x] Authentication & Authorization
- [x] User Management
- [x] RBAC Implementation
- [x] Database Seeding
- [x] API Documentation
- [x] Logging System

### 🔄 Sprint 2 (PLANNED)
- [ ] Real Estate Management
- [ ] Building Management
- [ ] Unit/Flat Management
- [ ] Tenant Management
- [ ] Dashboard UI

### 🔄 Sprint 3 (PLANNED)
- [ ] Maintenance Requests
- [ ] Payment Processing
- [ ] Visitor Management
- [ ] Reporting & Analytics
- [ ] Mobile Responsiveness

## 📞 Support

- **Documentation**: Check the `docs/` directory
- **API Docs**: Visit `/api/docs` when server is running
- **Issues**: Create GitHub issues for bugs or feature requests
- **Email**: support@realestatepro.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by the RealEstatePro Team** 