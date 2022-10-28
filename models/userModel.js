module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
            validate: {
                isNumeric: true
            }
        },
        domain: {
            type: DataTypes.STRING,
            allowNull: false
        },
        interest: {
            type: DataTypes.STRING,
            allowNull: false
        },
        speciality: {
            type: DataTypes.STRING,
            allowNull: false
        },
        admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "pending",
            validate: {
                isIn: [['pending', 'confirmed', 'blocked']]
            }
        },
        confirEmailCode: {
            type: DataTypes.STRING
        },
        confirResetPassCode: {
            type: DataTypes.STRING
        },
        confirSmsCode: {
            type: DataTypes.STRING
        }
    });
    Users.associate = models => {
        Users.belongsToMany(models.Events, { through: models.Participants })
        Users.belongsTo(models.Roles, { onDelete: "cascade" })

        Users.hasMany(models.Publications, { onDelete: "cascade" })
        Users.hasMany(models.Commentaires, { onDelete: "cascade" })
        Users.hasMany(models.Reactions, { onDelete: "cascade" })
        Users.hasMany(models.Signaler, { onDelete: "cascade" })


        Users.hasMany(models.reponses, { onDelete: "cascade" })
        Users.hasMany(models.questions, { onDelete: "cascade" })
        Users.hasMany(models.aimes, { onDelete: "cascade" })
    }

    return Users;
}