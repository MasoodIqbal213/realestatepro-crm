#!/bin/bash

# RealEstatePro CRM Setup Script
# This script initializes the project with all necessary configurations

set -e

echo "🚀 Setting up RealEstatePro CRM..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js version: $(node -v)"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "npm version: $(npm -v)"
}

# Check if Git is installed
check_git() {
    if ! command -v git &> /dev/null; then
        print_warning "Git is not installed. Some features may not work properly."
    else
        print_success "Git version: $(git --version)"
    fi
}

# Initialize Git repository
init_git() {
    if command -v git &> /dev/null; then
        if [ ! -d ".git" ]; then
            print_status "Initializing Git repository..."
            git init
            print_success "Git repository initialized"
        else
            print_status "Git repository already exists"
        fi
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    print_success "Dependencies installed successfully"
}

# Setup environment files
setup_env() {
    print_status "Setting up environment files..."
    
    if [ ! -f ".env.local" ]; then
        if [ -f "env.development.example" ]; then
            cp env.development.example .env.local
            print_success "Created .env.local from template"
            print_warning "Please update .env.local with your configuration"
        else
            print_warning "No environment template found. Please create .env.local manually"
        fi
    else
        print_status ".env.local already exists"
    fi
}

# Setup Husky hooks
setup_husky() {
    print_status "Setting up Husky hooks..."
    
    if [ -d "node_modules" ]; then
        npx husky install
        print_success "Husky hooks installed"
    else
        print_warning "node_modules not found. Husky setup skipped"
    fi
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p logs
    mkdir -p uploads
    mkdir -p public/images
    mkdir -p components/ui
    mkdir -p lib/utils
    mkdir -p lib/validations
    mkdir -p hooks
    mkdir -p types
    mkdir -p locales/en
    mkdir -p locales/ar
    mkdir -p models
    mkdir -p scripts
    
    print_success "Directories created"
}

# Setup database (if Docker is available)
setup_database() {
    print_status "Setting up database..."
    
    if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
        print_status "Docker detected. Starting development database..."
        
        if [ -f "docker-compose.dev.yml" ]; then
            docker-compose -f docker-compose.dev.yml up -d mongodb redis
            print_success "Development database started"
            print_status "MongoDB: http://localhost:27017"
            print_status "Mongo Express: http://localhost:8081"
            print_status "Redis: localhost:6379"
            print_status "Redis Commander: http://localhost:8082"
        else
            print_warning "docker-compose.dev.yml not found"
        fi
    else
        print_warning "Docker not detected. Please install Docker and Docker Compose for local database"
        print_status "You can use MongoDB Atlas or local MongoDB installation instead"
    fi
}

# Run initial build
run_build() {
    print_status "Running initial build..."
    
    npm run build
    
    print_success "Build completed successfully"
}

# Setup TypeScript
setup_typescript() {
    print_status "Setting up TypeScript..."
    
    if [ -f "tsconfig.json" ]; then
        npx tsc --noEmit
        print_success "TypeScript configuration validated"
    else
        print_warning "tsconfig.json not found"
    fi
}

# Setup linting
setup_linting() {
    print_status "Setting up linting..."
    
    npm run lint -- --fix || print_warning "Linting issues found (this is normal for initial setup)"
    
    print_success "Linting setup completed"
}

# Display next steps
show_next_steps() {
    echo ""
    echo "🎉 RealEstatePro CRM setup completed!"
    echo ""
    echo "Next steps:"
    echo "1. Update .env.local with your configuration"
    echo "2. Start the development server: npm run dev"
    echo "3. Open http://localhost:3000 in your browser"
    echo ""
    echo "Available commands:"
    echo "  npm run dev          - Start development server"
    echo "  npm run build        - Build for production"
    echo "  npm run lint         - Run ESLint"
    echo "  npm run type-check   - Run TypeScript checks"
    echo "  npm run test         - Run tests"
    echo "  npm run docker:dev   - Start development containers"
    echo ""
    echo "Documentation:"
    echo "  - README.md          - Project overview and setup"
    echo "  - docs/overview.md   - Detailed project documentation"
    echo ""
    echo "Happy coding! 🚀"
}

# Main setup function
main() {
    echo "=========================================="
    echo "  RealEstatePro CRM Setup Script"
    echo "=========================================="
    echo ""
    
    check_node
    check_npm
    check_git
    init_git
    install_dependencies
    setup_env
    setup_husky
    create_directories
    setup_database
    setup_typescript
    setup_linting
    run_build
    show_next_steps
}

# Run main function
main "$@" 