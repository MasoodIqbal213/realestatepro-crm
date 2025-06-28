/**
 * scripts/update-atlas-config.ts
 * Helper script to update .env.local with Atlas connection string
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

console.log('🔧 MongoDB Atlas Configuration Update');
console.log('=====================================');
console.log('');

console.log('📋 Your Atlas Connection String:');
console.log('mongodb+srv://billsplituser:<db_password>@cluster0.8mhwccb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
console.log('');

console.log('⚠️  IMPORTANT: You need to:');
console.log('1. Replace <db_password> with your actual password');
console.log('2. Add database name "realestatepro-crm" to the URI');
console.log('');

console.log('📝 Updated Connection String Format:');
console.log('mongodb+srv://billsplituser:YOUR_ACTUAL_PASSWORD@cluster0.8mhwccb.mongodb.net/realestatepro-crm?retryWrites=true&w=majority&appName=Cluster0');
console.log('');

console.log('🔧 Manual Update Instructions:');
console.log('1. Open .env.local file in your text editor');
console.log('2. Find the line: MONGODB_URI=mongodb://localhost:27017/realestatepro-crm');
console.log('3. Replace it with your Atlas connection string');
console.log('4. Make sure to:');
console.log('   - Replace <db_password> with your actual password');
console.log('   - Add /realestatepro-crm before the ? symbol');
console.log('5. Save the file');
console.log('');

console.log('📁 Your .env.local file location:');
console.log(path.resolve('.env.local'));
console.log('');

console.log('✅ After updating, run these commands:');
console.log('npm run db:check-uri        # Check configuration');
console.log('npm run db:test            # Test connection');
console.log('npm run db:verify-atlas    # Full Atlas verification');
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

console.log('🎯 Example of what your .env.local should look like:');
console.log('');
console.log('# Environment Configuration for RealEstatePro CRM');
console.log('# Copy this file to .env.local and fill in your actual values');
console.log('');
console.log('# Database Configuration');
console.log('MONGODB_URI=mongodb+srv://billsplituser:YOUR_ACTUAL_PASSWORD@cluster0.8mhwccb.mongodb.net/realestatepro-crm?retryWrites=true&w=majority&appName=Cluster0');
console.log('');
console.log('# JWT Configuration');
console.log('JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random');
console.log('JWT_EXPIRES_IN=7d');
console.log('');
console.log('# Application Configuration');
console.log('NODE_ENV=development');
console.log('NEXT_PUBLIC_APP_URL=http://localhost:3000');
console.log('');
console.log('# Logging Configuration');
console.log('LOG_LEVEL=info'); 