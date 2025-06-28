/**
 * app/api/docs/route.ts
 * Swagger UI endpoint for API documentation
 * Serves interactive API documentation at /api/docs
 */

import { NextRequest, NextResponse } from 'next/server';
import { getApiDocs } from '@/lib/swagger';

/**
 * GET /api/docs
 * Serves the Swagger UI interface for API documentation
 */
export async function GET(request: NextRequest) {
  try {
    const spec = getApiDocs();
    
    // Create HTML page with Swagger UI
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
        .swagger-ui .topbar { display: none; }
        .swagger-ui .info .title { 
            color: #2563eb; 
            font-size: 2.5em; 
            font-weight: 600;
        }
        .swagger-ui .info .description { 
            font-size: 1.1em; 
            line-height: 1.6; 
            color: #374151;
        }
        .swagger-ui .scheme-container { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0;
        }
        .swagger-ui .btn.execute { 
            background-color: #2563eb; 
            border-color: #2563eb; 
        }
        .swagger-ui .btn.execute:hover { 
            background-color: #1d4ed8; 
            border-color: #1d4ed8; 
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
                spec: ${JSON.stringify(spec)},
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
                tryItOutEnabled: true,
                requestInterceptor: function(request) {
                    // Add default headers for testing
                    request.headers['Content-Type'] = 'application/json';
                    return request;
                },
                responseInterceptor: function(response) {
                    // Log responses for debugging
                    console.log('API Response:', response);
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
    console.error('Error generating Swagger docs:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate API documentation',
        details: error instanceof Error ? error.message : 'Unknown error'
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