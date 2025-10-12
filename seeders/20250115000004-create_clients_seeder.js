'use strict';

// Bcrypt for hash password
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     */

    await queryInterface.bulkInsert('clients', [
      {
        subscriptionId: 2, // Professional Training
        numberOfUsers: 25,
        numberOfProUsers: 15,
        environmentId: 1, // Urban Warehouse
        slug: 'metro-police-dept',
        name: 'Metro Police Department',
        email: 'training@metropd.gov',
        mobile: '+1-555-0101',
        contactName: 'Captain Sarah Johnson',
        contactEmail: 'sarah.johnson@metropd.gov',
        contactCountryCode: '+1',
        contactMobile: '+1-555-0102',
        address: '123 Police Plaza',
        city: 'Metro City',
        country: 'USA',
        postalCode: '10001',
        startAt: '2024-01-01',
        endAt: '2025-01-01',
        payStatus: 'paid',
        status: 'active',
        isOnline: 0,
        notes: 'Primary law enforcement agency for metro area. Regular VR training for tactical units.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        subscriptionId: 3, // Enterprise Training
        numberOfUsers: 50,
        numberOfProUsers: 30,
        environmentId: 2, // Office Building
        slug: 'security-corp-international',
        name: 'Security Corp International',
        email: 'training@securitycorp.com',
        mobile: '+1-555-0201',
        contactName: 'Director Mike Chen',
        contactEmail: 'mike.chen@securitycorp.com',
        contactCountryCode: '+1',
        contactMobile: '+1-555-0202',
        address: '456 Security Blvd',
        city: 'Corporate City',
        country: 'USA',
        postalCode: '20002',
        startAt: '2024-02-01',
        endAt: '2025-02-01',
        payStatus: 'paid',
        status: 'active',
        isOnline: 0,
        notes: 'International security company with multiple training facilities worldwide.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        subscriptionId: 1, // Basic Training
        numberOfUsers: 10,
        numberOfProUsers: 5,
        environmentId: 3, // Shopping Mall
        slug: 'mall-security-services',
        name: 'Mall Security Services',
        email: 'training@mallsecurity.com',
        mobile: '+1-555-0301',
        contactName: 'Manager Lisa Rodriguez',
        contactEmail: 'lisa.rodriguez@mallsecurity.com',
        contactCountryCode: '+1',
        contactMobile: '+1-555-0302',
        address: '789 Mall Drive',
        city: 'Shopping City',
        country: 'USA',
        postalCode: '30003',
        startAt: '2024-03-01',
        endAt: '2024-09-01',
        payStatus: 'paid',
        status: 'active',
        isOnline: 0,
        notes: 'Regional mall security company focusing on retail security training.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        subscriptionId: 2, // Professional Training
        numberOfUsers: 30,
        numberOfProUsers: 20,
        environmentId: 4, // School Campus
        slug: 'university-campus-security',
        name: 'University Campus Security',
        email: 'training@university.edu',
        mobile: '+1-555-0401',
        contactName: 'Chief Tom Wilson',
        contactEmail: 'tom.wilson@university.edu',
        contactCountryCode: '+1',
        contactMobile: '+1-555-0402',
        address: '321 Campus Way',
        city: 'University Town',
        country: 'USA',
        postalCode: '40004',
        startAt: '2024-01-15',
        endAt: '2025-01-15',
        payStatus: 'paid',
        status: 'active',
        isOnline: 0,
        notes: 'University campus security department serving 50,000+ students and staff.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        subscriptionId: 4, // Custom Training
        numberOfUsers: 100,
        numberOfProUsers: 60,
        environmentId: 5, // Hospital Complex
        slug: 'federal-agency-training',
        name: 'Federal Agency Training Center',
        email: 'training@fedagency.gov',
        mobile: '+1-555-0501',
        contactName: 'Commander Alex Thompson',
        contactEmail: 'alex.thompson@fedagency.gov',
        contactCountryCode: '+1',
        contactMobile: '+1-555-0502',
        address: '654 Federal Plaza',
        city: 'Capital City',
        country: 'USA',
        postalCode: '50005',
        startAt: '2024-01-01',
        endAt: '2026-01-01',
        payStatus: 'paid',
        status: 'active',
        isOnline: 0,
        notes: 'Federal law enforcement training facility with custom VR scenarios.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // Create client admin users
    await queryInterface.bulkInsert('users', [
      {
        clientId: 1,
        name: 'Captain Sarah',
        lastName: 'Johnson',
        avatar: 'public/uploads/profile/avatar.png',
        role: 'client',
        permissions: JSON.stringify({ admin: true, training: true, reports: true }),
        email: 'sarah.johnson@metropd.gov',
        username: 'sarah.johnson',
        password: bcrypt.hashSync('Client#123', salt),
        mobile: '+1-555-0102',
        countryCode: '+1',
        dateOfBirth: '1980-05-15',
        gender: 'female',
        primaryHand: 'right',
        address: '123 Police Plaza',
        city: 'Metro City',
        country: 'USA',
        postalCode: '10001',
        emergencyContactName: 'John Johnson',
        emergencyContactPhone: '+1-555-0103',
        experienceLevel: 'advanced',
        stressLevel: 'medium',
        status: 'active',
        isPro: 1,
        isOnline: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 2,
        name: 'Director Mike',
        lastName: 'Chen',
        avatar: 'public/uploads/profile/avatar.png',
        role: 'client',
        permissions: JSON.stringify({ admin: true, training: true, reports: true }),
        email: 'mike.chen@securitycorp.com',
        username: 'mike.chen',
        password: bcrypt.hashSync('Client#123', salt),
        mobile: '+1-555-0202',
        countryCode: '+1',
        dateOfBirth: '1975-08-22',
        gender: 'male',
        primaryHand: 'right',
        address: '456 Security Blvd',
        city: 'Corporate City',
        country: 'USA',
        postalCode: '20002',
        emergencyContactName: 'Jane Chen',
        emergencyContactPhone: '+1-555-0203',
        experienceLevel: 'advanced',
        stressLevel: 'low',
        status: 'active',
        isPro: 1,
        isOnline: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 3,
        name: 'Manager Lisa',
        lastName: 'Rodriguez',
        avatar: 'public/uploads/profile/avatar.png',
        role: 'client',
        permissions: JSON.stringify({ admin: true, training: true }),
        email: 'lisa.rodriguez@mallsecurity.com',
        username: 'lisa.rodriguez',
        password: bcrypt.hashSync('Client#123', salt),
        mobile: '+1-555-0302',
        countryCode: '+1',
        dateOfBirth: '1985-03-10',
        gender: 'female',
        primaryHand: 'left',
        address: '789 Mall Drive',
        city: 'Shopping City',
        country: 'USA',
        postalCode: '30003',
        emergencyContactName: 'Carlos Rodriguez',
        emergencyContactPhone: '+1-555-0303',
        experienceLevel: 'intermediate',
        stressLevel: 'medium',
        status: 'active',
        isPro: 1,
        isOnline: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 4,
        name: 'Chief Tom',
        lastName: 'Wilson',
        avatar: 'public/uploads/profile/avatar.png',
        role: 'client',
        permissions: JSON.stringify({ admin: true, training: true, reports: true }),
        email: 'tom.wilson@university.edu',
        username: 'tom.wilson',
        password: bcrypt.hashSync('Client#123', salt),
        mobile: '+1-555-0402',
        countryCode: '+1',
        dateOfBirth: '1970-11-18',
        gender: 'male',
        primaryHand: 'right',
        address: '321 Campus Way',
        city: 'University Town',
        country: 'USA',
        postalCode: '40004',
        emergencyContactName: 'Mary Wilson',
        emergencyContactPhone: '+1-555-0403',
        experienceLevel: 'advanced',
        stressLevel: 'low',
        status: 'active',
        isPro: 1,
        isOnline: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        clientId: 5,
        name: 'Commander Alex',
        lastName: 'Thompson',
        avatar: 'public/uploads/profile/avatar.png',
        role: 'client',
        permissions: JSON.stringify({ admin: true, training: true, reports: true, custom: true }),
        email: 'alex.thompson@fedagency.gov',
        username: 'alex.thompson',
        password: bcrypt.hashSync('Client#123', salt),
        mobile: '+1-555-0502',
        countryCode: '+1',
        dateOfBirth: '1965-07-03',
        gender: 'male',
        primaryHand: 'right',
        address: '654 Federal Plaza',
        city: 'Capital City',
        country: 'USA',
        postalCode: '50005',
        emergencyContactName: 'Patricia Thompson',
        emergencyContactPhone: '+1-555-0503',
        experienceLevel: 'advanced',
        stressLevel: 'low',
        status: 'active',
        isPro: 1,
        isOnline: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     */

    await queryInterface.bulkDelete('users', {
      role: 'client'
    }, {});
    await queryInterface.bulkDelete('clients', null, {});
  }
};
