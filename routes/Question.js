var express = require('express');
var router = express.Router();
var db = require('../models');
const USER = db.Users;
const reponses = db.Reponses;
var auth = require('../auth');
const shortUUID = require('short-uuid');
const Filter = require("bad-words");
const filter = new Filter();
const fs = require('fs');
const words = require("../extra-words.json");
const { raw } = require('body-parser');
filter.addWords(...words);
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const or = Sequelize.or;
const notifier = require('node-notifier');



router.post('/add', auth.verifyToken, (req, res) => {
    if (!req.body.image) {
        db.questions.create({
            description: filter.clean(req.body.description),
            titre: req.body.titre,
            UserId: req.user.id
        }).then(
            (p) => {
                res.statusCode = 200;
                res.send(p);
            }
        );
    } else {
       // var file = req.files.image;
        
      //  var img_name = `${shortUUID.generate()}${file.name}`;

        //if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {

           // file.mv('public/images/upload/questions/' + file.name, function(err) {

                {
                    db.questions.create({
                        description: filter.clean(req.body.description),
                        titre: req.body.titre,
                        image: req.body.image,
                        UserId: req.user.id
                    }).then(
                        (p) => {
                            res.statusCode = 200;
                            res.send(p);
                        }
                    );
                }
           // });
       // }
    }
      
});

router.get('/admin', auth.verifyToken,auth.verifyAdmin, function(req, res, next) {
    db.questions.findAll(
        {     include: [
            {
                model: USER,
                // attributes: { exclude: ['password'] },
                attributes: ['id', 'fullName', 'avatar']
            }
           
        ], order: [['createdAt', 'desc']] }).then((resp) => {
        res.statusCode = 200;
        res.send(resp);
       
       /* notifier.notify({
            title: 'My notification',
            message: 'Hello, there!'
          });*/
    });
});
router.get('/', function(req, res, next) {
    db.questions.findAll(
        {     include: [
            {
                model: USER,
                // attributes: { exclude: ['password'] },
                attributes: ['id', 'fullName', 'avatar']
            }
           
        ], where: { status: "actif" }, order: [['createdAt', 'desc']] }).then((resp) => {
        res.statusCode = 200;
        res.send(resp);
       
       /* notifier.notify({
            title: 'My notification',
            message: 'Hello, there!'
          });*/
    });
});
router.put('/remove/:Questionid', auth.verifyToken,(req, res) => {
    db.questions.update({status: "supprimer"}, { where: {id: req.params.Questionid,UserId: req.user.id,status: "actif"} }).then(
        (p) => {
            res.statusCode = 200;
            res.send(p);
        }
    );
});
router.put('/removeAdmin/:Questionid', auth.verifyToken,auth.verifyAdmin,(req, res) => {
    db.questions.findAll(
        {     include: [
            {
                model: USER,
                // attributes: { exclude: ['password'] },
                attributes: ['id', 'fullName', 'avatar']
            }
           
        ], where: {id: req.params.Questionid } }).then((resp) => {
            if(resp[0].status=="actif"){
                db.questions.update({status: "supprimer"}, { where: {id: req.params.Questionid} }).then(
                    (p) => {
                        res.statusCode = 200;
                        res.send(p);
                    }
                );
            }
           else  if(resp[0].status=="supprimer"){
            db.questions.update({status: "actif"}, { where: {id: req.params.Questionid} }).then(
                (p) => {
                    res.statusCode = 200;
                    res.send(p);
                }
            );
        }
    });

});
router.put('/update/:Questionid', auth.verifyToken, (req, res) => {

    db.questions.update({
        description: filter.clean(req.body.description),
        titre: req.body.titre,
        image:req.body.image
    }, { where: {id: req.params.Questionid,  UserId: req.user.id  ,status: "actif"} }).then(
        (p) => {
            res.statusCode = 200;
            res.send(p);
        });
   

});
router.put('/updateAdmin/:Questionid', auth.verifyToken,auth.verifyAdmin, (req, res) => {

    db.questions.update({
        description: filter.clean(req.body.description),
        titre: req.body.titre,
        image:req.body.image
    }, { where: {id: req.params.Questionid ,status: "actif"} }).then(
        (p) => {
            res.statusCode = 200;
            res.send(p);
        });
   

});
router.get('/detail/:Questionid', function(req, res, next) {
    db.questions.findOne({  include: [
        {
            model: USER,
            // attributes: { exclude: ['password'] },
            attributes: ['id', 'fullName', 'avatar']
        }
       
    ], where: { id: req.params.Questionid,status: "actif" } }).then((resp) => {
        res.statusCode = 200;
        res.send(resp);
        
    });
});

router.get('/search/:searchTerm', function (req, res, next) {
    var searchTerm = req.params.searchTerm;
    db.questions.findAll({
      where: {status: "actif",
        [Op.or]: [{ titre: { [Op.like]: `%${searchTerm}%` } }, { description: { [Op.like]: `%${searchTerm}%` } }],
      }
    }).then((resp) => {
      res.send(resp);
    });
  });

module.exports = router;