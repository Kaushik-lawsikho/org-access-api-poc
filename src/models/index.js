const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Organization = require('./Organization')(sequelize, DataTypes);
const Brand = require('./Brand')(sequelize, DataTypes);
const Course = require('./Course')(sequelize, DataTypes);
const User = require('./User')(sequelize, DataTypes);
const ApiKey = require('./ApiKey')(sequelize, DataTypes);

Organization.hasMany(Brand, {foreignKey: 'organizationId', as: 'brands'});
Brand.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });

Organization.hasMany(Course, { foreignKey: 'organizationId', as: 'courses'});
Course.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });

Brand.hasMany(Course, { foreignKey: 'brandId', as: 'courses'});
Course.belongsTo(Brand, { foreignKey: 'brandId', as: 'brand' });

Organization.hasMany(User, { foreignKey: 'organizationId', as: 'users'});
User.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });

Organization.hasMany(ApiKey, { foreignKey: 'organizationId', as: 'apiKeys'});
ApiKey.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });

Brand.hasMany(ApiKey, { foreignKey: 'brandId', as: 'apiKeys'});
ApiKey.belongsTo(Brand, { foreignKey: 'brandId', as: 'brand' });

module.exports = {
    sequelize,
    Organization,
    Brand,
    Course,
    User,
    ApiKey
}