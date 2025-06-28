# RealEstatePro CRM Setup Script for Windows
# This script initializes the project with all necessary configurations

param(
    [switch]$SkipDocker,
    [switch]$SkipBuild
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  RealEstatePro CRM Setup Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if Node.js is installed
function Test-NodeJS {
    try {
        $nodeVersion = node --version
        $majorVersion = [int]($nodeVersion -replace 'v(\d+)\.\d+\.\d+', '$1')
        
        if ($majorVersion -lt 18) {
            Write-Error "Node.js version 18+ is required. Current version: $nodeVersion"
            exit 1
        }
        
        Write-Success "Node.js version: $nodeVersion"
    }
    catch {
        Write-Error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    }
}

# Check if npm is installed
function Test-NPM {
    try {
        $npmVersion = npm --version
        Write-Success "npm version: $npmVersion"
    }
    catch {
        Write-Error "npm is not installed. Please install npm first."
        exit 1
    }
}

# Check if Git is installed
function Test-Git {
    try {
        $gitVersion = git --version
        Write-Success "Git version: $gitVersion"
    }
    catch {
        Write-Warning "Git is not installed. Some features may not work properly."
    }
}

# Initialize Git repository
function Initialize-Git {
    if (Get-Command git -ErrorAction SilentlyContinue) {
        if (-not (Test-Path ".git")) {
            Write-Status "Initializing Git repository..."
            git init
            Write-Success "Git repository initialized"
        }
        else {
            Write-Status "Git repository already exists"
        }
    }
}

# Install dependencies
function Install-Dependencies {
    Write-Status "Installing dependencies..."
    
    if (Test-Path "package-lock.json") {
        npm ci
    }
    else {
        npm install
    }
    
    Write-Success "Dependencies installed successfully"
}

# Setup environment files
function Setup-Environment {
    Write-Status "Setting up environment files..."
    
    if (-not (Test-Path ".env.local")) {
        if (Test-Path "env.development.example") {
            Copy-Item "env.development.example" ".env.local"
            Write-Success "Created .env.local from template"
            Write-Warning "Please update .env.local with your configuration"
        }
        else {
            Write-Warning "No environment template found. Please create .env.local manually"
        }
    }
    else {
        Write-Status ".env.local already exists"
    }
}

# Setup Husky hooks
function Setup-Husky {
    Write-Status "Setting up Husky hooks..."
    
    if (Test-Path "node_modules") {
        npx husky install
        Write-Success "Husky hooks installed"
    }
    else {
        Write-Warning "node_modules not found. Husky setup skipped"
    }
}

# Create necessary directories
function Create-Directories {
    Write-Status "Creating necessary directories..."
    
    $directories = @(
        "logs",
        "uploads",
        "public/images",
        "components/ui",
        "lib/utils",
        "lib/validations",
        "hooks",
        "types",
        "locales/en",
        "locales/ar",
        "models",
        "scripts"
    )
    
    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
        }
    }
    
    Write-Success "Directories created"
}

# Setup database (if Docker is available)
function Setup-Database {
    if ($SkipDocker) {
        Write-Warning "Docker setup skipped by user request"
        return
    }
    
    Write-Status "Setting up database..."
    
    try {
        $dockerVersion = docker --version
        $dockerComposeVersion = docker-compose --version
        
        Write-Status "Docker detected. Starting development database..."
        
        if (Test-Path "docker-compose.dev.yml") {
            docker-compose -f docker-compose.dev.yml up -d mongodb redis
            Write-Success "Development database started"
            Write-Status "MongoDB: http://localhost:27017"
            Write-Status "Mongo Express: http://localhost:8081"
            Write-Status "Redis: localhost:6379"
            Write-Status "Redis Commander: http://localhost:8082"
        }
        else {
            Write-Warning "docker-compose.dev.yml not found"
        }
    }
    catch {
        Write-Warning "Docker not detected. Please install Docker and Docker Compose for local database"
        Write-Status "You can use MongoDB Atlas or local MongoDB installation instead"
    }
}

# Run initial build
function Run-Build {
    if ($SkipBuild) {
        Write-Warning "Build skipped by user request"
        return
    }
    
    Write-Status "Running initial build..."
    
    try {
        npm run build
        Write-Success "Build completed successfully"
    }
    catch {
        Write-Warning "Build failed. This is normal for initial setup with missing components."
    }
}

# Setup TypeScript
function Setup-TypeScript {
    Write-Status "Setting up TypeScript..."
    
    if (Test-Path "tsconfig.json") {
        try {
            npx tsc --noEmit
            Write-Success "TypeScript configuration validated"
        }
        catch {
            Write-Warning "TypeScript validation failed. This is normal for initial setup."
        }
    }
    else {
        Write-Warning "tsconfig.json not found"
    }
}

# Setup linting
function Setup-Linting {
    Write-Status "Setting up linting..."
    
    try {
        npm run lint -- --fix
        Write-Success "Linting setup completed"
    }
    catch {
        Write-Warning "Linting issues found (this is normal for initial setup)"
    }
}

# Display next steps
function Show-NextSteps {
    Write-Host ""
    Write-Host "🎉 RealEstatePro CRM setup completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Update .env.local with your configuration"
    Write-Host "2. Start the development server: npm run dev"
    Write-Host "3. Open http://localhost:3000 in your browser"
    Write-Host ""
    Write-Host "Available commands:" -ForegroundColor Yellow
    Write-Host "  npm run dev          - Start development server"
    Write-Host "  npm run build        - Build for production"
    Write-Host "  npm run lint         - Run ESLint"
    Write-Host "  npm run type-check   - Run TypeScript checks"
    Write-Host "  npm run test         - Run tests"
    Write-Host "  npm run docker:dev   - Start development containers"
    Write-Host ""
    Write-Host "Documentation:" -ForegroundColor Yellow
    Write-Host "  - README.md          - Project overview and setup"
    Write-Host "  - docs/overview.md   - Detailed project documentation"
    Write-Host ""
    Write-Host "Happy coding! 🚀" -ForegroundColor Cyan
}

# Main setup function
function Main {
    Test-NodeJS
    Test-NPM
    Test-Git
    Initialize-Git
    Install-Dependencies
    Setup-Environment
    Setup-Husky
    Create-Directories
    Setup-Database
    Setup-TypeScript
    Setup-Linting
    Run-Build
    Show-NextSteps
}

# Run main function
Main 