/**
 * lib/db.ts
 * This file handles connecting to MongoDB using Mongoose.
 * Why? All data (users, buildings, tenants, etc.) is stored in MongoDB. This utility ensures a single, efficient connection is used throughout the app.
 * How? It uses a global cache to avoid opening multiple connections during development (which can cause errors).
 *
 * How to use: Import and call dbConnect() before any database operation.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Get the MongoDB connection string from environment variables (.env.local)
const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
  var mongoose: {
    conn: any;
    promise: any;
  } | undefined;
}

let cached = global.mongoose;

/**
 * Connect to MongoDB using Mongoose.
 * Returns the mongoose connection object.
 * Logs connection events for troubleshooting.
 */
async function dbConnect() {
  if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
  }

  if (cached.conn) {
    // If already connected, return the cached connection
    return cached.conn;
  }

  if (!cached.promise) {
    // Connection options for reliability and performance
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Try for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4
    };

    // Create a new connection and cache the promise
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Log connection events for troubleshooting
mongoose.connections[0]?.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connections[0]?.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connections[0]?.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

// Graceful shutdown for dev/prod environments
process.on('SIGINT', async () => {
  await mongoose.disconnect();
  console.log('Mongoose connection closed through app termination');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await mongoose.disconnect();
  console.log('Mongoose connection closed through app termination');
  process.exit(0);
});

export default dbConnect; 