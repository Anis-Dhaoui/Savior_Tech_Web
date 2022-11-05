var express = require('express');
var router = express.Router();
var db = require('../models');

var auth = require('../auth');

router.post('/add', auth.verifyToken, (req, res, next) => {
    db.Signaler.count({ where: { statut: req.body.statut, PublicationId: req.body.PublicationId, UserId: req.body.UserId } })
        .then((count) => {
            if (count != 0) {
                res.send("deja Signaler")
            } else {
                db.Signaler.create({
                    statut: "signaler",
                    UserId: req.user.id,
                    PublicationId: req.body.PublicationId
                }).then(() => {
                    res.send("Signaler !")
                 }).then(() => {
                    db.Signaler.count({ where: { PublicationId: req.body.PublicationId } }).then((count) => {
                        if (count <= 1) {
                            db.Publications.update(
                                { statut: 'Deactive' },
                                { where: { id: req.body.PublicationId } }
                            )
                        }
                    })

                })
            }
        })

 })

module.exports = router;