module.exports = (sequelize, DataTypes) => {
    const Reactions = sequelize.define(
        'Reactions',
        {
            reaction: {
                type: DataTypes.STRING
                
            }
        
        }
    );
        
    return Reactions;
}