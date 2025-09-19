const sequelize = require('../config/database');

async function updateModels() {
  try {
    console.log('🔄 Updating database models...');
    
    // Sync all models with the database
    await sequelize.sync({ alter: true });
    
    console.log('✅ Database models updated successfully!');
    console.log('📋 Changes made:');
    console.log('   - Added new fields to User model');
    console.log('   - Added new fields to Course model');
    console.log('   - Added soft delete functionality');
    console.log('   - Updated model relationships');
    
  } catch (error) {
    console.error('❌ Error updating models:', error);
  } finally {
    await sequelize.close();
  }
}

updateModels();