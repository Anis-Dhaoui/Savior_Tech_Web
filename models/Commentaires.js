module.exports = (sequelize, DataTypes) => {
    const Commentaires = sequelize.define(
        'Commentaires',
        {
            description: {
                type: DataTypes.STRING,
                allowNull: false
            },
        
            Date : {
                type : DataTypes.STRING,allowNull : false
            }
        
        }
    );
   
    return Commentaires;
}