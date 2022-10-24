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
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
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
            defaultValue: "pending"
        }
    });
    Users.associate = models => {
        Users.belongsToMany(models.Events, { through: models.Participants })
        Users.belongsTo(models.Roles, { onDelete: "cascade" })

        Users.hasMany(models.Publications,{onDelete:"cascade"})
        Users.hasMany(models.Commentaires,{onDelete:"cascade"})
        Users.hasMany(models.Reactions,{onDelete:"cascade"})

        Users.hasMany(models.reponses, { onDelete: "cascade" })
        Users.hasMany(models.questions, { onDelete: "cascade" })
        Users.hasMany(models.aimes, { onDelete: "cascade" })
    }

    return Users;
}