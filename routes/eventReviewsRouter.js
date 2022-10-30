const express = require('express');
const db = require('../models');
const REVIEWS = db.Reviews;
const EVENTS = db.Events;
const USER = db.Users;
const reviewRouter = express.Router();
reviewRouter.use(express.json());
var auth = require('../auth');

// /reviews/ api endpoint
reviewRouter.route('/')
    .get((req, res, next) => {
        REVIEWS.findAll({
            include: [
                {
                    model: USER,
                    // attributes: { exclude: ['password'] },
                    attributes: ['id', 'fullName', 'username', 'avatar']
                },
                {
                    model: EVENTS,
                    attributes: ['id', 'event_title']
                }
            ]
        })
            .then((reviews) => {
                    if (reviews !== null) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(reviews);
                    } else {
                        err = new Error("Reviews collection is empty");
                        next(err);
                    }
                },
                err => next(err))
            .catch(err => next(err))
    })
    .post((req, res, next) => {
        REVIEWS.create(req.body)
            .then((review) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ success: true, message: "Review added successfully", review: review });
            })
            .catch(err => next(err));
    })

//☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠ DANGER ZONE ☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠
.delete((req, res, next) => {
    REVIEWS.destroy({ where: {} })
        .then((review) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ success: true, message: "All reviews deleted successfully", deletedReviews: review });
            },
            err => next(err))
        .catch(err => next(err))
});
//☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠ DANGER ZONE ☠☠☠☠☠☠☠☠☠☠☠☠☠☠☠


// /reviews/reviewId api endpoint
reviewRouter.route('/:reviewId')
    .get((req, res, next) => {
        REVIEWS.findOne({ where: { id: req.params.reviewId } })
            .then((review) => {
                    if (review != null) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(review);
                    } else {
                        err = new Error("Review not found");
                        next(err);
                    }
                },
                err => next(err))
            .catch(err => next(err))
    })
    .put((req, res, next) => {
        REVIEWS.update(req.body, { where: { id: req.params.reviewId } })
            .then((review) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ success: true, message: "Review updated successfully", updatedReview: review });
                },
                err => next(err))
            .catch(err => next(err))
    })
    .delete((req, res, next) => {
        REVIEWS.destroy({ where: { id: req.params.reviewId } })
            .then((review) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ success: true, message: "Review deleted successfully", deletedReview: review });
                },
                err => next(err))
            .catch(err => next(err))
    });

module.exports = reviewRouter;