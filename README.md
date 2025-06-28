# RealEstatePro CRM

Next-generation multi-tenant real estate management platform designed to streamline every aspect of real-estate operations for building owners, their staff, and tenants.

## 🚀 Features

- **Multi-Tenancy**: Strict data isolation with per-tenant theming
- **Role-Based Access**: Super Admin, Building Admin, Receptionist, Sales, Maintenance, Tenant
- **Localization**: English + Arabic (RTL) support with UAE compliance
- **Real-time Notifications**: Email, SMS, and in-app notifications
- **Maintenance Management**: Complete workflow from request to resolution
- **Lead Management**: Visitor registration to tenant conversion
- **Payment Integration**: Stripe payment gateway integration
- **Document Management**: Contract and receipt storage
- **Analytics Dashboard**: Comprehensive reporting and insights

## 🛠 Tech Stack

### Frontend
- **Next.js 14** (App Router) with TypeScript
- **Tailwind CSS** + shadcn/ui component library
- **React Hook Form** + Zod validation
- **SWR/React Query** for data fetching
- **i18next** for internationalization
- **Framer Motion** for animations

### Backend
- **Next.js API Routes** with TypeScript
- **MongoDB** with Mongoose ODM
- **NextAuth.js** for authentication
- **JWT/OAuth2** with refresh tokens
- **Winston** for logging

### Infrastructure
- **Vercel/AWS** for hosting
- **MongoDB Atlas** for database
- **Redis** for caching and sessions
- **Docker** for containerization
- **GitHub Actions** for CI/CD

## 📋 Prerequisites

- Node.js 18+ 
- npm 9+
- MongoDB (local or Atlas)
- Redis (optional for development)

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/your-org/realestatepro-crm.git
cd realestatepro-crm
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
# Copy environment template
cp env.development.example .env.local

# Edit .env.local with your configuration
nano .env.local
```

### 4. Set up database
```bash
# Start MongoDB (if using local)
mongod

# Run database migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

### 5. Start development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗 Project Structure

```
realestatepro-crm/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── buildings/         # Building management
│   ├── tenants/           # Tenant management
│   ├── maintenance/       # Maintenance requests
│   ├── leads/             # Lead management
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── charts/           # Chart components
├── lib/                  # Utility libraries
│   ├── auth.ts          # Authentication utilities
│   ├── db.ts            # Database connection
│   ├── utils.ts         # General utilities
│   └── validations.ts   # Zod schemas
├── models/               # Mongoose models
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
├── locales/              # i18n translations
├── docs/                 # Documentation
└── scripts/              # Database scripts
```

## 🔧 Development

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
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with initial data

# Docker
npm run docker:dev       # Start development containers
npm run docker:prod      # Start production containers
```

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

## 🚀 Deployment

### Environment Setup

1. **Development**: Copy `env.development.example` to `.env.local`
2. **UAT**: Copy `env.uat.example` to `.env.uat`
3. **Production**: Copy `env.production.example` to `.env.production`

### CI/CD Pipeline

The project uses GitHub Actions for automated deployment:

- **CI**: Runs on every push to `develop` and `feature/*` branches
- **UAT Deployment**: Automatic deployment to UAT environment
- **Production Deployment**: Manual deployment with approval

### Environment Variables

Key environment variables:

```bash
# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/realestatepro_dev

# Authentication
NEXTAUTH_SECRET=your-secret-key
JWT_SECRET=your-jwt-secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Payment
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## 🔒 Security

- **Authentication**: JWT/OAuth2 with refresh token rotation
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Encryption at rest and in transit
- **Input Validation**: Zod schemas for all inputs
- **Rate Limiting**: API rate limiting middleware
- **CORS**: Configured CORS policies
- **Audit Trail**: Comprehensive action logging

## 🌐 Localization

The application supports English and Arabic with RTL support:

- **Default**: English
- **Supported**: English, Arabic
- **Timezone**: Asia/Dubai
- **Currency**: AED (UAE Dirham)
- **Date Format**: DD/MM/YYYY

## 📊 API Documentation

API documentation is available at `/api-docs` when running the application.

### Key Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/login` - User authentication
- `GET /api/buildings` - List buildings
- `GET /api/tenants` - List tenants
- `POST /api/maintenance` - Create maintenance request
- `GET /api/leads` - List leads

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write unit tests for new features
- Update documentation for API changes
- Follow the established code style
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Email**: support@realestatepro.com
- **Documentation**: [docs.realestatepro.com](https://docs.realestatepro.com)
- **Issues**: [GitHub Issues](https://github.com/your-org/realestatepro-crm/issues)

## 🗺 Roadmap

- [ ] Mobile application (React Native)
- [ ] Advanced analytics and reporting
- [ ] IoT integration for smart buildings
- [ ] AI-powered maintenance predictions
- [ ] Multi-language support expansion
- [ ] Advanced payment gateway integrations
- [ ] Real-time chat support
- [ ] Advanced document management 