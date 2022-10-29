var express = require('express');
var router = express.Router();
var db = require('../models');
var auth = require('../auth');

router.post('/add', auth.verifyToken, (req, res) => {
    db.aimes.findOne({ where: { questionId : req.body.questionId,UserId: req.user.id } }).then((resp) => {
        if (!resp) {
            db.aimes.create({
                questionId : req.body.questionId,
                UserId: req.user.id
        }).then(
                (p) => {
                    res.send(p);
                }
            );
        }
        else{
            res.send("j'aime")
        }
    });

});

router.delete('/remove/:id',auth.verifyToken, (req, res) => {
    db.aimes.destroy({ where: { questionId : req.body.questionId,UserId: req.user.id} }).then(
        () => {
            res.send('removed');
        }
    );
});
router.get('/detail/:id', function(req, res, next) {
    db.aimes.findAndCountAll({ where: { questionId : req.params.id } }).then((resp) => {
        res.send(resp);
    });
});



module.exports = router;