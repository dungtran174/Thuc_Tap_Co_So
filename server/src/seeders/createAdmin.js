'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('role', [
      {
        name: 'customer',
        description: 'Regular customer',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'admin',
        description: 'System administrator',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('role', null, {});
  }
};