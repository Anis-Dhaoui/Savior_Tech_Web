var express = require('express');
var router = express.Router();
var db = require('../models');
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
const notifier = require('node-notifier');



router.post('/add', auth.verifyToken, (req, res) => {
    if (!req.files) {
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

        var file = req.files.image;
        var img_name = `${shortUUID.generate()}-${req.user.id}.${file.mimetype.split('/')[1]}`;

        if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {

            file.mv('public/images/upload/questions/' + img_name, function(err) {

                {
                    db.questions.create({
                        description: filter.clean(req.body.description),
                        titre: req.body.titre,
                        image: img_name,
                        UserId: req.user.id
                    }).then(
                        (p) => {
                            res.statusCode = 200;
                            res.send(p);
                        }
                    );
                }
            });
        }
    }
    notifier.notify(
        {
          title: 'Ajouter Question',
          subtitle: 'Ajouter Question',
          message: 'Votre Question a été ajouter',
          sound: true, // Case Sensitive string for location of sound file, or use one of macOS' native sounds (see below)
          icon: 'Terminal Icon', // Absolute Path to Triggering Icon
          contentImage: undefined, // Absolute Path to Attached Image (Content Image)
          open: undefined, // URL to open on Click
          wait: false, // Wait for User Action against Notification or times out. Same as timeout = 5 seconds
      
          // New in latest version. See `example/macInput.js` for usage
          timeout: 5, // Takes precedence over wait if both are defined.
          closeLabel: undefined, // String. Label for cancel button
          actions: undefined, // String | Array<String>. Action label or list of labels in case of dropdown
          dropdownLabel: undefined, // String. Label to be used if multiple actions
          reply: false // Boolean. If notification should take input. Value passed as third argument in callback and event emitter.
        },
        function (error, response, metadata) {
          console.log(response, metadata);
        }
      );
      
});

router.get('/', function(req, res, next) {
    db.questions.findAll({ where: { status: "actif" } }).then((resp) => {
        res.statusCode = 200;
        res.json({resp
        });
       /* notifier.notify({
            title: 'My notification',
            message: 'Hello, there!'
          });*/
    });
});
router.put('/remove/:Questionid', auth.verifyToken,(req, res) => {
    db.questions.update({status: "supprimer"}, { where: {id: req.params.Questionid,UserId: req.user.id,status: "actif"} }).then(
        () => {
            res.statusCode = 200;
            res.send('removed');
        }
    );
});
router.put('/update/:Questionid', auth.verifyToken, (req, res) => {
    if (!req.files){
    db.questions.update({
        description: filter.clean(req.body.description),
        titre: req.body.titre
    }, { where: {id: req.params.Questionid, UserId: req.user.id,status: "actif"} }).then(
        () => {
            res.statusCode = 200;
            res.send('updated');
        });
    }
    else{
        db.questions.findOne({ where: {id: req.params.Questionid, UserId: req.user.id,status: "actif"}, raw: true })
        .then((qr) => {
            if (qr.image != null) {
                var imgWithPath = `public/images/upload/questions/${qr.image}`;

                if (fs.existsSync(imgWithPath)) {
                        fs.unlink(imgWithPath, err => {
                            if (err) next(err);
                        });
                     
                } else {
                    console.log("image doesn't exist");
                }
            }
        },
            err => next(err))
      
        var file = req.files.image;
        var img_name = `${shortUUID.generate()}-${req.user.id}.${file.mimetype.split('/')[1]}`;

        if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {

            file.mv('public/images/upload/questions/' + img_name, function(err) {

                {
                    db.questions.update({
                        description: filter.clean(req.body.description),
                        titre: req.body.titre,
                        image: img_name
                    }, 
                    { where: {id: req.params.Questionid, UserId: req.user.id,status: "actif"} }).then(
                        () => {
                            res.statusCode = 200;
                            res.send('updated');
                        });
                }
            });
        }
    }
});
router.get('/detail/:Questionid', function(req, res, next) {
    db.questions.findOne({ where: { id: req.params.Questionid,status: "actif" } }).then((resp) => {
        res.statusCode = 200;
        res.json({resp});
        
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