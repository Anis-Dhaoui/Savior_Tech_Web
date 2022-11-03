const cronjob = require('node-cron');
const { Op, where } = require("sequelize");
const db = require('../models');
const USER = db.Users;
const EVENT = db.Events;
const reminderMsg = require('./reminderMsg');
const emailSender = require('./email');
const smsSender = require('./sms');

// cronjob.schedule('10,20,30,40,50,59 * * * * *', () => { // run this every 10 seconds (for test purpose)
cronjob.schedule('0 0 6 * * *', () => { // run this at 6:00:00 am every day
    const now = new Date(Date.now() + 24 * 60 * 60 * 1000); // reminder before one day
    EVENT.findAll({
        where: {
            event_start_date: {
                [Op.lte]: now
            }
        },
        attributes: ['event_title', 'event_location', 'event_orgoniser', 'event_start_date'],
        include: [
            {
                model: USER,
                attributes: ['fullName', 'phone', 'email'],
                through: { attributes: [] },
                where: { [Op.and]: [{ phone: { [Op.not]: null } }, { email: { [Op.not]: null } }] }
            }
        ],
        nest: true
    })
        .then((participants) => {
            var result = participants.map(el => el.get({ plain: true }));

            result.map(event => {
                event.Users.map(async user => {
                    var emailContent = reminderMsg(
                        user.fullName,
                        event.event_title,
                        event.event_start_date.toString().split('GMT')[0],
                        event.event_location,
                        event.event_orgoniser
                    );
                    // console.log(emailContent);
                    await emailSender(user.email, `${event.event_title} | REMINDER`, emailContent);
                    // await smsSender(
                    //     user.phone,
                    //     `Reminder: The event ${event.event_title} will started tomorrow 
                    //      at ${event.event_start_date.toString().split('GMT')[0]}`
                    // );
                })
            })
        })
    console.log(now);
});

module.exports = cronjob;