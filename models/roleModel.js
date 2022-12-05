module.exports = (sequelize, DataTypes) => {
    const Roles = sequelize.define('Roles', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        roleName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    // Roles.associate = models => {
    //     Roles.hasMany(models.Users, { onDelete: "cascade" })

    // }
    return Roles;
}