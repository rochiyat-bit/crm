/**
 * Database Seed Script
 * Creates initial data for development and testing
 */

const bcrypt = require('bcryptjs');
const { User, Company, Pipeline, Contact, Deal } = require('../lib/models');
const { syncDatabase, testConnection } = require('../lib/db/config');

async function main() {
  console.log('🌱 Starting database seeding...\n');

  // Test connection
  const isConnected = await testConnection();
  if (!isConnected) {
    console.error('❌ Database connection failed.');
    process.exit(1);
  }

  try {
    // Create demo company
    console.log('Creating demo company...');
    const company = await Company.create({
      name: 'Demo Company',
      domain: 'demo.com',
      industry: 'Technology',
      size: 'medium',
      subscription_tier: 'pro',
    });

    // Create default pipeline
    console.log('Creating default pipeline...');
    const pipeline = await Pipeline.create({
      company_id: company.id,
      name: 'Sales Pipeline',
      description: 'Default sales pipeline',
      is_default: true,
      stages: [
        { name: 'Prospecting', order: 1, probability: 10 },
        { name: 'Qualification', order: 2, probability: 25 },
        { name: 'Proposal', order: 3, probability: 50 },
        { name: 'Negotiation', order: 4, probability: 75 },
        { name: 'Closed Won', order: 5, probability: 100 },
        { name: 'Closed Lost', order: 6, probability: 0 },
      ],
    });

    // Create demo users
    console.log('Creating demo users...');
    const password_hash = await bcrypt.hash('password123', 12);

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@demo.com',
      password_hash,
      company_id: company.id,
      role: 'admin',
      is_active: true,
    });

    const salesUser = await User.create({
      name: 'Sales User',
      email: 'sales@demo.com',
      password_hash,
      company_id: company.id,
      role: 'sales',
      is_active: true,
    });

    // Create demo contacts
    console.log('Creating demo contacts...');
    const contacts = await Contact.bulkCreate([
      {
        company_id: company.id,
        owner_id: salesUser.id,
        first_name: 'John',
        last_name: 'Smith',
        email: 'john.smith@example.com',
        phone: '+1234567890',
        title: 'CEO',
        company_name: 'Acme Corp',
        status: 'customer',
        lead_score: 80,
        created_by: salesUser.id,
      },
      {
        company_id: company.id,
        owner_id: salesUser.id,
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane.doe@example.com',
        phone: '+1234567891',
        title: 'CTO',
        company_name: 'Tech Inc',
        status: 'prospect',
        lead_score: 65,
        created_by: salesUser.id,
      },
      {
        company_id: company.id,
        owner_id: salesUser.id,
        first_name: 'Bob',
        last_name: 'Johnson',
        email: 'bob.johnson@example.com',
        phone: '+1234567892',
        title: 'VP Sales',
        company_name: 'Sales Co',
        status: 'lead',
        lead_score: 45,
        created_by: salesUser.id,
      },
    ]);

    // Create demo deals
    console.log('Creating demo deals...');
    await Deal.bulkCreate([
      {
        company_id: company.id,
        contact_id: contacts[0].id,
        owner_id: salesUser.id,
        name: 'Enterprise Package - Acme Corp',
        description: 'Annual enterprise subscription',
        value: 50000,
        currency: 'USD',
        stage: 'negotiation',
        probability: 75,
        pipeline_id: pipeline.id,
        expected_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        created_by: salesUser.id,
      },
      {
        company_id: company.id,
        contact_id: contacts[1].id,
        owner_id: salesUser.id,
        name: 'Professional Plan - Tech Inc',
        description: 'Professional tier subscription',
        value: 25000,
        currency: 'USD',
        stage: 'proposal',
        probability: 50,
        pipeline_id: pipeline.id,
        expected_close_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        created_by: salesUser.id,
      },
    ]);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Demo credentials:');
    console.log('   Email: admin@demo.com');
    console.log('   Password: password123\n');
    console.log('   Email: sales@demo.com');
    console.log('   Password: password123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();
