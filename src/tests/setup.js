const { sequelize } = require('../config/database');

// Setup test database
beforeAll(async () => {
  try {
    // Sync database for tests
    await sequelize.sync({ force: true });
    console.log('✅ Test database synced');
  } catch (error) {
    console.error('❌ Test database setup failed:', error);
    throw error;
  }
});

// Cleanup after all tests
afterAll(async () => {
  try {
    await sequelize.close();
    console.log('✅ Test database connection closed');
  } catch (error) {
    console.error('❌ Test database cleanup failed:', error);
  }
});

// Clean up after each test
afterEach(async () => {
  try {
    // Clear all tables
    await sequelize.truncate({ cascade: true });
  } catch (error) {
    console.error('❌ Test cleanup failed:', error);
  }
});
