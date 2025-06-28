/**
 * scripts/get-atlas-uri.ts
 * Helper script to get Atlas connection string and update configuration
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

console.log('🔗 MongoDB Atlas Connection Setup');
console.log('==================================');
console.log('');

console.log('✅ You already have MongoDB Atlas account and cluster!');
console.log('Let\'s connect your RealEstatePro CRM to it.');
console.log('');

// Check current configuration
const currentUri = process.env.MONGODB_URI;
if (currentUri) {
  const isAtlas = currentUri.includes('mongodb.net') || currentUri.includes('atlas');
  const isLocalhost = currentUri.includes('localhost') || currentUri.includes('127.0.0.1');
  
  console.log('📊 Current Configuration:');
  console.log(`Type: ${isAtlas ? '🌐 MongoDB Atlas' : isLocalhost ? '🏠 Local MongoDB' : '❓ Unknown'}`);
  
  if (isAtlas) {
    console.log('✅ You are already connected to MongoDB Atlas!');
    console.log('No changes needed.');
    process.exit(0);
  }
}

console.log('⚠️  You are currently connected to localhost.');
console.log('');

console.log('📋 Steps to connect to your existing Atlas cluster:');
console.log('');

console.log('1️⃣  Go to MongoDB Atlas Dashboard');
console.log('   - Visit: https://cloud.mongodb.com');
console.log('   - Sign in to your account');
console.log('');

console.log('2️⃣  Select Your Cluster');
console.log('   - Click on your existing cluster');
console.log('   - Make sure it\'s running (green status)');
console.log('');

console.log('3️⃣  Configure Network Access (if needed)');
console.log('   - Go to "Network Access" in left sidebar');
console.log('   - Click "Add IP Address"');
console.log('   - Choose "Allow Access from Anywhere" (0.0.0.0/0)');
console.log('   - Click "Confirm"');
console.log('');

console.log('4️⃣  Create Database User (if needed)');
console.log('   - Go to "Database Access" in left sidebar');
console.log('   - Click "Add New Database User"');
console.log('   - Username: realestatepro-admin (or any name)');
console.log('   - Password: Create a strong password');
console.log('   - Role: "Read and write to any database"');
console.log('   - Click "Add User"');
console.log('');

console.log('5️⃣  Get Connection String');
console.log('   - Click "Connect" button on your cluster');
console.log('   - Choose "Connect your application"');
console.log('   - Driver: "Node.js" (version 5.0 or later)');
console.log('   - Copy the connection string');
console.log('');

console.log('6️⃣  Update Your Configuration');
console.log('   - Open .env.local file');
console.log('   - Find the MONGODB_URI line');
console.log('   - Replace with your Atlas connection string');
console.log('   - Change database name to: realestatepro-crm');
console.log('');

console.log('📝 Example Atlas Connection String:');
console.log('mongodb+srv://realestatepro-admin:YourPassword123@cluster0.abc123.mongodb.net/realestatepro-crm?retryWrites=true&w=majority');
console.log('');

console.log('📁 Your .env.local file location:');
console.log(path.resolve('.env.local'));
console.log('');

console.log('🔧 After updating .env.local, run these commands:');
console.log('npm run db:check-uri        # Check configuration');
console.log('npm run db:test            # Test connection');
console.log('npm run db:verify-atlas    # Full Atlas verification');
console.log('');

console.log('❓ Need help? Check: docs/atlas-setup-guide.md');
console.log('');

// Show current .env.local content
try {
  const envPath = path.resolve('.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const mongoUriLine = envContent.split('\n').find(line => line.startsWith('MONGODB_URI='));
    
    if (mongoUriLine) {
      console.log('📄 Current MONGODB_URI in .env.local:');
      console.log(mongoUriLine);
      console.log('');
    }
  }
} catch (error) {
  console.log('Could not read .env.local file');
} 