# MongoDB Atlas Setup Guide

## 🎯 Overview

This guide will help you set up MongoDB Atlas (cloud database) for the RealEstatePro CRM project. MongoDB Atlas is a fully managed cloud database service that provides high availability, security, and scalability.

## 📋 Prerequisites

1. **MongoDB Atlas Account**: You'll need to create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Internet Connection**: Required to access the MongoDB Atlas dashboard
3. **Project Access**: You should have admin access to configure the database

## 🚀 Step-by-Step Setup

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" or "Sign Up"
3. Fill in your details and create an account
4. Verify your email address

### Step 2: Create a New Project

1. **Log in** to MongoDB Atlas
2. Click **"New Project"**
3. Enter project name: `RealEstatePro CRM`
4. Click **"Next"**
5. Click **"Create Project"**

### Step 3: Create a Database Cluster

1. Click **"Build a Database"**
2. Choose **"FREE"** tier (M0)
3. Select **"AWS"** as cloud provider
4. Choose a region close to you (e.g., `US East (N. Virginia)`)
5. Click **"Create"**

### Step 4: Set Up Database Access

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter username: `realestatepro_admin`
5. Click **"Autogenerate Secure Password"** or create your own
6. **IMPORTANT**: Save this password - you'll need it for the connection string
7. Under "Database User Privileges", select **"Atlas admin"**
8. Click **"Add User"**

### Step 5: Set Up Network Access

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. For development, click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### Step 6: Get Connection String

1. Go back to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Node.js"** as driver
5. Copy the connection string

### Step 7: Configure Environment Variables

1. Open your `.env.local` file in the project
2. Replace the `MONGODB_URI` with your Atlas connection string:

```bash
# Replace YOUR_PASSWORD with the password you created
MONGODB_URI=mongodb+srv://realestatepro_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/realestatepro-crm?retryWrites=true&w=majority
```

3. Also set a secure JWT secret:

```bash
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random-at-least-32-characters
```

## 🔧 Configuration Details

### Connection String Format

```
mongodb+srv://username:password@cluster-name.xxxxx.mongodb.net/database-name?retryWrites=true&w=majority
```

### Environment Variables to Set

```bash
# Database Configuration
MONGODB_URI=mongodb+srv://realestatepro_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/realestatepro-crm?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🧪 Testing the Connection

### Step 1: Test Database Connection

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Check the console for connection messages:
   ```
   ✅ Connected to MongoDB
   ```

### Step 2: Seed the Database

1. Run the database seeding script:
   ```bash
   npm run db:seed
   ```

2. You should see:
   ```
   🌱 Starting database seeding...
   ✅ Connected to database
   ✅ Super admin created successfully
   🎉 Database seeding completed successfully!
   ```

### Step 3: Verify in MongoDB Atlas

1. Go to your MongoDB Atlas dashboard
2. Click on your cluster
3. Click **"Browse Collections"**
4. You should see the `realestatepro-crm` database
5. Inside it, you should see a `users` collection
6. The collection should contain the super admin user

## 🔒 Security Best Practices

### For Development
- Use the free tier (M0) for development
- Allow access from anywhere (0.0.0.0/0) for testing
- Use strong passwords for database users

### For Production
- Use paid tiers for better performance
- Restrict IP access to your application servers
- Enable VPC peering for enhanced security
- Use MongoDB Atlas App Services for additional security

## 🐛 Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check if the connection string is correct
   - Verify username and password
   - Ensure network access is configured

2. **Authentication Failed**
   - Double-check the database username and password
   - Make sure the user has proper permissions

3. **Network Access Denied**
   - Add your current IP address to the allowlist
   - Or temporarily allow access from anywhere

4. **Database Not Found**
   - The database will be created automatically when you first connect
   - No need to manually create it

### Debug Commands

```bash
# Check if environment variables are loaded
npm run dev

# Test database connection
npm run db:seed

# Check TypeScript errors
npm run type-check
```

## 📊 Monitoring

### MongoDB Atlas Dashboard

1. **Metrics**: Monitor database performance
2. **Logs**: View database logs
3. **Alerts**: Set up performance alerts
4. **Backups**: Automatic backups (available on paid tiers)

### Application Logs

Check the `logs/` directory for:
- `user-actions.log` - User activities
- `system.log` - System events
- `error.log` - Errors and exceptions

## 🚀 Next Steps

After successful setup:

1. **Test the API endpoints**:
   - Login: `POST /api/auth/login`
   - Users: `GET /api/users`

2. **Create additional users** through the API

3. **Monitor the database** through MongoDB Atlas dashboard

4. **Set up backups** (recommended for production)

## 📞 Support

If you encounter issues:

1. Check the MongoDB Atlas documentation
2. Review the application logs
3. Verify environment variables
4. Test with a simple connection script

---

**MongoDB Atlas Setup Status**: Ready for configuration

Follow these steps to get your database running in the cloud! 