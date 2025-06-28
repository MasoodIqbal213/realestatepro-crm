/**
 * scripts/verify-atlas-connection.ts
 * This script verifies MongoDB Atlas connection and provides detailed diagnostics.
 * Run this to confirm your app is connected to MongoDB Atlas (not localhost).
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import { systemLogger } from '../lib/logging';

async function verifyAtlasConnection() {
  console.log('🔍 MongoDB Atlas Connection Verification');
  console.log('=====================================\n');

  // Check environment variable
  const mongoUri = process.env.MONGODB_URI;
  console.log('📋 Environment Check:');
  console.log(`MONGODB_URI: ${mongoUri ? '✅ Set' : '❌ Not set'}`);
  
  if (mongoUri) {
    // Check if it's Atlas or localhost
    const isAtlas = mongoUri.includes('mongodb.net') || mongoUri.includes('atlas');
    const isLocalhost = mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1');
    
    console.log(`Connection Type: ${isAtlas ? '🌐 MongoDB Atlas' : isLocalhost ? '🏠 Local MongoDB' : '❓ Unknown'}`);
    
    if (isLocalhost) {
      console.log('⚠️  WARNING: You are connected to localhost, not MongoDB Atlas!');
      console.log('   To connect to Atlas, update MONGODB_URI in .env.local');
    }
    
    // Mask sensitive parts of the URI for display
    const maskedUri = mongoUri.replace(/(mongodb\+srv?:\/\/)([^:]+):([^@]+)@/, '$1***:***@');
    console.log(`Connection String: ${maskedUri}`);
  }

  console.log('\n🔌 Connection Test:');
  
  try {
    // Test connection
    await mongoose.connect(mongoUri!);
    console.log('✅ Successfully connected to MongoDB!');
    
    // Get connection info
    const conn = mongoose.connection;
    console.log(`Database Name: ${conn.name}`);
    console.log(`Host: ${conn.host}`);
    console.log(`Port: ${conn.port}`);
    console.log(`Ready State: ${conn.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    
    // Test basic operations
    console.log('\n🧪 Testing Basic Operations:');
    
    // Test collection creation
    const testCollection = conn.collection('connection_test');
    await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'Atlas connection verification test'
    });
    console.log('✅ Write operation successful');
    
    // Test read operation
    const result = await testCollection.findOne({ test: true });
    console.log('✅ Read operation successful');
    
    // Clean up test data
    await testCollection.deleteOne({ test: true });
    console.log('✅ Delete operation successful');
    
    // Log the verification
    systemLogger.info({
      action: 'atlas_connection_verified',
      database: conn.name,
      host: conn.host,
      timestamp: new Date(),
    });
    
    console.log('\n🎉 MongoDB Atlas Connection Verification PASSED!');
    console.log('Your application is successfully connected to MongoDB Atlas.');
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
    
    systemLogger.error({
      action: 'atlas_connection_failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date(),
    });
    
    console.log('\n🔧 Troubleshooting Atlas Connection:');
    console.log('1. Verify your Atlas connection string format:');
    console.log('   mongodb+srv://username:password@cluster.mongodb.net/database');
    console.log('2. Check if your IP address is whitelisted in Atlas');
    console.log('3. Verify username/password are correct');
    console.log('4. Ensure your Atlas cluster is running');
    console.log('5. Check network connectivity');
    
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Connection closed');
  }
}

// Run verification if this file is executed directly
if (require.main === module) {
  verifyAtlasConnection();
}

export default verifyAtlasConnection; 