module.exports = (sequelize, DataTypes) => {
    const questions = sequelize.define(
        'questions', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false
            },
            date: {
                type: DataTypes.DATE
            },
            titre: {
                type: DataTypes.STRING,
                allowNull: false
            },
            image: {
                type: DataTypes.STRING,
                allowNull: false
            }

        }
    );
    questions.associate = models => {
        questions.hasMany(models.reponses, { onDelete: "cascade" })
        questions.hasMany(models.aimes, { onDelete: "cascade" })
        questions.belongsTo(models.Users, { onDelete: "cascade" })
    }
    return questions;
}