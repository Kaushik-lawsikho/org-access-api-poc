module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define('Course', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true
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
      }
    }, {
      tableName: 'courses',
      timestamps: true
    });
  
    return Course;
  };