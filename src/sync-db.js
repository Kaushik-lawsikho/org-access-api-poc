const { sequelize } = require('./models');

async function syncDatabase() {
    try {
        await sequelize.sync({ force: true });
        console.log('Database tables created successfully✔️');
        process.exit(0);
    }catch(error) {
        console.error('❌ Database sync failed:', error);
        process.exit(1);
    }
}

syncDatabase();