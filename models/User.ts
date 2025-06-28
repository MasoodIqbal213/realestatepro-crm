/**
 * models/User.ts
 * This file defines the User schema for MongoDB using Mongoose.
 * Why? All user accounts (Super Admin, Admin, Sales, etc.) are stored in MongoDB. This schema supports multi-tenancy, RBAC, and secure password storage.
 * How? Each user has a role, can be assigned to a real estate/building, and has a hashed password for security.
 *
 * How to use: Import User and use it to create, read, update, or delete users in the database.
 */

import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the User interface for TypeScript type safety
export interface IUser extends Document {
  email: string;
  password: string;
  fullName: string;
  role: 'super_admin' | 'admin' | 'sales' | 'maintenance' | 'tenant' | 'receptionist';
  realEstateId?: string; // For multi-tenancy: which real estate this user belongs to
  buildingId?: string;   // For building-level assignment
  phone?: string;
  avatar?: string;
  isActive: boolean;
  modules: string[]; // Which modules this user can access
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define the User schema
const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    // Why? Ensures each user has a unique, valid email address
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters long']
    // Why? Passwords are hashed for security (see pre-save hook below)
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  role: {
    type: String,
    required: true,
    enum: ['super_admin', 'admin', 'sales', 'maintenance', 'tenant', 'receptionist'],
    default: 'tenant'
    // Why? Role-based access control (RBAC)
  },
  realEstateId: {
    type: Schema.Types.ObjectId,
    ref: 'RealEstate',
    // Why? Multi-tenancy: links user to a real estate company
  },
  buildingId: {
    type: Schema.Types.ObjectId,
    ref: 'Building',
    // Why? Assigns user to a specific building (if needed)
  },
  phone: {
    type: String,
    trim: true,
    // Why? Optional phone number for contact
  },
  avatar: {
    type: String,
    default: null
    // Why? Optional profile picture
  },
  isActive: {
    type: Boolean,
    default: true
    // Why? Allows deactivating users without deleting them
  },
  modules: {
    type: [String],
    default: [],
    // Why? List of modules this user can access (e.g., ['sales', 'tenant'])
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Pre-save middleware to hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Export the User model
export const User = mongoose.model<IUser>('User', userSchema); 