const cronjob = require('node-cron');
const { Op, where } = require("sequelize");
const db = require('../models');
const USER = db.Users;
const EVENT = db.Events;
const PARTICIPANT = db.Participants;


// cronjob.schedule('10 45 19 * * *', () => { // run this at 7:45:10pm every day
// const now =  new Date(Date.now() - 5*60*60 * 1000);   //remove if not confirmed in 5 hours

cronjob.schedule('10,20,30,40,50,59 * * * * *', () => {
    const now = new Date(Date.now() + 48 * 60 * 60 * 1000);
    EVENT.findAll({
        where: {
            event_start_date: {
                [Op.gte]: now
            }
        },
        attributes: ['event_title', 'event_location', 'event_orgoniser'],
        include: [
            {
                model: USER,
                attributes: ['phone', 'email'],
                through: { attributes: [] },
                where: { [Op.and]: [{ phone: { [Op.not]: null } }, { email: { [Op.not]: null } }] }
            }
        ],
        raw: true,
        nest: true
    })
        .then((participants) => {
            console.log(participants);
            // participants.map((item) =>{
            //     console.log(item);
            // })
        })
    console.log(now);
});

module.exports = cronjob;