const express = require('express');
const eventRouter = express.Router();
const db = require('../models');
const EVENT = db.Events;
const PARTICIPANT = db.Participants;
const USER = db.Users;
const REVIEWS = db.Reviews;
const shortUUID = require('short-uuid');
const auth = require('../auth');
const fs = require('fs');
eventRouter.use(express.json());
console.log(process.env.SMSSENDER)
//For testing purpose
// const reqUserId = "41b6a7e0-59bc-4528-ae7e-b3fbe64303a8";
// const reqUserId = "41b6a7e0-59bc-4528-ae7e-b3fbe64303b5";

eventRouter.route('/')
    // .get((req, res, next) => {
    //     const limit = 5;
    //     var queryValue = req.query.category ? { event_category: req.query.category } : null;
    //     EVENT.findAll({
    //         where: queryValue,
    //         offset: (req.query.page - 1) * limit,
    //         limit: limit,
    //         include: [
    //             {
    //                 model: USER,
    //                 // attributes: { exclude: ['password'] },
    //                 attributes: ['id', 'fullName', 'avatar', 'domain'],
    //                 through: { attributes: [] }
    //             },

    //             {
    //                 model: REVIEWS,
    //                 attributes: ['id', 'rating'],

    //             }
    //         ]
    //     })
    .get((req, res, next) => {
        EVENT.findAll({
            include: [
                {
                    model: USER,
                    // attributes: { exclude: ['password'] },
                    attributes: ['id', 'fullName', 'avatar', 'domain'],
                    through: { attributes: [] }
                },

                {
                    model: REVIEWS,
                    attributes: ['id', 'rating'],

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
        if (!req.files) {
            EVENT.create(req.body)
                .then((event) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ success: true, message: "Event added successfully", event: event });
                },
                    err => next(err))
                .catch(err => next(err));
        } else {
            var file = req.files.image;
            var imageName = `${shortUUID.generate()}-${req.user.id}.${file.mimetype.split('/')[1]}`;
            if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {
                file.mv('public/images/upload/events/' + imageName, (err) => {
                    if (err) {
                        next(err)
                    } else {
                        req.body.event_image = imageName;
                        EVENT.create(req.body)
                            .then((event) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json({ success: true, message: "Event added successfully", event: event });
                            },
                                err => next(err))
                            .catch(err => next(err));

                    }
                })
            }
        }
    });




// /events/eventId api endpoint
eventRouter.route('/:eventId')
    .get((req, res, next) => {
        EVENT.findOne({
            where: { id: req.params.eventId },
            include: [
                {
                    model: USER,
                    attributes: ['id', 'fullName', 'avatar', 'domain'],
                    through: { attributes: [] }
                },
                {
                    model: REVIEWS,
                    attributes: { exclude: ['EventId'] }
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
    .delete(auth.verifyToken, auth.verifyAdmin, (req, res, next) => {
        EVENT.findOne({ where: { id: req.params.eventId }, raw: true })
            .then((event) => {
                // REMOVE IMAGE IF EXIST
                if (event.event_image != null) {
                    var imgWithPath = `public/images/upload/events/${event.event_image}`;

                    if (fs.existsSync(imgWithPath)) {
                        if (event.event_image.includes(req.user.id)) {
                            fs.unlink(imgWithPath, err => {
                                if (err) next(err);
                            });
                        } else {
                            console.log("This is not your own picture");
                        }
                    } else {
                        console.log("image doesn't exist");
                    }
                }

                // REMOVE THE SPECIFIED ANYWAYS
                EVENT.destroy({ where: { id: req.params.eventId } })
                    .then((event) => {

                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ success: true, message: "Event deleted successfully", deletedEvent: event });
                    },
                        err => next(err))
                    .catch(err => next(err))
            },
                err => next(err))
            .catch(err => next(err))
    })



// $$$$$$$$$$$$$$$$$$$$ PARTICIPATE/UNPARTICPATE $$$$$$$$$$$$$$$$$$$$$$$$$$
eventRouter.post('/participate/:eventId', auth.verifyToken, (req, res, next) => {
    var obj = {
        "UserId": req.user.id,
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
                    PARTICIPANT.destroy({ where: { UserId: req.user.id, EventId: req.params.eventId } })
                        .then(() => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({ success: true, message: "Your particpation has been canceled successfully" });
                        },
                            err => next(err))
                        .catch(err => next(err));
                } else
                    next(err);
            })
        .catch(err => next(err));
})


module.exports = eventRouter;