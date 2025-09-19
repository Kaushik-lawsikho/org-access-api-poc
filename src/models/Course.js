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
      },
      status: {
        type: DataTypes.ENUM('draft', 'published', 'archived'),
        defaultValue: 'draft'
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    }, {
      tableName: 'courses',
      paranoid: true,
      timestamps: true
    });

    Course.prototype.softDelete = async function() {
      this.deletedAt = new Date();
      this.isActive = false;
      return await this.save();
    };

    Course.prototype.restore = async function() {
      this.deletedAt = null;
      this.isActive = true;
      return await this.save();
    }
  
    return Course;
  };