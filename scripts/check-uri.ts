/**
 * scripts/check-uri.ts
 * Simple script to check MongoDB URI configuration
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const mongoUri = process.env.MONGODB_URI;

console.log('🔍 MongoDB URI Configuration Check');
console.log('==================================');
console.log('');

if (!mongoUri) {
  console.log('❌ MONGODB_URI is not set in .env.local');
  process.exit(1);
}

console.log('✅ MONGODB_URI is set');

// Check connection type
const isAtlas = mongoUri.includes('mongodb.net') || mongoUri.includes('atlas');
const isLocalhost = mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1');

console.log('');
console.log('📋 Connection Details:');
console.log(`Type: ${isAtlas ? '🌐 MongoDB Atlas' : isLocalhost ? '🏠 Local MongoDB' : '❓ Unknown'}`);

if (isLocalhost) {
  console.log('');
  console.log('⚠️  WARNING: You are connected to localhost, not MongoDB Atlas!');
  console.log('');
  console.log('To connect to MongoDB Atlas:');
  console.log('1. Go to MongoDB Atlas dashboard');
  console.log('2. Click "Connect" on your cluster');
  console.log('3. Choose "Connect your application"');
  console.log('4. Copy the connection string');
  console.log('5. Update MONGODB_URI in .env.local');
  console.log('');
  console.log('Example Atlas URI:');
  console.log('mongodb+srv://username:password@cluster.mongodb.net/database');
} else if (isAtlas) {
  console.log('');
  console.log('✅ You are connected to MongoDB Atlas!');
  
  // Mask sensitive parts
  const maskedUri = mongoUri.replace(/(mongodb\+srv?:\/\/)([^:]+):([^@]+)@/, '$1***:***@');
  console.log(`Connection: ${maskedUri}`);
} else {
  console.log('');
  console.log('❓ Unknown connection type');
  console.log('URI format not recognized');
}

console.log('');
console.log('To test the connection, run: npm run db:test');
console.log('To verify Atlas connection, run: npm run db:verify-atlas'); 