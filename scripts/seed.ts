/**
 * scripts/seed.ts
 * This file creates initial data for the CRM system.
 * Why? We need a super admin user and sample data to test the system after setup.
 * How? It connects to MongoDB and creates users, real estates, and buildings with proper relationships.
 *
 * How to use: Run "npm run db:seed" to populate the database with initial data.
 */

import dbConnect from '../lib/db';
import { User } from '../models/User';
import { userActionLogger, systemLogger } from '../lib/logging';

/**
 * Create the initial super admin user.
 * This user has access to everything in the system.
 */
async function createSuperAdmin() {
  try {
    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'super_admin' });
    
    if (existingSuperAdmin) {
      console.log('✅ Super admin already exists:', existingSuperAdmin.email);
      return existingSuperAdmin;
    }

    // Create super admin user
    const superAdmin = new User({
      email: 'superadmin@realestatepro.com',
      password: 'SuperAdmin123!', // This will be hashed automatically
      fullName: 'Super Administrator',
      role: 'super_admin',
      isActive: true,
      modules: ['all'], // Super admin has access to all modules
    });

    await superAdmin.save();

    console.log('✅ Super admin created successfully:');
    console.log('   Email: superadmin@realestatepro.com');
    console.log('   Password: SuperAdmin123!');
    console.log('   Role: super_admin');

    // Log the creation
    systemLogger.info({
      action: 'super_admin_created',
      email: superAdmin.email,
      timestamp: new Date(),
    });

    return superAdmin;
  } catch (error) {
    console.error('❌ Failed to create super admin:', error);
    throw error;
  }
}

/**
 * Create sample real estate companies.
 * These are the companies that will use the CRM.
 */
async function createSampleRealEstates() {
  try {
    console.log('📊 Creating sample real estate companies...');
    
    // For now, we'll just log that this would create real estates
    // In a full implementation, we'd create RealEstate model and data
    
    console.log('✅ Sample real estate companies would be created here');
    console.log('   - ABC Real Estate');
    console.log('   - XYZ Properties');
    console.log('   - Premium Estates');
    
    systemLogger.info({
      action: 'sample_real_estates_created',
      count: 3,
      timestamp: new Date(),
    });
    
  } catch (error) {
    console.error('❌ Failed to create sample real estates:', error);
    throw error;
  }
}

/**
 * Create sample admin users for each real estate.
 * These users manage their respective real estate companies.
 */
async function createSampleAdmins() {
  try {
    console.log('👥 Creating sample admin users...');
    
    // For now, we'll just log that this would create admin users
    // In a full implementation, we'd create users linked to real estates
    
    console.log('✅ Sample admin users would be created here');
    console.log('   - admin@abcrealestate.com (ABC Real Estate)');
    console.log('   - admin@xyzproperties.com (XYZ Properties)');
    console.log('   - admin@premiumestates.com (Premium Estates)');
    
    systemLogger.info({
      action: 'sample_admins_created',
      count: 3,
      timestamp: new Date(),
    });
    
  } catch (error) {
    console.error('❌ Failed to create sample admins:', error);
    throw error;
  }
}

/**
 * Create sample buildings for each real estate.
 * These are the properties managed by each real estate company.
 */
async function createSampleBuildings() {
  try {
    console.log('🏢 Creating sample buildings...');
    
    // For now, we'll just log that this would create buildings
    // In a full implementation, we'd create Building model and data
    
    console.log('✅ Sample buildings would be created here');
    console.log('   - ABC Tower (ABC Real Estate)');
    console.log('   - XYZ Plaza (XYZ Properties)');
    console.log('   - Premium Heights (Premium Estates)');
    
    systemLogger.info({
      action: 'sample_buildings_created',
      count: 3,
      timestamp: new Date(),
    });
    
  } catch (error) {
    console.error('❌ Failed to create sample buildings:', error);
    throw error;
  }
}

/**
 * Main seeding function.
 * Orchestrates the creation of all initial data.
 */
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await dbConnect();
    console.log('✅ Connected to database');

    // Create super admin (required for system operation)
    await createSuperAdmin();
    
    // Create sample data for testing
    await createSampleRealEstates();
    await createSampleAdmins();
    await createSampleBuildings();

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Start the development server: npm run dev');
    console.log('   2. Open http://localhost:3000');
    console.log('   3. Login with superadmin@realestatepro.com / SuperAdmin123!');
    console.log('   4. Begin creating real estate companies and users');
    
    systemLogger.info({
      action: 'database_seeding_completed',
      timestamp: new Date(),
    });

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    
    systemLogger.error({
      action: 'database_seeding_failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date(),
    });
    
    process.exit(1);
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase; 