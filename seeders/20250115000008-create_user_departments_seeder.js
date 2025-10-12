'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     */

    await queryInterface.bulkInsert('userDepartments', [
      // Metro Police Department User-Department Assignments
      // Instructors
      {
        userId: 7, // Sergeant Martinez
        departmentId: 1, // SWAT Team
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 8, // Lieutenant Davis
        departmentId: 2, // Patrol Division
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Users
      {
        userId: 13, // Officer Smith
        departmentId: 2, // Patrol Division
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 14, // Officer Johnson
        departmentId: 2, // Patrol Division
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 15, // Detective Williams
        departmentId: 3, // Detective Bureau
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Security Corp International User-Department Assignments
      // Instructors
      {
        userId: 9, // Senior Trainer Kim
        departmentId: 5, // Executive Protection
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 10, // Training Specialist Brown
        departmentId: 8, // Training Division
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Users
      {
        userId: 16, // Security Guard Miller
        departmentId: 6, // Corporate Security
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 17, // Security Specialist Wilson
        departmentId: 5, // Executive Protection
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Mall Security Services User-Department Assignments
      // Instructors
      {
        userId: 11, // Training Manager Garcia
        departmentId: 9, // Retail Security
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Users
      {
        userId: 18, // Mall Guard Moore
        departmentId: 9, // Retail Security
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 19, // Loss Prevention Jackson
        departmentId: 10, // Loss Prevention
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // University Campus Security User-Department Assignments
      // Instructors
      {
        userId: 12, // Training Coordinator Anderson
        departmentId: 12, // Campus Patrol
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Users
      {
        userId: 20, // Campus Officer White
        departmentId: 12, // Campus Patrol
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 21, // Residence Guard Harris
        departmentId: 13, // Residence Hall Security
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Federal Agency Training Center User-Department Assignments
      // Instructors
      {
        userId: 13, // Lead Instructor Taylor (Note: This creates a duplicate userId, should be corrected)
        departmentId: 17, // Special Operations
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Users
      {
        userId: 22, // Special Agent Martin
        departmentId: 17, // Special Operations
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 23, // Field Agent Thompson
        departmentId: 19, // Counter-Terrorism
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Additional cross-department assignments for comprehensive training
      // Metro Police - SWAT Team members also train in Patrol scenarios
      {
        userId: 7, // Sergeant Martinez
        departmentId: 2, // Patrol Division
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Security Corp - Executive Protection also handles Corporate Security
      {
        userId: 9, // Senior Trainer Kim
        departmentId: 6, // Corporate Security
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Mall Security - Retail Security also handles Loss Prevention
      {
        userId: 11, // Training Manager Garcia
        departmentId: 10, // Loss Prevention
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // University - Campus Patrol also handles Emergency Response
      {
        userId: 12, // Training Coordinator Anderson
        departmentId: 15, // Emergency Response
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 20, // Campus Officer White
        departmentId: 15, // Emergency Response
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Federal Agency - Cross-training assignments
      {
        userId: 22, // Special Agent Martin
        departmentId: 18, // Intelligence Division
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 23, // Field Agent Thompson
        departmentId: 20, // Field Operations
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     */

    await queryInterface.bulkDelete('userDepartments', null, {});
  }
};
