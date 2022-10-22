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
        username: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        // email: {
        //     type: DataTypes.STRING
        // },
        // domain: {
        //     type: DataTypes.STRING
        // },
        // interest: {
        //     type: DataTypes.STRING
        // },
        // speciality: {
        //     type: DataTypes.STRING
        // },
        // admin: {
        //     type: DataTypes.BOOLEAN,
        //     defaultValue: false
        // },
        // confirmed: {
        //     type: DataTypes.BOOLEAN,
        //     defaultValue: false
        // }
    }
    );
    Users.associate = models => {
        Users.belongsTo(models.Roles, { onDelete: "cascade" })
    }
    return Users;
}