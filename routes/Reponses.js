var express = require('express');
var router = express.Router();
var db = require('../models');
var auth = require('../auth');

router.post('/add', auth.verifyToken, (req, res) => {
    db.reponses.create({
        message: req.body.message,
        questionId : req.body.questionId,
        UserId: req.user.id
}).then(
        (p) => {
            res.send(p);
        }
    );
});


router.get('/', function(req, res, next) {
    db.reponses.findAll().then((resp) => {
        res.send(resp);
    });
});
router.delete('/remove/:id', auth.verifyToken, (req, res) => {
    db.reponses.destroy({ where: { id: req.user.id} }).then(
        () => {
            res.send('removed');
        }
    );
});
router.put('/update/:id',  auth.verifyToken,(req, res) => {
    db.reponses.update(req.body, { where: { id: req.user.id} }).then(
        () => {
            res.send('updated');
        });

});
router.get('/detail/:id', function(req, res, next) {
    db.reponses.findOne({ where: { id: req.params.id } }).then((resp) => {
        res.send(resp);
    });
});



module.exports = router;