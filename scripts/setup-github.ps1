# GitHub Repository Setup Script for RealEstatePro CRM
# This script automates the GitHub setup process

Write-Host "🚀 Automated GitHub Repository Setup" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Check if git is available
Write-Host "🔍 Checking Git Status..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✅ Git is available: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed or not available in PATH" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check if git is initialized
if (Test-Path ".git") {
    Write-Host "✅ Git repository already initialized" -ForegroundColor Green
} else {
    Write-Host "📁 Initializing Git repository..." -ForegroundColor Yellow
    try {
        git init
        Write-Host "✅ Git repository initialized" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to initialize Git repository" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Check what files would be added
Write-Host "📋 Files to be committed:" -ForegroundColor Yellow
Write-Host ""

$filesToAdd = @(
    "package.json",
    "lib/",
    "models/",
    "app/",
    "components/",
    "scripts/",
    "docs/",
    "README.md",
    ".gitignore",
    "next.config.js",
    "tailwind.config.js",
    "tsconfig.json",
    "Dockerfile",
    "docker-compose.dev.yml"
)

foreach ($file in $filesToAdd) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    }
}

Write-Host ""

# Add all files
Write-Host "📦 Adding files to Git..." -ForegroundColor Yellow
try {
    git add .
    Write-Host "✅ Files added to staging area" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to add files to Git" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check staged files
$stagedFiles = git status --porcelain
if ($stagedFiles) {
    Write-Host "📄 Staged files:" -ForegroundColor Yellow
    $stagedFiles | ForEach-Object {
        if ($_.Trim()) {
            $status = $_.Substring(0, 2)
            $file = $_.Substring(3)
            Write-Host "   $status $file" -ForegroundColor Cyan
        }
    }
} else {
    Write-Host "⚠️  No files staged for commit" -ForegroundColor Yellow
}

Write-Host ""

# Create initial commit
Write-Host "💾 Creating initial commit..." -ForegroundColor Yellow
try {
    git commit -m "Sprint 1: Initial setup - MongoDB Atlas, logging, user model, Swagger docs"
    Write-Host "✅ Initial commit created successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create commit" -ForegroundColor Red
    Write-Host "This might be because no files were staged or git user is not configured" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔧 To configure git user:" -ForegroundColor Yellow
    Write-Host "   git config --global user.name `"Your Name`"" -ForegroundColor Cyan
    Write-Host "   git config --global user.email `"your.email@example.com`"" -ForegroundColor Cyan
    exit 1
}

Write-Host ""

# Get commit hash
try {
    $commitHash = git rev-parse HEAD
    if ($commitHash) {
        Write-Host "📝 Commit Hash: $($commitHash.Substring(0, 8))" -ForegroundColor Cyan
    }
} catch {
    Write-Host "⚠️  Could not get commit hash" -ForegroundColor Yellow
}

Write-Host ""

Write-Host "🎯 Next Steps for GitHub:" -ForegroundColor Green
Write-Host ""

Write-Host "1️⃣  Create GitHub Repository:" -ForegroundColor Yellow
Write-Host "   - Go to https://github.com" -ForegroundColor White
Write-Host "   - Click `"New repository`"" -ForegroundColor White
Write-Host "   - Repository name: realestatepro-crm" -ForegroundColor White
Write-Host "   - Description: Enterprise multi-tenant real estate management CRM" -ForegroundColor White
Write-Host "   - Make it Private (recommended)" -ForegroundColor White
Write-Host "   - Don't initialize with README (we already have one)" -ForegroundColor White
Write-Host "   - Click `"Create repository`"" -ForegroundColor White
Write-Host ""

Write-Host "2️⃣  Connect and Push (run these commands):" -ForegroundColor Yellow
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/realestatepro-crm.git" -ForegroundColor Cyan
Write-Host "   git branch -M main" -ForegroundColor Cyan
Write-Host "   git push -u origin main" -ForegroundColor Cyan
Write-Host ""

Write-Host "3️⃣  Set up branch strategy:" -ForegroundColor Yellow
Write-Host "   git checkout -b develop" -ForegroundColor Cyan
Write-Host "   git push -u origin develop" -ForegroundColor Cyan
Write-Host ""

Write-Host "📊 Sprint 1 Progress Committed:" -ForegroundColor Green
Write-Host "   ✅ Monorepo setup (Next.js, MongoDB, Docker)" -ForegroundColor Green
Write-Host "   ✅ MongoDB Atlas connection" -ForegroundColor Green
Write-Host "   ✅ User model with RBAC" -ForegroundColor Green
Write-Host "   ✅ Logging system (Winston)" -ForegroundColor Green
Write-Host "   ✅ Swagger documentation" -ForegroundColor Green
Write-Host "   ✅ Health check endpoint" -ForegroundColor Green
Write-Host "   ✅ Database connection utilities" -ForegroundColor Green
Write-Host "   ✅ Environment configuration" -ForegroundColor Green
Write-Host "   ✅ GitHub setup automation" -ForegroundColor Green
Write-Host ""

Write-Host "🔍 Test Your Setup:" -ForegroundColor Yellow
Write-Host "   npm run dev              # Start development server" -ForegroundColor Cyan
Write-Host "   curl http://localhost:3000/api/health   # Test health endpoint" -ForegroundColor Cyan
Write-Host "   curl http://localhost:3000/api/docs     # View Swagger docs" -ForegroundColor Cyan
Write-Host ""

Write-Host "📚 Documentation Created:" -ForegroundColor Yellow
Write-Host "   README.md                    # Project overview" -ForegroundColor White
Write-Host "   docs/atlas-setup-guide.md    # MongoDB Atlas setup" -ForegroundColor White
Write-Host "   docs/github-swagger-plan.md  # GitHub & Swagger plan" -ForegroundColor White
Write-Host "   docs/overview.md             # System architecture" -ForegroundColor White
Write-Host ""

Write-Host "🎉 Ready for Team Collaboration!" -ForegroundColor Green
Write-Host "   - Share repository with your team" -ForegroundColor White
Write-Host "   - Set up GitHub Actions for CI/CD" -ForegroundColor White
Write-Host "   - Create feature branches for development" -ForegroundColor White
Write-Host "   - Track issues and pull requests" -ForegroundColor White
Write-Host "   - Deploy to production environments" -ForegroundColor White 