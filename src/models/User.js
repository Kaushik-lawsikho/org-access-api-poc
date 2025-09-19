module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user'
      },
      organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'organizations',
          key: 'id'
        }
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      tableName: 'users',
      timestamps: true
    });

    User.beforeCreate(async (user) => {
      await user.hashPassword();
    });

    User.beforeUpdate(async (user) => {
      if (user.changed('password')) {
        await user.hashPassword();
      }
    });

    User.prototype.hashPassword = async function() {
      const bcrypt = require('bcrypt');
      if(this.changed('password')) {
        this.password = await bcrypt.hash(this.password, 10);
      }
    };
    
    User.prototype.comparePassword = async function(candidatePassword) {
      const bcrypt = require('bcrypt');
      return await bcrypt.compare(candidatePassword, this.password);
    };

    User.prototype.toJSON = function() {
      const values = Object.assign({}, this.get());
      delete values.password;
      delete values.refreshToken;
      return values;
    }
  
    return User;
  };