/**
 * scripts/debug-connection.ts
 * Debug script to check MongoDB URI format and identify issues
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

console.log('🔍 MongoDB Connection String Debug');
console.log('==================================');
console.log('');

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.log('❌ MONGODB_URI is not set in .env.local');
  process.exit(1);
}

console.log('📋 Current MONGODB_URI:');
console.log(mongoUri);
console.log('');

// Check URI format
const isAtlas = mongoUri.includes('mongodb.net') || mongoUri.includes('atlas');
const isLocalhost = mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1');

console.log('🔍 URI Analysis:');
console.log(`Type: ${isAtlas ? '🌐 MongoDB Atlas' : isLocalhost ? '🏠 Local MongoDB' : '❓ Unknown'}`);
console.log(`Length: ${mongoUri.length} characters`);
console.log(`Contains mongodb+srv: ${mongoUri.includes('mongodb+srv://')}`);
console.log(`Contains mongodb.net: ${mongoUri.includes('mongodb.net')}`);
console.log(`Contains username: ${mongoUri.includes('billsplituser')}`);
console.log(`Contains password: ${mongoUri.includes('P@kistan$6789')}`);
console.log(`Contains database name: ${mongoUri.includes('/realestatepro-crm')}`);
console.log('');

// Check for common issues
const issues = [];

if (!mongoUri.startsWith('mongodb+srv://')) {
  issues.push('❌ URI should start with mongodb+srv://');
}

if (!mongoUri.includes('mongodb.net')) {
  issues.push('❌ URI should contain mongodb.net domain');
}

if (!mongoUri.includes('billsplituser')) {
  issues.push('❌ Username "billsplituser" not found in URI');
}

if (!mongoUri.includes('P@kistan$6789')) {
  issues.push('❌ Password not found in URI');
}

if (!mongoUri.includes('/realestatepro-crm')) {
  issues.push('❌ Database name "/realestatepro-crm" not found in URI');
}

if (mongoUri.includes('<db_password>')) {
  issues.push('❌ URI still contains placeholder <db_password>');
}

if (issues.length > 0) {
  console.log('🚨 Issues Found:');
  issues.forEach(issue => console.log(issue));
  console.log('');
} else {
  console.log('✅ URI format looks correct');
}

console.log('📝 Expected Format:');
console.log('mongodb+srv://billsplituser:P@kistan$6789@cluster0.8mhwccb.mongodb.net/realestatepro-crm?retryWrites=true&w=majority&appName=Cluster0');
console.log('');

console.log('🔧 If there are issues, check your .env.local file and ensure:');
console.log('1. The URI is on a single line');
console.log('2. No extra spaces or characters');
console.log('3. Password is correctly inserted');
console.log('4. Database name is included');
console.log('');

// Try to parse the URI
try {
  const url = new URL(mongoUri);
  console.log('✅ URI parsing successful');
  console.log(`Protocol: ${url.protocol}`);
  console.log(`Hostname: ${url.hostname}`);
  console.log(`Pathname: ${url.pathname}`);
  console.log(`Search: ${url.search}`);
} catch (error) {
  console.log('❌ URI parsing failed:');
  console.log(error instanceof Error ? error.message : 'Unknown error');
} 