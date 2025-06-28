/**
 * scripts/setup-atlas.ts
 * Interactive Atlas connection setup helper
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

console.log('🚀 MongoDB Atlas Connection Setup');
console.log('==================================');
console.log('');

console.log('📋 Prerequisites:');
console.log('1. MongoDB Atlas account (free tier)');
console.log('2. Cluster created and running');
console.log('3. Network access configured');
console.log('4. Database user created');
console.log('5. Connection string ready');
console.log('');

console.log('🔗 Your Atlas connection string should look like:');
console.log('mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority');
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

console.log('📝 To connect to MongoDB Atlas:');
console.log('');
console.log('1. Go to MongoDB Atlas dashboard');
console.log('2. Click "Connect" on your cluster');
console.log('3. Choose "Connect your application"');
console.log('4. Select "Node.js" driver');
console.log('5. Copy the connection string');
console.log('6. Update your .env.local file');
console.log('');

console.log('📁 Your .env.local file location:');
console.log(path.resolve('.env.local'));
console.log('');

console.log('🔧 Manual Update Instructions:');
console.log('1. Open .env.local in your text editor');
console.log('2. Find the MONGODB_URI line');
console.log('3. Replace the entire line with your Atlas connection string');
console.log('4. Save the file');
console.log('5. Run: npm run db:verify-atlas');
console.log('');

console.log('📚 For detailed instructions, see: docs/atlas-setup-guide.md');
console.log('');

console.log('🎯 Quick Commands After Setup:');
console.log('npm run db:check-uri     # Check configuration');
console.log('npm run db:test          # Test connection');
console.log('npm run db:verify-atlas  # Full Atlas verification');
console.log('npm run db:seed          # Seed database with initial data'); 