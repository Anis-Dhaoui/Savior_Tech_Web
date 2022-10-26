module.exports = (sequelize, DataTypes) => {
    const Reactions = sequelize.define(
        'Reactions',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            reaction: {
                type: DataTypes.STRING, allowNull: false
                
            }
          
        
        }
    );
    Reactions.associate = models => {
        Reactions.belongsTo(models.Users, { onDelete: "cascade" })
        Reactions.belongsTo(models.Publications,{onDelete:"cascade"})
    }
    return Reactions;
}