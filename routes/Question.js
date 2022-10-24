var express = require('express');
var router = express.Router();
var db = require('../models');


router.post('/add', (req, res) => {
    db.questions.create(req.body).then(
        (p) => {
            res.send(p);
        }
    );
});


router.get('/fetch', function(req, res, next) {
    db.questions.findAll().then((resp) => {
        res.send(resp);
    });
});
router.delete('/remove/:id', (req, res) => {
    db.questions.destroy({ where: { id: req.params.id } }).then(
        () => {
            res.send('removed');
        }
    );
});
router.put('/update/:id', (req, res) => {
    db.questions.update(req.body, { where: { id: req.params.id } }).then(
        () => {
            res.send('updated');
        });

});
router.get('/detail/:id', function(req, res, next) {
    db.questions.findOne({ where: { id: req.params.id } }).then((resp) => {
        res.send(resp);
    });
});



module.exports = router;