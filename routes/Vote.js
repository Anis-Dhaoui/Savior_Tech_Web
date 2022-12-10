var express = require('express');
var router = express.Router();
var db = require('../models');
var auth = require('../auth');

router.post('/add', auth.verifyToken, (req, res) => {
    db.vote.findOne({ where: { reponseId : req.body.reponseId,UserId: req.user.id } }).then((resp) => {
        if (!resp) {
            db.vote.create({
                vote:req.body.vote,
                reponseId : req.body.reponseId,
                UserId: req.user.id
        }).then(
                (p) => {
                    res.send(p);
                }
            );

        }
        else{
            db.vote.update({vote:req.body.vote}, { where: { reponseId : req.body.reponseId,UserId: req.user.id} }).then(
                (p) => {
                    res.send(p);
                });
        }
    });

});

router.delete('/remove/:id',auth.verifyToken, (req, res) => {
    db.vote.destroy({ where: { reponseId : req.body.reponseId,UserId: req.user.id} }).then(
        () => {
            res.send('removed');
        }
    );
});
router.get('/detail/:id', function(req, res, next) {
    db.vote.findAll({ where: { reponseId : req.params.id } }).then((resp) => {
        res.send(resp);
    });
});



module.exports = router;