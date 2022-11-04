var express = require('express');
var router = express.Router();
var db = require('../models');
var auth = require('../auth');
const Filter = require("bad-words");
const filter = new Filter();
const words = require("../extra-words.json");
filter.addWords(...words);

router.post('/add', auth.verifyToken, (req, res) => {
    db.reponses.create({
        message: filter.clean(req.body.message),
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
    db.reponses.destroy({ where: { UserId: req.user.id,questionId : req.body.questionId} }).then(
        () => {
            res.send('removed');
        }
    );
});
router.put('/update/:id',  auth.verifyToken,(req, res) => {
    db.reponses.update(req.body, { where: { UserId: req.user.id,questionId : req.body.questionId} }).then(
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