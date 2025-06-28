# MongoDB Atlas Setup Guide for RealEstatePro CRM

## Step-by-Step Atlas Connection Setup

### Step 1: Create MongoDB Atlas Account

1. **Go to MongoDB Atlas**: Visit [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Sign Up**: Create a free account (no credit card required for M0 tier)
3. **Create Organization**: Name it "RealEstatePro CRM" or your company name

### Step 2: Create Your First Cluster

1. **Choose Plan**: Select "FREE" (M0 tier) - 512MB storage, shared RAM
2. **Cloud Provider**: Choose AWS, Google Cloud, or Azure (any is fine)
3. **Region**: Select closest to your location for better performance
4. **Cluster Name**: Name it "realestatepro-cluster" or similar
5. **Click "Create"**: Wait 2-3 minutes for cluster to be ready

### Step 3: Configure Network Access

1. **Go to Network Access**: Click "Network Access" in left sidebar
2. **Add IP Address**: Click "Add IP Address"
3. **Choose Option**: Select "Allow Access from Anywhere" (0.0.0.0/0)
4. **Add Entry**: Click "Confirm"

### Step 4: Create Database User

1. **Go to Database Access**: Click "Database Access" in left sidebar
2. **Add New User**: Click "Add New Database User"
3. **Authentication Method**: Choose "Password"
4. **Username**: Create a username (e.g., "realestatepro-admin")
5. **Password**: Create a strong password (save this!)
6. **Built-in Role**: Select "Atlas admin" or "Read and write to any database"
7. **Add User**: Click "Add User"

### Step 5: Get Connection String

1. **Go to Clusters**: Click "Database" in left sidebar
2. **Connect**: Click "Connect" button on your cluster
3. **Choose Method**: Select "Connect your application"
4. **Driver**: Choose "Node.js" (version 5.0 or later)
5. **Copy String**: Copy the connection string

### Step 6: Update Your Environment Variables

1. **Open .env.local**: Edit your `.env.local` file
2. **Replace MONGODB_URI**: Update the line with your Atlas connection string

**Example Atlas Connection String:**
```env
MONGODB_URI=mongodb+srv://realestatepro-admin:YourPassword123@cluster0.abc123.mongodb.net/realestatepro-crm?retryWrites=true&w=majority
```

**Important Notes:**
- Replace `YourPassword123` with your actual password
- Replace `cluster0.abc123.mongodb.net` with your actual cluster URL
- The database name `realestatepro-crm` will be created automatically

### Step 7: Test Your Connection

Run these commands to verify your Atlas connection:

```bash
# Check configuration
npm run db:check-uri

# Test basic connection
npm run db:test

# Full Atlas verification
npm run db:verify-atlas
```

## Troubleshooting Common Issues

### ❌ "Authentication failed"
**Solution**: 
- Check username and password in Atlas Database Access
- Ensure password doesn't contain special characters that need URL encoding
- Try creating a new database user

### ❌ "Network timeout"
**Solution**:
- Verify IP is whitelisted in Network Access
- Check if your firewall is blocking the connection
- Try "Allow Access from Anywhere" temporarily

### ❌ "Invalid connection string"
**Solution**:
- Ensure you copied the entire connection string
- Check for extra spaces or characters
- Verify the format matches the example above

### ❌ "Cluster not found"
**Solution**:
- Verify cluster name in the connection string
- Check if cluster is in the correct region
- Ensure cluster is fully deployed (green status)

## Security Best Practices

### For Development:
- Use M0 Free tier
- Allow access from anywhere (0.0.0.0/0)
- Use simple but secure passwords

### For Production:
- Use paid tiers (M10+)
- Restrict IP access to your server IPs only
- Use strong, randomly generated passwords
- Enable VPC peering if possible
- Enable encryption at rest

## Environment Variables Template

```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/realestatepro-crm?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRES_IN=7d

# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Logging Configuration
LOG_LEVEL=info
```

## Verification Checklist

- [ ] Atlas account created
- [ ] Cluster created and running (green status)
- [ ] Network access configured (IP whitelisted)
- [ ] Database user created with proper permissions
- [ ] Connection string copied correctly
- [ ] .env.local updated with Atlas URI
- [ ] Connection test passes (`npm run db:test`)
- [ ] Atlas verification passes (`npm run db:verify-atlas`)

## Next Steps After Atlas Connection

1. **Seed Database**: Run `npm run db:seed` to populate with initial data
2. **Start Development**: Run `npm run dev` to start your application
3. **Test APIs**: Verify all endpoints work with Atlas
4. **Monitor Logs**: Check for any connection issues

## Support Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/) - Free courses
- [Atlas Status Page](https://status.mongodb.com/) - Check service status
- [MongoDB Community](https://community.mongodb.com/) - Community support 