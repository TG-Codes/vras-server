const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VRAS API - Virtual Reality Assessment System',
      version: '2.0.0',
      description: `
# VRAS API Documentation

## 🎯 **Design-First API Development**

Built with modern API workflow in mind, VRAS brings an intuitive interface and thoughtful features to power your complete tactical training API lifecycle.

### **🚀 Key Features**
- **Real-time User Tracking** - Monitor online users across all training sessions
- **Comprehensive Training Scenarios** - 18+ VR training environments
- **Multi-tenant Architecture** - Support for multiple client organizations
- **Advanced Analytics** - Detailed performance metrics and reporting
- **Role-based Access Control** - Secure admin, instructor, and user management

### **🏢 Enterprise Ready**
- **Scalable Architecture** - Built for high-performance training operations
- **Comprehensive Security** - JWT authentication with role-based permissions
- **Real-time Monitoring** - Live user activity and session tracking
- **Multi-Environment Support** - Warehouse, Office, Mall, School, Hospital, Airport, Subway, Residential

### **📊 Training Capabilities**
- **Tactical Scenarios** - Active shooter, hostage situations, bomb threats
- **Performance Metrics** - Accuracy, response time, casualty tracking
- **Department Management** - SWAT, Patrol, Detective, Executive Protection
- **Client Organizations** - Police, Security Corps, Universities, Federal Agencies

### **🔧 Developer Experience**
- **Interactive Documentation** - Try API endpoints directly in browser
- **Comprehensive Examples** - Real-world request/response samples
- **Error Handling** - Detailed error codes and troubleshooting guides
- **SDK Support** - Ready for frontend integration

### **🌐 API Endpoints**
- **Authentication** - Secure login with JWT tokens
- **User Management** - Complete CRUD operations for all user types
- **Training Sessions** - Real-time VR training management
- **Analytics** - Performance tracking and reporting
- **Admin Panel** - Comprehensive administrative controls

---

*Built with ❤️ for tactical training professionals worldwide*
      `,
      termsOfService: 'https://vras-server.vercel.app/terms',
      contact: {
        name: 'VRAS API Support',
        url: 'https://vras-server.vercel.app/support',
        email: 'support@vras.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      },
      'x-logo': {
        url: 'https://vras-server.vercel.app/logo.png',
        altText: 'VRAS - Virtual Reality Assessment System'
      }
    },
    servers: [
      {
        url: 'https://vras-server.vercel.app/api',
        description: '🚀 Production Server - Live VRAS API',
        variables: {
          environment: {
            default: 'production',
            enum: ['production', 'staging'],
            description: 'Server environment'
          }
        }
      },
      {
        url: 'http://localhost:5001/api',
        description: '🛠️ Development Server - Local Development',
        variables: {
          port: {
            default: '5001',
            enum: ['5001', '3000', '8000'],
            description: 'Local development port'
          }
        }
      }
    ],
    externalDocs: {
      description: 'VRAS API Guide',
      url: 'https://vras-server.vercel.app/guide'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from login endpoint. Include "Bearer " prefix.',
          example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        },
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key for external integrations'
        }
      },
      parameters: {
        PageParam: {
          name: 'page',
          in: 'query',
          description: 'Page number for pagination',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1
          }
        },
        LimitParam: {
          name: 'length',
          in: 'query',
          description: 'Number of items per page',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10
          }
        },
        SearchParam: {
          name: 'keywords',
          in: 'query',
          description: 'Search keywords for filtering results',
          required: false,
          schema: {
            type: 'string',
            minLength: 2,
            maxLength: 100
          }
        },
        SortParam: {
          name: 'sortBy',
          in: 'query',
          description: 'Field to sort by',
          required: false,
          schema: {
            type: 'string',
            enum: ['id', 'name', 'createdAt', 'updatedAt', 'isOnline']
          }
        },
        OrderParam: {
          name: 'sortOrder',
          in: 'query',
          description: 'Sort order',
          required: false,
          schema: {
            type: 'string',
            enum: ['ASC', 'DESC'],
            default: 'DESC'
          }
        }
      },
      responses: {
        SuccessResponse: {
          description: 'Successful operation',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiResponse'
              },
              examples: {
                success: {
                  summary: 'Success Example',
                  value: {
                    success: true,
                    message: 'Operation completed successfully',
                    data: {}
                  }
                }
              }
            }
          }
        },
        ErrorResponse: {
          description: 'Error response',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              examples: {
                validation_error: {
                  summary: 'Validation Error',
                  value: {
                    success: false,
                    message: 'Validation failed',
                    errors: ['Email is required', 'Password must be at least 6 characters']
                  }
                },
                unauthorized: {
                  summary: 'Unauthorized',
                  value: {
                    success: false,
                    message: 'Unauthorized access',
                    errors: ['Invalid or expired token']
                  }
                },
                not_found: {
                  summary: 'Not Found',
                  value: {
                    success: false,
                    message: 'Resource not found',
                    errors: ['User with ID 123 not found']
                  }
                }
              }
            }
          }
        },
        UnauthorizedResponse: {
          description: 'Unauthorized - Invalid or missing authentication token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        ForbiddenResponse: {
          description: 'Forbidden - Insufficient permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        NotFoundResponse: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        ValidationErrorResponse: {
          description: 'Validation error - Invalid input data',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'username', 'mobile', 'role'],
          properties: {
            id: { 
              type: 'integer', 
              description: 'Unique user identifier',
              example: 1
            },
            clientId: { 
              type: 'integer', 
              description: 'Associated client organization ID',
              example: 1,
              nullable: true
            },
            name: { 
              type: 'string', 
              description: 'User first name',
              example: 'John',
              minLength: 2,
              maxLength: 50
            },
            lastName: { 
              type: 'string', 
              description: 'User last name',
              example: 'Doe',
              maxLength: 50
            },
            avatar: { 
              type: 'string', 
              description: 'User profile image URL',
              example: 'https://vras-server.vercel.app/uploads/profile/avatar.png',
              format: 'uri'
            },
            role: { 
              type: 'string', 
              enum: ['admin', 'client', 'instructor', 'user'],
              description: 'User role in the system',
              example: 'user'
            },
            email: { 
              type: 'string', 
              format: 'email',
              description: 'User email address',
              example: 'john.doe@example.com'
            },
            username: { 
              type: 'string', 
              description: 'Unique username',
              example: 'john.doe',
              minLength: 3,
              maxLength: 30
            },
            mobile: { 
              type: 'string', 
              description: 'User mobile phone number',
              example: '+1-555-123-4567',
              pattern: '^\\+?[1-9]\\d{1,14}$'
            },
            countryCode: { 
              type: 'string', 
              description: 'Country code for mobile number',
              example: '+1',
              pattern: '^\\+[1-9]\\d{0,3}$'
            },
            dateOfBirth: { 
              type: 'string', 
              format: 'date',
              description: 'User date of birth',
              example: '1990-05-15'
            },
            gender: { 
              type: 'string', 
              enum: ['male', 'female'],
              description: 'User gender',
              example: 'male'
            },
            primaryHand: { 
              type: 'string', 
              enum: ['left', 'right'],
              description: 'User dominant hand',
              example: 'right'
            },
            experienceLevel: { 
              type: 'string', 
              enum: ['beginner', 'intermediate', 'advanced'],
              description: 'User training experience level',
              example: 'intermediate'
            },
            stressLevel: { 
              type: 'string', 
              enum: ['low', 'medium', 'high'],
              description: 'User stress tolerance level',
              example: 'medium'
            },
            status: { 
              type: 'string', 
              enum: ['active', 'inactive', 'delete'],
              description: 'User account status',
              example: 'active'
            },
            isPro: { 
              type: 'boolean',
              description: 'Whether user has pro access',
              example: true
            },
            isOnline: { 
              type: 'boolean',
              description: 'Current online status',
              example: true
            },
            onlineStatus: {
              type: 'object',
              description: 'Detailed online status information',
              properties: {
                isOnline: { type: 'boolean', example: true },
                statusText: { type: 'string', example: 'Online' },
                statusColor: { type: 'string', example: 'green' },
                statusIcon: { type: 'string', example: '🟢' },
                lastActivity: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' },
                clientOnline: { type: 'boolean', example: true }
              }
            },
            createdAt: { 
              type: 'string', 
              format: 'date-time',
              description: 'Account creation timestamp',
              example: '2024-01-15T08:30:00Z'
            },
            updatedAt: { 
              type: 'string', 
              format: 'date-time',
              description: 'Last update timestamp',
              example: '2024-01-15T10:30:00Z'
            }
          },
          example: {
            id: 1,
            clientId: 1,
            name: 'John',
            lastName: 'Doe',
            avatar: 'https://vras-server.vercel.app/uploads/profile/avatar.png',
            role: 'user',
            email: 'john.doe@example.com',
            username: 'john.doe',
            mobile: '+1-555-123-4567',
            countryCode: '+1',
            dateOfBirth: '1990-05-15',
            gender: 'male',
            primaryHand: 'right',
            experienceLevel: 'intermediate',
            stressLevel: 'medium',
            status: 'active',
            isPro: true,
            isOnline: true,
            onlineStatus: {
              isOnline: true,
              statusText: 'Online',
              statusColor: 'green',
              statusIcon: '🟢',
              lastActivity: '2024-01-15T10:30:00Z',
              clientOnline: true
            },
            createdAt: '2024-01-15T08:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z'
          }
        },
        Client: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            mobile: { type: 'string' },
            numberOfUsers: { type: 'integer' },
            numberOfProUsers: { type: 'integer' },
            startAt: { type: 'string', format: 'date' },
            endAt: { type: 'string', format: 'date' },
            payStatus: { type: 'string', enum: ['paid', 'initiate', 'due'] },
            status: { type: 'string', enum: ['active', 'inactive'] }
          }
        },
        Mission: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            userId: { type: 'integer' },
            scenarioId: { type: 'integer' },
            assaultTime: { type: 'string', format: 'time' },
            bulletsFired: { type: 'integer' },
            bulletsOnTerrorist: { type: 'integer' },
            bulletsOnCrowd: { type: 'integer' },
            accuracy: { type: 'number', format: 'float' },
            casualities: { type: 'integer' },
            survived: { type: 'integer' },
            confirmedKills: { type: 'integer' },
            responseTime: { type: 'string', format: 'time' },
            feedback: { type: 'string' }
          }
        },
        Scenario: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            environmentId: { type: 'integer' },
            status: { type: 'string', enum: ['active', 'inactive'] }
          }
        },
        Environment: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['active', 'inactive'] }
          }
        },
        ApiResponse: {
          type: 'object',
          required: ['success', 'message'],
          properties: {
            success: { 
              type: 'boolean',
              description: 'Indicates if the operation was successful',
              example: true
            },
            message: { 
              type: 'string',
              description: 'Human-readable message describing the result',
              example: 'Operation completed successfully'
            },
            data: { 
              type: 'object',
              description: 'Response data payload',
              nullable: true
            },
            errors: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Array of error messages if any',
              example: []
            },
            pagination: {
              type: 'object',
              description: 'Pagination information for list endpoints',
              properties: {
                page: { type: 'integer', example: 1 },
                length: { type: 'integer', example: 10 },
                total: { type: 'integer', example: 100 },
                totalPages: { type: 'integer', example: 10 }
              }
            }
          },
          example: {
            success: true,
            message: 'Users retrieved successfully',
            data: {
              users: [],
              total: 100,
              page: 1,
              length: 10,
              totalPages: 10
            },
            errors: []
          }
        },
        ErrorResponse: {
          type: 'object',
          required: ['success', 'message'],
          properties: {
            success: { 
              type: 'boolean',
              description: 'Always false for error responses',
              example: false
            },
            message: { 
              type: 'string',
              description: 'Error message describing what went wrong',
              example: 'Validation failed'
            },
            errors: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Detailed error messages',
              example: ['Email is required', 'Password must be at least 6 characters']
            },
            code: {
              type: 'string',
              description: 'Error code for programmatic handling',
              example: 'VALIDATION_ERROR'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'When the error occurred',
              example: '2024-01-15T10:30:00Z'
            }
          },
          example: {
            success: false,
            message: 'Validation failed',
            errors: ['Email is required', 'Password must be at least 6 characters'],
            code: 'VALIDATION_ERROR',
            timestamp: '2024-01-15T10:30:00Z'
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password', 'mobile'],
          properties: {
            name: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            mobile: { type: 'string' },
            countryCode: { type: 'string' },
            dateOfBirth: { type: 'string', format: 'date' },
            gender: { type: 'string', enum: ['male', 'female'] },
            primaryHand: { type: 'string', enum: ['left', 'right'] }
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
    './routes/api.js',
    './routes/admin/api.js',
    './controllers/api/*.js',
    './controllers/admin/api/*.js'
  ]
};

const specs = swaggerJSDoc(options);
module.exports = specs;
