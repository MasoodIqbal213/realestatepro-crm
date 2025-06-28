# MongoDB Atlas Connection Verification Guide

## Overview
This guide helps you verify that your RealEstatePro CRM application is properly connected to MongoDB Atlas (cloud database) instead of localhost.

## Quick Verification Commands

### 1. Check Current Configuration
```bash
npm run db:check-uri
```
This will show you:
- Whether MONGODB_URI is set
- If you're connected to Atlas or localhost
- Connection string format (with sensitive data masked)

### 2. Test Basic Connection
```bash
npm run db:test
```
This tests if your database connection works.

### 3. Full Atlas Verification
```bash
npm run db:verify-atlas
```
This performs comprehensive Atlas verification including:
- Connection type detection
- Database operations test (read/write/delete)
- Connection details (host, database name, etc.)

## Understanding Connection Types

### 🌐 MongoDB Atlas (Cloud)
- **URI Format**: `mongodb+srv://username:password@cluster.mongodb.net/database`
- **Host**: Contains `.mongodb.net` or `atlas`
- **Status**: ✅ Production-ready cloud database

### 🏠 Local MongoDB
- **URI Format**: `mongodb://localhost:27017/database`
- **Host**: Contains `localhost` or `127.0.0.1`
- **Status**: ⚠️ Development-only local database

## How to Connect to MongoDB Atlas

### Step 1: Create Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (M0 Free tier is sufficient for development)

### Step 2: Get Connection String
1. In Atlas dashboard, click "Connect" on your cluster
2. Choose "Connect your application"
3. Select "Node.js" as driver
4. Copy the connection string

### Step 3: Update Environment Variables
1. Open `.env.local` file
2. Replace the MONGODB_URI line with your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/realestatepro-crm
```

### Step 4: Configure Network Access
1. In Atlas dashboard, go to "Network Access"
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (for development)
4. Or add your specific IP address

### Step 5: Create Database User
1. In Atlas dashboard, go to "Database Access"
2. Click "Add New Database User"
3. Create username and password
4. Set privileges to "Read and write to any database"

### Step 6: Verify Connection
```bash
npm run db:verify-atlas
```

## Troubleshooting Common Issues

### ❌ "Authentication failed"
- **Cause**: Wrong username/password
- **Solution**: Check database user credentials in Atlas

### ❌ "Network timeout"
- **Cause**: IP not whitelisted or network issues
- **Solution**: Add your IP to Atlas Network Access

### ❌ "Invalid connection string"
- **Cause**: Malformed URI
- **Solution**: Verify URI format and special characters

### ❌ "Cluster not found"
- **Cause**: Wrong cluster name or region
- **Solution**: Check cluster details in Atlas dashboard

## Security Best Practices

### For Development
- Use M0 Free tier
- Allow access from anywhere (0.0.0.0/0)
- Use simple passwords

### For Production
- Use paid tiers (M10+)
- Restrict IP access to your servers
- Use strong passwords
- Enable VPC peering if possible
- Enable encryption at rest

## Environment Variables Reference

```env
# Development (Local)
MONGODB_URI=mongodb://localhost:27017/realestatepro-crm

# Development (Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/realestatepro-crm

# Production (Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/realestatepro-crm-prod
```

## Verification Checklist

- [ ] MONGODB_URI is set in `.env.local`
- [ ] URI contains `mongodb.net` (Atlas) not `localhost`
- [ ] IP address is whitelisted in Atlas
- [ ] Database user exists with proper permissions
- [ ] Connection test passes (`npm run db:test`)
- [ ] Atlas verification passes (`npm run db:verify-atlas`)

## Next Steps

Once Atlas connection is verified:
1. Run database seeding: `npm run db:seed`
2. Start development server: `npm run dev`
3. Test API endpoints
4. Monitor logs for any connection issues

## Support

If you encounter issues:
1. Check Atlas dashboard for cluster status
2. Review connection logs in your application
3. Verify network connectivity
4. Contact MongoDB Atlas support if needed 