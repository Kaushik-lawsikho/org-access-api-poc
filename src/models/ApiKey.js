module.exports = (sequelize, DataTypes) => {
    const ApiKey = sequelize.define('ApiKey', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'organizations',
          key: 'id'
        }
      },
      brandId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'brands',
          key: 'id'
        }
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    }, {
      tableName: 'api_keys',
      timestamps: true
    });
  
    return ApiKey;
  };