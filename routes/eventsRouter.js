const express = require('express');
const eventRouter = express.Router();
const db = require('../models');
const EVENT = db.Events;
const PARTICIPANT = db.Participants;
const USER = db.Users;

//For testing purpose
// const reqUserId = "41b6a7e0-59bc-4528-ae7e-b3fbe64303a8";
const reqUserId = "41b6a7e0-59bc-4528-ae7e-b3fbe64303b5";

eventRouter.use(express.json());

// /events/ api endpoint
eventRouter.route('/')
    .get((req, res, next) => {
        EVENT.findAll({
            include: [
                {
                    model: USER,
                    attributes: { exclude: ['password'] },
                    // attributes: ['id', 'fullName', 'username']
                }
            ]
        })
            .then((events) => {
                if (events !== null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(events);
                } else {
                    err = new Error(err);
                    next(err);
                }
            },
                err => next(err))
            .catch(err => next(err))
    })
    .post((req, res, next) => {
        EVENT.create(req.body)
            .then((event) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ success: true, message: "Event added successfully", event: event });
            },
                err => {
                    // if err.code === 11000 that means there is a duplicate key
                    if (err.code && err.code === 11000) {
                        res.statusCode = 409;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ success: false, message: "Event name is already exist" });
                    } else
                        next(err);
                })
            .catch(err => next(err));
    });




// /events/eventId api endpoint
eventRouter.route('/:eventId')
    .get((req, res, next) => {
        EVENT.findOne({
            where: { id: req.params.eventId },
            include: [
                {
                    model: USER,
                    attributes: { exclude: ['password'] },
                    // attributes: ['id', 'fullName', 'username']
                }
            ]
        })
            .then((event) => {
                if (event != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(event);
                } else {
                    err = new Error("Event not found");
                    next(err);
                }
            },
                err => next(err))
            .catch(err => next(err))
    })
    .put((req, res, next) => {
        EVENT.update(req.body, { where: { id: req.params.eventId } })
            .then((event) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ success: true, message: "Event updated successfully", updatedEvent: event });
            },
                err => next(err))
            .catch(err => next(err))
    })
    .delete((req, res, next) => {
        EVENT.destroy({ where: { id: req.params.eventId } })
            .then((event) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ success: true, message: "Event deleted successfully", deletedEvent: event });
            },
                err => next(err))
            .catch(err => next(err))
    })




    //$$$$$$$$$$$$$$// USER PARTICIPATE TO EVENT //$$$$$$$$$$$$$$//
    .post((req, res, next) => {
        var obj = {
            "UserId": reqUserId,
            "EventId": req.params.eventId
        }
        PARTICIPANT.create(obj)
            .then((result) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ success: true, message: "Participated successfully", result: result });
            },
                err => {
                    // console.log(err.parent.code);
                    // if err.parent.code === "ER_DUP_ENTRY" that means there is a duplicate key
                    if (err.parent.code && err.parent.code === "ER_DUP_ENTRY") {
                        res.statusCode = 409;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ success: false, message: "Already participated" });
                    } else
                        next(err);
                })
            .catch(err => next(err));
    })

module.exports = eventRouter;