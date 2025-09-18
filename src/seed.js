const seedData = require('./seeders/seedData');
const { sequelize } = require('./models');

async function runSeeds() {
    try {
        await seedData();
        console.log('Seeding completed successfully✔️');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

runSeeds();