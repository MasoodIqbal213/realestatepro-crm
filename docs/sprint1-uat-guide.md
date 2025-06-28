# Sprint 1 UAT Guide - RealEstatePro CRM

## Overview
This guide provides comprehensive testing procedures for Sprint 1 features: Authentication, RBAC, User Management, and Database Seeding.

## Prerequisites
- Development server running on `http://localhost:3000` (or available port)
- MongoDB Atlas connection configured
- Database seeded with initial data
- API testing tool (Postman, curl, or browser)

## Test Environment Setup

### 1. Start Development Server
```bash
npm run dev
```

### 2. Seed Database
```bash
npm run db:seed
```

### 3. Verify Health Check
```bash
curl http://localhost:3000/api/health
```

Expected Response:
```json
{
  "success": true,
  "message": "System is healthy",
  "data": {
    "status": "healthy",
    "database": {
      "status": "connected",
      "responseTime": 15
    }
  }
}
```

## Test Cases

### TC-001: Database Seeding Verification

**Objective**: Verify that initial data is properly seeded

**Steps**:
1. Run `npm run db:seed`
2. Check console output for success messages
3. Verify sample data creation

**Expected Results**:
- ✅ Super admin created: `superadmin@realestatepro.com`
- ✅ 3 real estate companies created
- ✅ 6 buildings created (2 per company)
- ✅ 12 users created across all roles

**Test Data**:
```
Super Admin: superadmin@realestatepro.com / SuperAdmin123!
Admin Users: admin@[company].ae / Admin123!
Role-based passwords: Role123! pattern
```

### TC-002: Authentication - Successful Login

**Objective**: Verify user can login with valid credentials

**Endpoint**: `POST /api/auth/login`

**Test Data**:
```json
{
  "email": "superadmin@realestatepro.com",
  "password": "SuperAdmin123!"
}
```

**Steps**:
1. Send POST request to `/api/auth/login`
2. Include test data in request body
3. Verify response

**Expected Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "superadmin@realestatepro.com",
      "fullName": "Super Administrator",
      "role": "super_admin",
      "isActive": true
    }
  }
}
```

**Validation Points**:
- ✅ Status code: 200
- ✅ JWT token present and valid format
- ✅ User data returned without password
- ✅ Response time < 1000ms

### TC-003: Authentication - Invalid Credentials

**Objective**: Verify proper error handling for invalid login attempts

**Test Cases**:

#### TC-003a: Invalid Email
```json
{
  "email": "nonexistent@example.com",
  "password": "SuperAdmin123!"
}
```

#### TC-003b: Invalid Password
```json
{
  "email": "superadmin@realestatepro.com",
  "password": "WrongPassword123!"
}
```

#### TC-003c: Missing Fields
```json
{
  "email": "superadmin@realestatepro.com"
}
```

**Expected Responses**:
- Invalid credentials: 401 with `INVALID_CREDENTIALS` code
- Missing fields: 400 with `MISSING_CREDENTIALS` code

### TC-004: RBAC - Role Hierarchy Testing

**Objective**: Verify role-based access control works correctly

**Test Users**:
1. Super Admin: `superadmin@realestatepro.com`
2. Admin: `admin@dubaiproperties.ae`
3. Sales: `sales1@dubaiproperties.ae`
4. Tenant: `tenant1@example.com`

**Test Endpoint**: `GET /api/users` (requires admin role)

**Steps**:
1. Login with each user role
2. Attempt to access `/api/users` endpoint
3. Include JWT token in Authorization header

**Expected Results**:
- ✅ Super Admin: Access granted (200)
- ✅ Admin: Access granted (200)
- ❌ Sales: Access denied (403)
- ❌ Tenant: Access denied (403)

### TC-005: User Management - List Users

**Objective**: Verify user listing with filtering and pagination

**Endpoint**: `GET /api/users`

**Test Cases**:

#### TC-005a: Basic List
```
GET /api/users
Authorization: Bearer <admin_token>
```

#### TC-005b: With Pagination
```
GET /api/users?page=1&limit=5
Authorization: Bearer <admin_token>
```

#### TC-005c: With Role Filter
```
GET /api/users?role=sales
Authorization: Bearer <admin_token>
```

#### TC-005d: With Real Estate Filter
```
GET /api/users?realEstateId=<real_estate_id>
Authorization: Bearer <admin_token>
```

**Expected Response Structure**:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "email": "admin@example.com",
        "fullName": "Admin User",
        "role": "admin",
        "isActive": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 12,
      "pages": 2
    }
  }
}
```

### TC-006: User Management - Create User

**Objective**: Verify user creation with proper validation

**Endpoint**: `POST /api/users`

**Test Cases**:

#### TC-006a: Valid User Creation
```json
{
  "email": "newuser@example.com",
  "password": "NewUser123!",
  "fullName": "New Test User",
  "role": "sales",
  "realEstateId": "<real_estate_id>",
  "phone": "+971501234567"
}
```

#### TC-006b: Duplicate Email
```json
{
  "email": "superadmin@realestatepro.com",
  "password": "Test123!",
  "fullName": "Duplicate User",
  "role": "tenant"
}
```

#### TC-006c: Invalid Role
```json
{
  "email": "invalid@example.com",
  "password": "Test123!",
  "fullName": "Invalid Role User",
  "role": "invalid_role"
}
```

**Expected Results**:
- Valid creation: 201 with user data
- Duplicate email: 409 with `USER_ALREADY_EXISTS` code
- Invalid role: 400 with `INVALID_ROLE` code

### TC-007: Multi-Tenant Access Control

**Objective**: Verify users can only access data from their assigned real estate

**Test Scenario**:
1. Login as admin from Dubai Properties
2. Attempt to access users from Abu Dhabi Real Estate
3. Verify access is properly restricted

**Steps**:
1. Login with `admin@dubaiproperties.ae`
2. Get Dubai Properties real estate ID
3. Get Abu Dhabi Real Estate real estate ID
4. Test access to both real estates' data

**Expected Results**:
- ✅ Access to own real estate data: Granted
- ❌ Access to other real estate data: Denied (403)

### TC-008: API Documentation

**Objective**: Verify Swagger documentation is accessible and functional

**Endpoint**: `GET /api/docs`

**Steps**:
1. Navigate to `http://localhost:3000/api/docs`
2. Verify Swagger UI loads correctly
3. Test "Try it out" functionality for login endpoint
4. Verify authentication flow works in docs

**Expected Results**:
- ✅ Swagger UI loads without errors
- ✅ All endpoints documented
- ✅ Authentication flow works
- ✅ Request/response examples are accurate

### TC-009: Logging Verification

**Objective**: Verify that all actions are properly logged

**Test Actions**:
1. Login attempts (successful and failed)
2. User management operations
3. Access control violations

**Verification Steps**:
1. Check `logs/user-actions.log`
2. Check `logs/system.log`
3. Check `logs/error.log`

**Expected Results**:
- ✅ All user actions logged with proper metadata
- ✅ System events logged (seeding, startup)
- ✅ Errors logged with stack traces
- ✅ Logs contain user ID, action, timestamp

### TC-010: Performance Testing

**Objective**: Verify system performance under normal load

**Test Scenarios**:

#### TC-010a: Login Performance
- Measure login response time
- Expected: < 1000ms

#### TC-010b: User List Performance
- Measure user listing response time
- Expected: < 500ms for 10 users

#### TC-010c: Database Connection
- Verify database response time in health check
- Expected: < 100ms

## Test Execution Checklist

### Pre-Test Setup
- [ ] Development server running
- [ ] Database seeded
- [ ] Health check passing
- [ ] API testing tool configured

### Authentication Tests
- [ ] TC-002: Successful login
- [ ] TC-003a: Invalid email
- [ ] TC-003b: Invalid password
- [ ] TC-003c: Missing fields

### RBAC Tests
- [ ] TC-004: Role hierarchy verification
- [ ] TC-007: Multi-tenant access control

### User Management Tests
- [ ] TC-005a: Basic user list
- [ ] TC-005b: Pagination
- [ ] TC-005c: Role filtering
- [ ] TC-005d: Real estate filtering
- [ ] TC-006a: Valid user creation
- [ ] TC-006b: Duplicate email handling
- [ ] TC-006c: Invalid role handling

### Documentation Tests
- [ ] TC-008: Swagger documentation

### Logging Tests
- [ ] TC-009: Log verification

### Performance Tests
- [ ] TC-010a: Login performance
- [ ] TC-010b: User list performance
- [ ] TC-010c: Database performance

## Bug Reporting Template

When reporting bugs, include:

```
**Bug ID**: BUG-001
**Test Case**: TC-XXX
**Severity**: High/Medium/Low
**Environment**: Development
**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Result**: Description
**Actual Result**: Description
**Screenshots/Logs**: Attach relevant files
```

## Success Criteria

Sprint 1 is considered successful if:

- [ ] All test cases pass
- [ ] No critical bugs (High severity)
- [ ] Performance meets requirements
- [ ] Documentation is complete and accurate
- [ ] Logging captures all required events
- [ ] Multi-tenant isolation works correctly
- [ ] RBAC prevents unauthorized access

## Post-Test Actions

1. **Document Results**: Record pass/fail status for each test case
2. **Report Bugs**: Create detailed bug reports for any failures
3. **Performance Analysis**: Document response times and bottlenecks
4. **Security Review**: Verify no sensitive data exposure
5. **Cleanup**: Reset test data if needed

## Support

For questions or issues during testing:
- Check the logs in the `logs/` directory
- Review the API documentation at `/api/docs`
- Consult the development team for technical issues 