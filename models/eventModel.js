module.exports = (sequelize, DataTypes) => {
    const Events = sequelize.define('Events', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        event_title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        event_image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        event_category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        event_description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        event_start_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        event_end_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        event_status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        event_location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        event_price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        event_orgoniser: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        event_max_participant: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }
    );
    Events.associate = models => {
        Events.belongsToMany(models.Users, { through: models.Participants })
        Events.hasMany(models.Reviews, { onDelete: "cascade" })
    }
    return Events;
}