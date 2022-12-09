var express = require('express');
var router = express.Router();
var db = require('../models');
const Question=db.questions;
const USER = db.Users;
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

router.delete('/remove/:id', auth.verifyToken, (req, res) => {
    db.reponses.destroy({ where: { UserId: req.user.id,Id : req.params.id} }).then(
        (p) => {
            res.statusCode = 200;
        }
    );
});
router.put('/update/:id',  auth.verifyToken,(req, res) => {
    db.reponses.update(req.body, { where: { UserId: req.user.id,Id : req.body.id} }).then(
        () => {
            res.send();
        });

});

router.get('/:id', function(req, res, next) {
    db.reponses.findAll({ 
           include: [
        
        {
            model: USER,
            // attributes: { exclude: ['password'] },
            attributes: ['id', 'fullName', 'username', 'avatar']
        },
        {
            model:Question,
            // attributes: { exclude: ['password'] },
            attributes: ['UserId']
        }
       
    ], where: { questionId: req.params.id }, order: [['createdAt']] }).then((resp) => {
        res.send(resp);
    });
});



module.exports = router;