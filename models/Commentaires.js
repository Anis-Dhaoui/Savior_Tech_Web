module.exports = (sequelize, DataTypes) => {
    const Commentaires = sequelize.define(
        'Commentaires',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false
            },
        
            Date : {
                type : DataTypes.STRING,allowNull : false
            }
        
        }
    );
    Commentaires.associate = models => {
        Commentaires.belongsTo(models.Users, { onDelete: "cascade" })
        Commentaires.belongsTo(models.Publications, { onDelete: "cascade" })
    }   
    

    return Commentaires;
}