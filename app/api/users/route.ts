/**
 * app/api/users/route.ts
 * This file handles user management operations (CRUD).
 * Why? Super admins and admins need to create, read, update, and delete users in their real estate.
 * How? It uses RBAC to ensure only authorized users can perform these operations, with multi-tenant data isolation.
 *
 * How to use: Send GET/POST requests to /api/users with proper authentication and authorization.
 */

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { requireAuth, requireAnyRole, createErrorResponse, createSuccessResponse } from '@/lib/middleware';
import { userActionLogger, errorLogger } from '@/lib/logging';
import { belongsToRealEstate } from '@/lib/auth';

// Define user creation request structure
interface CreateUserRequest {
  email: string;
  password: string;
  fullName: string;
  role: 'admin' | 'sales' | 'maintenance' | 'tenant' | 'receptionist';
  realEstateId?: string;
  buildingId?: string;
  phone?: string;
  modules?: string[];
}

// Define user update request structure
interface UpdateUserRequest {
  fullName?: string;
  role?: 'admin' | 'sales' | 'maintenance' | 'tenant' | 'receptionist';
  realEstateId?: string;
  buildingId?: string;
  phone?: string;
  isActive?: boolean;
  modules?: string[];
}

/**
 * GET /api/users
 * Retrieves users based on the authenticated user's role and permissions.
 * Super admins see all users, admins see users in their real estate.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Connect to database
    await dbConnect();

    // Check authentication and authorization
    const authResult = requireAnyRole(request, ['super_admin', 'admin']);
    if (!authResult.success) {
      return createErrorResponse(authResult.message, 401);
    }

    const user = authResult.user!;

    // Build query based on user role
    let query: any = {};

    // Super admins can see all users, admins only see users in their real estate
    if (user.role !== 'super_admin') {
      query.realEstateId = user.realEstateId;
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search');

    // Add filters to query
    if (role) query.role = role;
    if (isActive !== null) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
      ];
    }

    // Execute query with pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select('-password') // Exclude password from response
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('realEstateId', 'name')
      .populate('buildingId', 'name');

    const total = await User.countDocuments(query);

    // Log the action
    userActionLogger.info({
      user: user.email,
      action: 'users_listed',
      filters: { role, isActive, search },
      count: users.length,
      total,
      timestamp: new Date(),
    });

    return createSuccessResponse({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }, user);

  } catch (error) {
    errorLogger.error({
      action: 'users_list_error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date(),
    });

    return createErrorResponse('Failed to retrieve users', 500);
  }
}

/**
 * POST /api/users
 * Creates a new user with proper validation and authorization.
 * Only super admins and admins can create users.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Connect to database
    await dbConnect();

    // Check authentication and authorization
    const authResult = requireAnyRole(request, ['super_admin', 'admin']);
    if (!authResult.success) {
      return createErrorResponse(authResult.message, 401);
    }

    const user = authResult.user!;

    // Parse request body
    const body: CreateUserRequest = await request.json();
    const { email, password, fullName, role, realEstateId, buildingId, phone, modules } = body;

    // Validate required fields
    if (!email || !password || !fullName || !role) {
      return createErrorResponse('Email, password, full name, and role are required', 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return createErrorResponse('Invalid email format', 400);
    }

    // Validate password strength
    if (password.length < 8) {
      return createErrorResponse('Password must be at least 8 characters long', 400);
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return createErrorResponse('User with this email already exists', 400);
    }

    // Authorization checks
    if (user.role !== 'super_admin') {
      // Admins can only create users in their real estate
      if (realEstateId && realEstateId !== user.realEstateId) {
        return createErrorResponse('You can only create users in your real estate', 403);
      }
      
      // Admins cannot create other admins
      if (role === 'admin') {
        return createErrorResponse('Admins cannot create other admin users', 403);
      }
    }

    // Create new user
    const newUser = new User({
      email: email.toLowerCase(),
      password,
      fullName,
      role,
      realEstateId: realEstateId || user.realEstateId,
      buildingId,
      phone,
      modules: modules || [],
      isActive: true,
    });

    await newUser.save();

    // Log the action
    userActionLogger.info({
      user: user.email,
      action: 'user_created',
      targetUser: newUser.email,
      targetRole: newUser.role,
      realEstateId: newUser.realEstateId?.toString(),
      timestamp: new Date(),
    });

    // Return success response (without password)
    const userResponse = {
      id: (newUser as any)._id.toString(),
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role,
      realEstateId: newUser.realEstateId?.toString(),
      buildingId: newUser.buildingId?.toString(),
      phone: newUser.phone,
      isActive: newUser.isActive,
      modules: newUser.modules,
      createdAt: newUser.createdAt,
    };

    return createSuccessResponse(userResponse, user);

  } catch (error) {
    errorLogger.error({
      action: 'user_creation_error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date(),
    });

    return createErrorResponse('Failed to create user', 500);
  }
} 