/**
 * scripts/show-config.ts
 * Display current MongoDB configuration
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

console.log('🔍 Current MongoDB Configuration');
console.log('================================');
console.log('');

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.log('❌ MONGODB_URI is not set');
  process.exit(1);
}

console.log('Current MONGODB_URI:');
console.log(mongoUri);
console.log('');

const isAtlas = mongoUri.includes('mongodb.net') || mongoUri.includes('atlas');
const isLocalhost = mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1');

if (isLocalhost) {
  console.log('⚠️  You are currently connected to LOCALHOST');
  console.log('');
  console.log('To connect to MongoDB Atlas:');
  console.log('1. Go to MongoDB Atlas dashboard');
  console.log('2. Click "Connect" on your cluster');
  console.log('3. Choose "Connect your application"');
  console.log('4. Copy the connection string');
  console.log('5. Update .env.local file');
} else if (isAtlas) {
  console.log('✅ You are connected to MongoDB Atlas!');
} else {
  console.log('❓ Unknown connection type');
} 