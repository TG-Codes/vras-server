'use strict';

const { Setting } = require('./Setting');
const { Logo } = require('./Logo');
const { Video } = require('./Video');
const { Cms } = require('./Cms');
const { Blog } = require('./Blog');
const { Newsletter } = require('./Newsletter');
const { Weapon } = require('./Weapon');
const { Permission } = require('./Permission');
const { Environment } = require('./Environment');
const { Subscription } = require('./Subscription');
const { Client } = require('./Client');
const { ClientScenario } = require('./ClientScenario');
const { Department } = require('./Department');
const { UserDepartment } = require('./UserDepartment');
const { User } = require('./User');
const { Scenario } = require('./Scenario');
const { Mission } = require('./Mission');
const { Session } = require('./Session');
const { UserSession } = require('./UserSession');
const { UserMission } = require('./UserMission');

// Scenarion and Environment Relation
Scenario.belongsTo(Environment, {
  foreignKey: 'environmentId'
});

Environment.hasMany(Scenario, {
  foreignKey: 'environmentId'
});

// ClientScenario Relation
ClientScenario.belongsTo(Client, {
  foreignKey: 'clientId'
});
ClientScenario.belongsTo(Scenario, {
  foreignKey: 'scenarioId'
});

// Environment and Scenario (Many-to-Many through ClientScenario)
Environment.belongsToMany(Scenario, {
  through: ClientScenario,
  foreignKey: 'environmentId',
  otherKey: 'scenarioId'
});
Scenario.belongsToMany(Environment, {
  through: ClientScenario,
  foreignKey: 'scenarioId',
  otherKey: 'environmentId'
});

// Client and Scenario (Many-to-Many through ClientScenario)
Client.belongsToMany(Scenario, {
  through: ClientScenario,
  foreignKey: 'clientId',
  targetKey: 'id'
});
Scenario.belongsToMany(Client, {
  through: ClientScenario,
  foreignKey: 'scenarioId',
  targetKey: 'id'
});

//  Client and Subscription Relation
Client.belongsTo(Subscription, {
  foreignKey: 'subscriptionId'
});

// Client and Environment Relation 
Client.belongsTo(Environment, {
  foreignKey: 'environmentId'
});

// Client and User Relation
User.belongsTo(Client, {
  foreignKey: 'clientId',
});

Client.hasMany(User, {
  foreignKey: 'clientId',
});

// Department and User (Many-to-Many through UserDepartment)
Department.belongsToMany(User, {
  through: UserDepartment,
  foreignKey: 'departmentId',
  otherKey: 'userId',
});
User.belongsToMany(Department, {
  through: UserDepartment,
  foreignKey: 'userId',
  otherKey: 'departmentId',
});

// Client and Department Relation
Department.belongsTo(Client, {
  foreignKey: 'clientId'
});
Client.hasMany(Department, {
  foreignKey: 'clientId'
});

// UserDepartment Relations
UserDepartment.belongsTo(User, {
  foreignKey: 'userId'
});
User.hasMany(UserDepartment, {
  foreignKey: 'userId'
});
UserDepartment.belongsTo(Department, {
  foreignKey: 'departmentId'
});
Department.hasMany(UserDepartment, {
  foreignKey: 'departmentId'
});

// Missions Section
// Missions and Client
Mission.belongsTo(Client, {
  foreignKey: 'clientId',
  // as: 'client'
});
Client.hasMany(Mission, {
  foreignKey: 'clientId',
  // as: 'missions'
});

// Missions and Environemnt Relation
Mission.belongsTo(Environment, {
  foreignKey: 'environmentId',
  // as: 'environment',
});
Environment.hasMany(Mission, {
  foreignKey: 'environmentId',
  // as: 'missions',
});

// Mission and Scenario Relation
Mission.belongsTo(Scenario, {
  foreignKey: 'scenarioId',
  // as: 'scenario',
});
Scenario.hasMany(Mission, {
  foreignKey: 'scenarioId',
  // as: 'missions',
});

// Mission and Department
Mission.belongsTo(Department, {
  foreignKey: 'departmentId',
  // as: 'department',
});
Department.hasMany(Mission, {
  foreignKey: 'departmentId',
  // as: 'missions',
});

// Session and Client
Session.belongsTo(Client, {
  foreignKey: 'clientId'
});

// Session and Scenario
Session.belongsTo(Scenario, {
  foreignKey: 'scenarioId'
});

// User and Session (Many-to-Many through UserSession)
User.belongsToMany(Session, {
  through: UserSession,
  foreignKey: 'userId',
  otherKey: 'sessionId'
});
Session.belongsToMany(User, {
  through: UserSession,
  foreignKey: 'sessionId',
  otherKey: 'userId'
});

// Mission and User (Many-to-Many through UserMission)
Mission.belongsToMany(User, {
  through: UserMission,
  foreignKey: 'missionId',
  otherKey: 'userId'
});
User.belongsToMany(Mission, {
  through: UserMission,
  foreignKey: 'userId',
  otherKey: 'missionId'
});

// userMission Relations
UserMission.belongsTo(Mission, {
  foreignKey: 'missionId',
});
Mission.hasMany(UserMission, {
  foreignKey: 'missionId',
});
