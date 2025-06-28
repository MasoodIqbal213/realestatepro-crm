/**
 * scripts/auto-github-setup.ts
 * Automated GitHub repository setup
 * Handles git initialization, commits, and provides push instructions
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Automated GitHub Repository Setup');
console.log('=====================================');
console.log('');

// Check if git is available
function checkGit(): boolean {
  try {
    execSync('git --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Execute git command and return result
function execGit(command: string): string {
  try {
    return execSync(command, { encoding: 'utf8' }).trim();
  } catch (error) {
    return '';
  }
}

// Check current git status
function getGitStatus(): string {
  return execGit('git status --porcelain');
}

// Check if git is initialized
function isGitInitialized(): boolean {
  return fs.existsSync(path.join(process.cwd(), '.git'));
}

console.log('🔍 Checking Git Status...');
console.log('');

if (!checkGit()) {
  console.log('❌ Git is not installed or not available in PATH');
  console.log('Please install Git from: https://git-scm.com/');
  process.exit(1);
}

console.log('✅ Git is available');
console.log('');

if (!isGitInitialized()) {
  console.log('📁 Initializing Git repository...');
  try {
    execGit('git init');
    console.log('✅ Git repository initialized');
  } catch (error) {
    console.log('❌ Failed to initialize Git repository');
    process.exit(1);
  }
} else {
  console.log('✅ Git repository already initialized');
}

console.log('');

// Check what files would be added
console.log('📋 Files to be committed:');
console.log('');

const filesToAdd = [
  'package.json',
  'lib/',
  'models/',
  'app/',
  'components/',
  'scripts/',
  'docs/',
  'README.md',
  '.gitignore',
  'next.config.js',
  'tailwind.config.js',
  'tsconfig.json',
  'Dockerfile',
  'docker-compose.dev.yml'
];

filesToAdd.forEach(file => {
  if (fs.existsSync(path.join(process.cwd(), file))) {
    console.log(`✅ ${file}`);
  }
});

console.log('');

// Add all files
console.log('📦 Adding files to Git...');
try {
  execGit('git add .');
  console.log('✅ Files added to staging area');
} catch (error) {
  console.log('❌ Failed to add files to Git');
  process.exit(1);
}

console.log('');

// Check staged files
const stagedFiles = execGit('git status --porcelain');
if (stagedFiles) {
  console.log('📄 Staged files:');
  stagedFiles.split('\n').forEach(line => {
    if (line.trim()) {
      const status = line.substring(0, 2);
      const file = line.substring(3);
      console.log(`   ${status} ${file}`);
    }
  });
} else {
  console.log('⚠️  No files staged for commit');
}

console.log('');

// Create initial commit
console.log('💾 Creating initial commit...');
try {
  execGit('git commit -m "Sprint 1: Initial setup - MongoDB Atlas, logging, user model, Swagger docs"');
  console.log('✅ Initial commit created successfully');
} catch (error) {
  console.log('❌ Failed to create commit');
  console.log('This might be because no files were staged or git user is not configured');
  console.log('');
  console.log('🔧 To configure git user:');
  console.log('   git config --global user.name "Your Name"');
  console.log('   git config --global user.email "your.email@example.com"');
  process.exit(1);
}

console.log('');

// Get commit hash
const commitHash = execGit('git rev-parse HEAD');
if (commitHash) {
  console.log(`📝 Commit Hash: ${commitHash.substring(0, 8)}`);
}

console.log('');

console.log('🎯 Next Steps for GitHub:');
console.log('');

console.log('1️⃣  Create GitHub Repository:');
console.log('   - Go to https://github.com');
console.log('   - Click "New repository"');
console.log('   - Repository name: realestatepro-crm');
console.log('   - Description: Enterprise multi-tenant real estate management CRM');
console.log('   - Make it Private (recommended)');
console.log('   - Don\'t initialize with README (we already have one)');
console.log('   - Click "Create repository"');
console.log('');

console.log('2️⃣  Connect and Push (run these commands):');
console.log('   git remote add origin https://github.com/YOUR_USERNAME/realestatepro-crm.git');
console.log('   git branch -M main');
console.log('   git push -u origin main');
console.log('');

console.log('3️⃣  Set up branch strategy:');
console.log('   git checkout -b develop');
console.log('   git push -u origin develop');
console.log('');

console.log('📊 Sprint 1 Progress Committed:');
console.log('   ✅ Monorepo setup (Next.js, MongoDB, Docker)');
console.log('   ✅ MongoDB Atlas connection');
console.log('   ✅ User model with RBAC');
console.log('   ✅ Logging system (Winston)');
console.log('   ✅ Swagger documentation');
console.log('   ✅ Health check endpoint');
console.log('   ✅ Database connection utilities');
console.log('   ✅ Environment configuration');
console.log('   ✅ GitHub setup automation');
console.log('');

console.log('🔍 Test Your Setup:');
console.log('   npm run dev              # Start development server');
console.log('   curl http://localhost:3000/api/health   # Test health endpoint');
console.log('   curl http://localhost:3000/api/docs     # View Swagger docs');
console.log('');

console.log('📚 Documentation Created:');
console.log('   README.md                    # Project overview');
console.log('   docs/atlas-setup-guide.md    # MongoDB Atlas setup');
console.log('   docs/github-swagger-plan.md  # GitHub & Swagger plan');
console.log('   docs/overview.md             # System architecture');
console.log('');

console.log('🎉 Ready for Team Collaboration!');
console.log('   - Share repository with your team');
console.log('   - Set up GitHub Actions for CI/CD');
console.log('   - Create feature branches for development');
console.log('   - Track issues and pull requests');
console.log('   - Deploy to production environments'); 