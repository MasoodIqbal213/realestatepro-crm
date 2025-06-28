/**
 * scripts/fix-github-setup.ts
 * Fix GitHub repository setup issues
 */

import { execSync } from 'child_process';

console.log('🔧 GitHub Repository Setup Fix');
console.log('==============================');
console.log('');

console.log('🚨 Issue Detected:');
console.log('The error "Repository not found" means you need to:');
console.log('1. Create the GitHub repository first');
console.log('2. Use your actual GitHub username');
console.log('');

console.log('🔍 To find your GitHub username:');
console.log('1. Go to https://github.com');
console.log('2. Sign in to your account');
console.log('3. Look at the URL or your profile');
console.log('4. Your username is in the URL: https://github.com/YOUR_USERNAME');
console.log('');

console.log('📋 Step-by-Step Fix:');
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

console.log('2️⃣  Get your GitHub username from the repository URL');
console.log('   After creating the repo, the URL will be:');
console.log('   https://github.com/YOUR_USERNAME/realestatepro-crm');
console.log('   Copy YOUR_USERNAME from this URL');
console.log('');

console.log('3️⃣  Run these commands (replace YOUR_USERNAME with your actual username):');
console.log('   git remote remove origin');
console.log('   git remote add origin https://github.com/YOUR_USERNAME/realestatepro-crm.git');
console.log('   git branch -M main');
console.log('   git push -u origin main');
console.log('');

console.log('4️⃣  Set up branch strategy:');
console.log('   git checkout -b develop');
console.log('   git push -u origin develop');
console.log('');

console.log('🔍 Current Git Status:');
try {
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  if (status.trim()) {
    console.log('📄 Modified files:');
    console.log(status);
  } else {
    console.log('✅ All files are committed');
  }
} catch (error) {
  console.log('❌ Could not check git status');
}

console.log('');

console.log('🎯 Quick Commands to Test:');
console.log('   npm run dev              # Start development server');
console.log('   curl http://localhost:3000/api/health   # Test health endpoint');
console.log('   curl http://localhost:3000/api/docs     # View Swagger docs');
console.log('');

console.log('✅ Next.js config warnings have been fixed!');
console.log('   - Removed deprecated appDir option');
console.log('   - Fixed localeDetection value');
console.log('   - Removed unused env.CUSTOM_KEY');
console.log('');

console.log('🎉 After fixing GitHub, you can:');
console.log('   - Share the repository with your team');
console.log('   - Set up GitHub Actions for CI/CD');
console.log('   - Create feature branches for development');
console.log('   - Track issues and pull requests'); 