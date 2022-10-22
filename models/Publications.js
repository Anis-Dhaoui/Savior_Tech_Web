module.exports = (sequelize, DataTypes) => {
    const Publications = sequelize.define(
        'Publications',
        {
            titre: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING, allowNull: false
            },
            image: {
                type: DataTypes.STRING, allowNull: false
            },
            Date: {
                type: DataTypes.STRING, allowNull: false
            }

        }
    );

 
    return Publications;
}