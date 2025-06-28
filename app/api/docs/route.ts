/**
 * app/api/docs/route.ts
 * Swagger API documentation endpoint
 * Provides comprehensive API documentation for all endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RealEstatePro CRM API',
      version: '1.0.0',
      description: 'Next-generation multi-tenant real estate management platform API',
      contact: {
        name: 'RealEstatePro Team',
        email: 'support@realestatepro.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.realestatepro.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from /api/auth/login',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID',
              example: '507f1f77bcf86cd799439011'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'admin@realestatepro.com'
            },
            fullName: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe'
            },
            role: {
              type: 'string',
              enum: ['super_admin', 'admin', 'sales', 'maintenance', 'tenant', 'receptionist'],
              description: 'User role',
              example: 'admin'
            },
            realEstateId: {
              type: 'string',
              description: 'Real estate company ID',
              example: '507f1f77bcf86cd799439012'
            },
            buildingId: {
              type: 'string',
              description: 'Building ID',
              example: '507f1f77bcf86cd799439013'
            },
            phone: {
              type: 'string',
              description: 'Phone number',
              example: '+971501234567'
            },
            avatar: {
              type: 'string',
              description: 'Profile picture URL',
              example: 'https://example.com/avatar.jpg'
            },
            isActive: {
              type: 'boolean',
              description: 'User active status',
              example: true
            },
            modules: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Accessible modules',
              example: ['users', 'buildings', 'tenants']
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          },
          required: ['email', 'fullName', 'role']
        },
        LoginRequest: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
              example: 'admin@realestatepro.com'
            },
            password: {
              type: 'string',
              description: 'User password',
              example: 'SecurePassword123!'
            }
          },
          required: ['email', 'password']
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Login successful'
            },
            data: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  description: 'JWT access token',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                },
                user: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Invalid credentials'
            },
            code: {
              type: 'string',
              description: 'Error code',
              example: 'INVALID_CREDENTIALS'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Error timestamp'
            }
          }
        },
        PaginationInfo: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              description: 'Current page number',
              example: 1
            },
            limit: {
              type: 'integer',
              description: 'Items per page',
              example: 10
            },
            total: {
              type: 'integer',
              description: 'Total number of items',
              example: 100
            },
            pages: {
              type: 'integer',
              description: 'Total number of pages',
              example: 10
            }
          }
        },
        HealthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'System is healthy'
            },
            data: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  example: 'healthy'
                },
                timestamp: {
                  type: 'string',
                  format: 'date-time'
                },
                uptime: {
                  type: 'number',
                  description: 'System uptime in seconds',
                  example: 3600
                },
                database: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'connected'
                    },
                    responseTime: {
                      type: 'number',
                      description: 'Database response time in milliseconds',
                      example: 15
                    }
                  }
                },
                version: {
                  type: 'string',
                  example: '1.0.0'
                },
                environment: {
                  type: 'string',
                  example: 'development'
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './app/api/**/*.ts',
    './lib/**/*.ts'
  ],
};

/**
 * GET /api/docs
 * Serve Swagger UI documentation
 * 
 * @swagger
 * /api/docs:
 *   get:
 *     summary: API Documentation
 *     description: Interactive API documentation using Swagger UI
 *     tags: [Documentation]
 *     responses:
 *       200:
 *         description: Swagger UI HTML page
 */
export async function GET(request: NextRequest) {
  try {
    const specs = swaggerJsdoc(options);
    
    // Create HTML response with Swagger UI
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RealEstatePro CRM API Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
    <style>
        html {
            box-sizing: border-box;
            overflow: -moz-scrollbars-vertical;
            overflow-y: scroll;
        }
        *, *:before, *:after {
            box-sizing: inherit;
        }
        body {
            margin:0;
            background: #fafafa;
        }
        .swagger-ui .topbar {
            background-color: #1a1a1a;
        }
        .swagger-ui .topbar .download-url-wrapper .select-label {
            color: #fff;
        }
        .swagger-ui .info .title {
            color: #1a1a1a;
        }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            const ui = SwaggerUIBundle({
                spec: ${JSON.stringify(specs)},
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                validatorUrl: null,
                docExpansion: 'list',
                filter: true,
                showExtensions: true,
                showCommonExtensions: true,
                tryItOutEnabled: true,
                requestInterceptor: function(request) {
                    // Add authorization header if token exists
                    const token = localStorage.getItem('auth_token');
                    if (token) {
                        request.headers.Authorization = 'Bearer ' + token;
                    }
                    return request;
                },
                responseInterceptor: function(response) {
                    // Store token from login response
                    if (response.url && response.url.includes('/api/auth/login') && response.status === 200) {
                        try {
                            const data = JSON.parse(response.body);
                            if (data.data && data.data.token) {
                                localStorage.setItem('auth_token', data.data.token);
                            }
                        } catch (e) {
                            console.error('Failed to parse login response:', e);
                        }
                    }
                    return response;
                }
            });
        };
    </script>
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
  } catch (error) {
    console.error('Error generating Swagger documentation:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate API documentation',
        code: 'DOCS_GENERATION_ERROR'
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/docs
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