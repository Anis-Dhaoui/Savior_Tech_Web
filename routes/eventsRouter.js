const express = require('express');
const eventRouter = express.Router();
const db = require('../models');
const EVENT = db.Events;
const PARTICIPANT = db.Participants;
const USER = db.Users;
const shortUUID = require('short-uuid');
const auth = require('../auth');
const fs = require('fs');

eventRouter.use(express.json());

// /events/ api endpoint
eventRouter.route('/')
    .get((req, res, next) => {
        EVENT.findAll({
            include: [
                {
                    model: USER,
                    // attributes: { exclude: ['password'] },
                    attributes: ['id', 'fullName', 'avatar', 'domain'],
                    through: { attributes: [] }
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
    .post(auth.verifyToken, auth.verifyAdmin, (req, res, next) => {
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
            },
                err => next(err))
            .catch(err => next(err))

        EVENT.destroy({ where: { id: req.params.eventId } })
            .then((event) => {

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ success: true, message: "Event deleted successfully", deletedEvent: event });
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