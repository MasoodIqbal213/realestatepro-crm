/**
 * scripts/fix-atlas-uri.ts
 * Helper script to fix Atlas connection string issues
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

console.log('🔧 MongoDB Atlas URI Fix');
console.log('========================');
console.log('');

const mongoUri = process.env.MONGODB_URI;

console.log('📋 Your Atlas Connection Details:');
console.log('Username: billsplituser');
console.log('Password: P@kistan$6789');
console.log('Cluster: cluster0.8mhwccb.mongodb.net');
console.log('Database: realestatepro-crm');
console.log('');

console.log('🚨 The error "URI must include hostname, domain name, and tld" usually means:');
console.log('1. The connection string format is incorrect');
console.log('2. The .env.local file hasn\'t been updated yet');
console.log('3. There are extra spaces or characters in the URI');
console.log('4. The password contains special characters that need encoding');
console.log('');

console.log('📝 CORRECT Connection String:');
console.log('mongodb+srv://billsplituser:P%40kistan%246789@cluster0.8mhwccb.mongodb.net/realestatepro-crm?retryWrites=true&w=majority&appName=Cluster0');
console.log('');

console.log('⚠️  IMPORTANT: Your password contains special characters that need URL encoding:');
console.log('- @ becomes %40');
console.log('- $ becomes %24');
console.log('- # becomes %23');
console.log('- % becomes %25');
console.log('');

console.log('🔧 Steps to Fix:');
console.log('1. Open your .env.local file');
console.log('2. Find the MONGODB_URI line');
console.log('3. Replace it with the CORRECT string above');
console.log('4. Save the file');
console.log('5. Run: npm run db:test');
console.log('');

console.log('📁 Your .env.local file location:');
console.log(process.cwd() + '\\.env.local');
console.log('');

if (mongoUri) {
  console.log('📄 Current MONGODB_URI in .env.local:');
  console.log(mongoUri);
  console.log('');
  
  if (mongoUri.includes('P@kistan$6789')) {
    console.log('❌ Issue: Password contains special characters that need URL encoding');
    console.log('Fix: Use the encoded version above');
  }
  
  if (!mongoUri.includes('/realestatepro-crm')) {
    console.log('❌ Issue: Database name missing');
    console.log('Fix: Add /realestatepro-crm before the ? symbol');
  }
  
  if (!mongoUri.startsWith('mongodb+srv://')) {
    console.log('❌ Issue: Wrong protocol');
    console.log('Fix: Use mongodb+srv:// instead of mongodb://');
  }
} else {
  console.log('❌ MONGODB_URI not found in .env.local');
  console.log('Make sure you have updated the file with the Atlas connection string');
}

console.log('');
console.log('✅ After fixing, test with: npm run db:test'); 