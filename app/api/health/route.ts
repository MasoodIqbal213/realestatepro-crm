/**
 * app/api/health/route.ts
 * Health check endpoint for API monitoring
 * Provides system status and database connectivity information
 */

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { systemLogger } from '@/lib/logging';

/**
 * GET /api/health
 * Health check endpoint to verify API and database status
 * 
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Verifies the API and database connectivity status
 *     tags: [System]
 *     responses:
 *       200:
 *         description: System is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "System is healthy"
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "healthy"
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T00:00:00.000Z"
 *                     uptime:
 *                       type: number
 *                       description: System uptime in seconds
 *                       example: 3600
 *                     database:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           example: "connected"
 *                         responseTime:
 *                           type: number
 *                           description: Database response time in milliseconds
 *                           example: 15
 *                     version:
 *                       type: string
 *                       example: "1.0.0"
 *                     environment:
 *                       type: string
 *                       example: "development"
 *       500:
 *         description: System is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Test database connection
    const dbStartTime = Date.now();
    await dbConnect();
    const dbResponseTime = Date.now() - dbStartTime;
    
    // Calculate system uptime
    const uptime = process.uptime();
    
    // Prepare health check data
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(uptime),
      database: {
        status: 'connected',
        responseTime: dbResponseTime
      },
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };
    
    const totalResponseTime = Date.now() - startTime;
    
    // Log health check
    systemLogger.info({
      action: 'health_check_successful',
      responseTime: totalResponseTime,
      databaseResponseTime: dbResponseTime,
      uptime: healthData.uptime,
      timestamp: new Date()
    });
    
    return NextResponse.json(
      {
        success: true,
        message: 'System is healthy',
        data: healthData
      },
      { 
        status: 200,
        headers: {
          'X-Response-Time': `${totalResponseTime}ms`,
          'X-Database-Response-Time': `${dbResponseTime}ms`
        }
      }
    );
    
  } catch (error) {
    const totalResponseTime = Date.now() - startTime;
    
    // Log health check failure
    systemLogger.error({
      action: 'health_check_failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: totalResponseTime,
      timestamp: new Date()
    });
    
    return NextResponse.json(
      {
        success: false,
        error: 'System is unhealthy',
        code: 'HEALTH_CHECK_FAILED',
        details: {
          database: error instanceof Error ? error.message : 'Unknown database error',
          responseTime: totalResponseTime
        },
        timestamp: new Date().toISOString()
      },
      { 
        status: 500,
        headers: {
          'X-Response-Time': `${totalResponseTime}ms`
        }
      }
    );
  }
}

/**
 * OPTIONS /api/health
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
} 