# VRAS Database Seeders Documentation

This document provides comprehensive information about the database seeders created for the VRAS (Virtual Reality Assessment System) backend.

## 📊 Database Structure Overview

The seeders create a complete VR training environment with realistic data across multiple organizations and scenarios.

### 🏗️ Seeder Files and Order

The seeders should be run in the following order to maintain referential integrity:

1. **`20250115000001-create_environments_seeder.js`** - Creates 8 VR training environments
2. **`20250115000002-create_subscriptions_seeder.js`** - Creates 5 subscription plans
3. **`20250115000003-create_scenarios_seeder.js`** - Creates 18 training scenarios
4. **`20250115000004-create_clients_seeder.js`** - Creates 5 client organizations + client admins
5. **`20250115000005-create_departments_seeder.js`** - Creates 20 departments across clients
6. **`20250115000006-create_users_seeder.js`** - Creates instructors and regular users
7. **`20250115000007-create_client_scenarios_seeder.js`** - Links clients to their available scenarios
8. **`20250115000008-create_user_departments_seeder.js`** - Assigns users to departments

## 🌍 Environments Created

| ID | Name | Description |
|----|------|-------------|
| 1 | Urban Warehouse | Large urban warehouse with multiple floors |
| 2 | Office Building | Multi-story office with conference rooms |
| 3 | Shopping Mall | Large shopping center with stores |
| 4 | School Campus | Educational facility with classrooms |
| 5 | Hospital Complex | Medical facility with patient rooms |
| 6 | Airport Terminal | Airport with security zones |
| 7 | Subway Station | Underground transit station |
| 8 | Residential Complex | Apartment building with common areas |

## 💰 Subscription Plans

| Plan | Price | Description |
|------|-------|-------------|
| Basic Training | $99.00 | Up to 10 users, limited scenarios |
| Professional Training | $299.00 | Up to 50 users, advanced scenarios |
| Enterprise Training | $599.00 | Unlimited users, all scenarios |
| Custom Training | $999.00 | Bespoke scenarios, dedicated support |
| Trial Package | $49.00 | 7-day trial, up to 5 users |

## 🎯 Training Scenarios

### Urban Warehouse Scenarios
- Warehouse Hostage Situation
- Bomb Threat Response
- Armed Robbery

### Office Building Scenarios
- Active Shooter - Office Complex
- Suspicious Package
- Workplace Violence

### Shopping Mall Scenarios
- Mall Shooting Incident
- Retail Theft with Weapon

### School Campus Scenarios
- School Shooting Response
- Campus Intruder

### Hospital Complex Scenarios
- Hospital Hostage Crisis
- Emergency Room Violence

### Airport Terminal Scenarios
- Airport Security Breach
- Suspicious Passenger

### Subway Station Scenarios
- Transit Station Attack
- Underground Pursuit

### Residential Complex Scenarios
- Domestic Violence Call
- Home Invasion Response

## 🏢 Client Organizations

### 1. Metro Police Department
- **Subscription**: Professional Training ($299.00)
- **Users**: 25 total, 15 pro users
- **Environment**: Urban Warehouse
- **Departments**: SWAT Team, Patrol Division, Detective Bureau, Traffic Division
- **Contact**: Captain Sarah Johnson

### 2. Security Corp International
- **Subscription**: Enterprise Training ($599.00)
- **Users**: 50 total, 30 pro users
- **Environment**: Office Building
- **Departments**: Executive Protection, Corporate Security, Event Security, Training Division
- **Contact**: Director Mike Chen

### 3. Mall Security Services
- **Subscription**: Basic Training ($99.00)
- **Users**: 10 total, 5 pro users
- **Environment**: Shopping Mall
- **Departments**: Retail Security, Loss Prevention, Crowd Control
- **Contact**: Manager Lisa Rodriguez

### 4. University Campus Security
- **Subscription**: Professional Training ($299.00)
- **Users**: 30 total, 20 pro users
- **Environment**: School Campus
- **Departments**: Campus Patrol, Residence Hall Security, Event Security, Emergency Response
- **Contact**: Chief Tom Wilson

### 5. Federal Agency Training Center
- **Subscription**: Custom Training ($999.00)
- **Users**: 100 total, 60 pro users
- **Environment**: Hospital Complex (primary)
- **Departments**: Special Operations, Intelligence Division, Counter-Terrorism, Cyber Security, Field Operations
- **Contact**: Commander Alex Thompson

## 👥 User Accounts Created

### 🔑 Default Passwords
- **Admin**: `Admin#123`
- **Client Admins**: `Client#123`
- **Instructors**: `Instructor#123`
- **Regular Users**: `User#123`

### 📊 User Distribution
- **1 System Admin** - Full system access
- **5 Client Admins** - One per client organization
- **7 Instructors** - Training coordinators per client
- **11 Regular Users** - Trainees across all clients

### 🎭 User Roles and Permissions
- **Admin**: Full system access
- **Client**: Client organization management
- **Instructor**: Training coordination and reporting
- **User**: Training participation

## 🏃‍♂️ Running the Seeders

### Using Sequelize CLI
```bash
# Run all seeders
npx sequelize-cli db:seed:all

# Run specific seeder
npx sequelize-cli db:seed --seed 20250115000001-create_environments_seeder.js

# Undo all seeders
npx sequelize-cli db:seed:undo:all

# Undo specific seeder
npx sequelize-cli db:seed:undo --seed 20250115000001-create_environments_seeder.js
```

### Manual Execution
Each seeder can be run individually, but they must be executed in the correct order to maintain referential integrity.

## 🔗 Relationships Created

### Client-Scenario Relationships
- Each client has access to scenarios appropriate for their subscription level
- Metro Police: Warehouse, Office scenarios
- Security Corp: Office, Mall scenarios  
- Mall Security: Mall scenarios only
- University: School, Hospital scenarios
- Federal Agency: All scenarios (enterprise access)

### User-Department Relationships
- Users are assigned to relevant departments within their organization
- Cross-department training assignments for comprehensive coverage
- Instructors typically assigned to training departments

### Environment-Scenario Relationships
- Each scenario is linked to its appropriate environment
- Multiple scenarios per environment for varied training

## 📈 Data Statistics

- **8 Environments** with unique VR training locations
- **5 Subscription Plans** with different pricing tiers
- **18 Training Scenarios** across all environments
- **5 Client Organizations** with realistic business data
- **20 Departments** with proper organizational structure
- **24 User Accounts** across all roles and organizations
- **Multiple Relationships** linking users, departments, and scenarios

## 🚀 Post-Seeding Access

After running all seeders, you can:

1. **Access API Documentation**: Visit `/api-docs` for Swagger documentation
2. **Login as Admin**: Use `admin@example.com` / `Admin#123`
3. **Login as Client Admin**: Use any client admin email / `Client#123`
4. **Test Online Status Tracking**: Users have mixed online/offline status
5. **Explore User Management**: Full admin interface with online tracking
6. **View Training Scenarios**: Complete scenario library available

## 🔧 Customization

The seeders are designed to be easily customizable:

- **Add New Environments**: Modify the environments seeder
- **Create New Scenarios**: Add to scenarios seeder with proper environment links
- **Add Client Organizations**: Extend clients seeder with new organizations
- **Modify User Data**: Update users seeder with different user profiles
- **Adjust Relationships**: Modify client-scenarios and user-departments seeders

## 🐛 Troubleshooting

### Common Issues
1. **Foreign Key Errors**: Ensure seeders run in correct order
2. **Duplicate Data**: Check for existing data before seeding
3. **Missing References**: Verify all referenced IDs exist in previous seeders

### Clean Slate
To start fresh:
```bash
# Drop and recreate database
npx sequelize-cli db:drop
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

This comprehensive seeding setup provides a realistic VRAS training environment with multiple organizations, users, and training scenarios for thorough testing and development.
