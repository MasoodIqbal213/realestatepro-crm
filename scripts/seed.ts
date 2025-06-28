/**
 * scripts/seed.ts
 * Database seeding script for RealEstatePro CRM
 * Creates initial data including super admin, real estate companies, and test users
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { systemLogger } from '../lib/logging';

// Load environment variables
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is required');
  process.exit(1);
}

/**
 * Connect to MongoDB
 */
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

/**
 * Create super admin user
 */
async function createSuperAdmin() {
  try {
    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'super_admin' });
    
    if (existingSuperAdmin) {
      console.log('ℹ️  Super admin already exists, skipping creation');
      return existingSuperAdmin;
    }
    
    // Create super admin
    const superAdmin = new User({
      email: 'superadmin@realestatepro.com',
      password: 'SuperAdmin123!',
      fullName: 'Super Administrator',
      role: 'super_admin',
      phone: '+971501234567',
      isActive: true,
      modules: ['all']
    });
    
    await superAdmin.save();
    console.log('✅ Super admin created successfully');
    
    systemLogger.info({
      action: 'super_admin_created',
      email: superAdmin.email,
      timestamp: new Date()
    });
    
    return superAdmin;
  } catch (error) {
    console.error('❌ Failed to create super admin:', error);
    throw error;
  }
}

/**
 * Create sample real estate companies
 */
async function createRealEstateCompanies() {
  try {
    // For now, we'll create sample real estate IDs
    // In a full implementation, this would create RealEstate documents
    const realEstateCompanies = [
      {
        id: new mongoose.Types.ObjectId(),
        name: 'Dubai Properties Group',
        email: 'info@dubaiproperties.ae',
        phone: '+97142234567',
        address: 'Dubai, UAE'
      },
      {
        id: new mongoose.Types.ObjectId(),
        name: 'Abu Dhabi Real Estate',
        email: 'contact@adre.ae',
        phone: '+97123456789',
        address: 'Abu Dhabi, UAE'
      },
      {
        id: new mongoose.Types.ObjectId(),
        name: 'Sharjah Properties',
        email: 'hello@sharjahproperties.ae',
        phone: '+97165432109',
        address: 'Sharjah, UAE'
      }
    ];
    
    console.log('✅ Sample real estate companies created');
    return realEstateCompanies;
  } catch (error) {
    console.error('❌ Failed to create real estate companies:', error);
    throw error;
  }
}

/**
 * Create sample buildings
 */
async function createBuildings(realEstateCompanies: any[]) {
  try {
    const buildings = [];
    
    for (const company of realEstateCompanies) {
      // Create 2 buildings per company
      for (let i = 1; i <= 2; i++) {
        buildings.push({
          id: new mongoose.Types.ObjectId(),
          name: `${company.name} Building ${i}`,
          realEstateId: company.id,
          address: `${company.address} - Building ${i}`,
          floors: 20 + Math.floor(Math.random() * 10),
          totalUnits: 50 + Math.floor(Math.random() * 50)
        });
      }
    }
    
    console.log('✅ Sample buildings created');
    return buildings;
  } catch (error) {
    console.error('❌ Failed to create buildings:', error);
    throw error;
  }
}

/**
 * Create sample users for each role
 */
async function createSampleUsers(realEstateCompanies: any[], buildings: any[]) {
  try {
    const users = [];
    
    // Create admin users for each real estate company
    for (const company of realEstateCompanies) {
      const admin = new User({
        email: `admin@${company.name.toLowerCase().replace(/\s+/g, '')}.ae`,
        password: 'Admin123!',
        fullName: `${company.name} Administrator`,
        role: 'admin',
        realEstateId: company.id,
        phone: company.phone,
        isActive: true,
        modules: ['users', 'buildings', 'tenants', 'maintenance', 'sales']
      });
      
      await admin.save();
      users.push(admin);
      console.log(`✅ Admin created for ${company.name}`);
    }
    
    // Create sales users
    const salesUsers = [
      {
        email: 'sales1@dubaiproperties.ae',
        fullName: 'Ahmed Al Mansouri',
        realEstateId: realEstateCompanies[0].id,
        buildingId: buildings[0].id
      },
      {
        email: 'sales2@dubaiproperties.ae',
        fullName: 'Fatima Al Zahra',
        realEstateId: realEstateCompanies[0].id,
        buildingId: buildings[1].id
      },
      {
        email: 'sales1@adre.ae',
        fullName: 'Omar Al Qasimi',
        realEstateId: realEstateCompanies[1].id,
        buildingId: buildings[2].id
      }
    ];
    
    for (const salesUser of salesUsers) {
      const user = new User({
        ...salesUser,
        password: 'Sales123!',
        role: 'sales',
        phone: '+971' + Math.floor(Math.random() * 90000000 + 10000000),
        isActive: true,
        modules: ['sales', 'tenants']
      });
      
      await user.save();
      users.push(user);
      console.log(`✅ Sales user created: ${user.fullName}`);
    }
    
    // Create maintenance users
    const maintenanceUsers = [
      {
        email: 'maintenance1@dubaiproperties.ae',
        fullName: 'Hassan Al Rashid',
        realEstateId: realEstateCompanies[0].id,
        buildingId: buildings[0].id
      },
      {
        email: 'maintenance2@adre.ae',
        fullName: 'Khalid Al Suwaidi',
        realEstateId: realEstateCompanies[1].id,
        buildingId: buildings[2].id
      }
    ];
    
    for (const maintenanceUser of maintenanceUsers) {
      const user = new User({
        ...maintenanceUser,
        password: 'Maintenance123!',
        role: 'maintenance',
        phone: '+971' + Math.floor(Math.random() * 90000000 + 10000000),
        isActive: true,
        modules: ['maintenance']
      });
      
      await user.save();
      users.push(user);
      console.log(`✅ Maintenance user created: ${user.fullName}`);
    }
    
    // Create receptionist users
    const receptionistUsers = [
      {
        email: 'reception@dubaiproperties.ae',
        fullName: 'Aisha Al Falasi',
        realEstateId: realEstateCompanies[0].id,
        buildingId: buildings[0].id
      },
      {
        email: 'reception@adre.ae',
        fullName: 'Mariam Al Qasimi',
        realEstateId: realEstateCompanies[1].id,
        buildingId: buildings[2].id
      }
    ];
    
    for (const receptionistUser of receptionistUsers) {
      const user = new User({
        ...receptionistUser,
        password: 'Reception123!',
        role: 'receptionist',
        phone: '+971' + Math.floor(Math.random() * 90000000 + 10000000),
        isActive: true,
        modules: ['tenants', 'visitors']
      });
      
      await user.save();
      users.push(user);
      console.log(`✅ Receptionist user created: ${user.fullName}`);
    }
    
    // Create tenant users
    const tenantUsers = [
      {
        email: 'tenant1@example.com',
        fullName: 'John Smith',
        realEstateId: realEstateCompanies[0].id,
        buildingId: buildings[0].id
      },
      {
        email: 'tenant2@example.com',
        fullName: 'Sarah Johnson',
        realEstateId: realEstateCompanies[0].id,
        buildingId: buildings[1].id
      },
      {
        email: 'tenant3@example.com',
        fullName: 'Mohammed Al Hashimi',
        realEstateId: realEstateCompanies[1].id,
        buildingId: buildings[2].id
      }
    ];
    
    for (const tenantUser of tenantUsers) {
      const user = new User({
        ...tenantUser,
        password: 'Tenant123!',
        role: 'tenant',
        phone: '+971' + Math.floor(Math.random() * 90000000 + 10000000),
        isActive: true,
        modules: ['payments', 'maintenance_requests']
      });
      
      await user.save();
      users.push(user);
      console.log(`✅ Tenant user created: ${user.fullName}`);
    }
    
    console.log(`✅ Created ${users.length} sample users`);
    return users;
  } catch (error) {
    console.error('❌ Failed to create sample users:', error);
    throw error;
  }
}

/**
 * Main seeding function
 */
async function seed() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Connect to database
    await connectDB();
    
    // Create super admin
    const superAdmin = await createSuperAdmin();
    
    // Create real estate companies
    const realEstateCompanies = await createRealEstateCompanies();
    
    // Create buildings
    const buildings = await createBuildings(realEstateCompanies);
    
    // Create sample users
    const users = await createSampleUsers(realEstateCompanies, buildings);
    
    // Log seeding completion
    systemLogger.info({
      action: 'database_seeding_completed',
      superAdminId: superAdmin._id,
      realEstateCompaniesCount: realEstateCompanies.length,
      buildingsCount: buildings.length,
      usersCount: users.length,
      timestamp: new Date()
    });
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • Super Admin: 1`);
    console.log(`   • Real Estate Companies: ${realEstateCompanies.length}`);
    console.log(`   • Buildings: ${buildings.length}`);
    console.log(`   • Users: ${users.length}`);
    
    console.log('\n🔑 Default Login Credentials:');
    console.log('   Super Admin:');
    console.log('     Email: superadmin@realestatepro.com');
    console.log('     Password: SuperAdmin123!');
    console.log('\n   Admin Users:');
    realEstateCompanies.forEach((company, index) => {
      console.log(`     ${company.name}: admin@${company.name.toLowerCase().replace(/\s+/g, '')}.ae / Admin123!`);
    });
    
    console.log('\n📝 Note: All passwords follow the pattern: Role123!');
    console.log('   Example: Sales123!, Maintenance123!, Tenant123!');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    
    systemLogger.error({
      action: 'database_seeding_failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    });
    
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seed();
}

export { seed }; 