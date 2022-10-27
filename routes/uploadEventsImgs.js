const express = require('express');
const uploadEventImages = express.Router();
uploadEventImages.use(express.json());
const auth = require('../auth');
const multer = require('multer');
const { storage, imageFilter, deleteImage } = require('../utils/imageUploadHandler');

const upload = multer({ storage: storage("events"), fileFilter: imageFilter }).array('images', 8);

uploadEventImages.route('/')
    .post(auth.verifyToken, auth.verifyAdmin, (req, res, next) => {
        upload(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === "LIMIT_UNEXPECTED_FILE") {
                    res.statusCode = 429;
                    res.json({success: false, statusMsg: "You could not upload more than 8 pictures"})
                }
            } else if (err) {
                res.statusCode = 500;
                res.statusMessage = "Something went wrong"
                res.end();
            }
            else {
                res.statusCode = 200;
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.json({success: true, statusMsg: "images uploded successfully", uploadedImages: req.files});
            }
        })
    })


    .delete(auth.verifyToken, auth.verifyAdmin, (req, res, next) => {
        const result = deleteImage(req, res, next, "events");

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ notExistFiles: result.notExistFiles, deletedFiles: result.deletedFiles });
    });

module.exports = uploadEventImages;