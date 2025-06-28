/**
 * scripts/test-connection.ts
 * This file tests the MongoDB connection to help troubleshoot issues.
 * Run this script to verify your database connection is working.
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import dbConnect from '../lib/db';
import { systemLogger } from '../lib/logging';

async function testConnection() {
  try {
    console.log('🔍 Testing MongoDB connection...');
    
    // Test database connection
    await dbConnect();
    console.log('✅ Database connection successful!');
    
    // Log the test
    systemLogger.info({
      action: 'connection_test_successful',
      timestamp: new Date(),
    });
    
    console.log('\n🎉 Connection test passed!');
    console.log('Your MongoDB setup is working correctly.');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    
    systemLogger.error({
      action: 'connection_test_failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date(),
    });
    
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check if MONGODB_URI is set in .env.local');
    console.log('2. Verify your MongoDB Atlas connection string');
    console.log('3. Ensure network access is configured in Atlas');
    console.log('4. Check if your database user has proper permissions');
    
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testConnection();
}

export default testConnection; 