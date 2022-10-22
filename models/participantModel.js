module.exports = (sequelize, DataTypes) => {
    const Participants = sequelize.define('Participants', {}, { timestamps: false });
    return Participants;
}