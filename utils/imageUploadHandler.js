const multer = require('multer');
const fs = require('fs');
const shortUUID = require('short-uuid');

// Configure destination upload of the image file and with which name
exports.storage = (directory) => {
    return (
        multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, `public/images/${directory}`);
            },
            filename: (req, file, cb) => {
                cb(null, `${shortUUID.generate()}-${req.user.id}.${file.mimetype.split('/')[1]}`);
            }
        })
    )
}

// Check uploaded file extension
exports.imageFilter = (req, file, cb) => {
    if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        cb(null, true);
    } else {
        const err = new Error("This file is not an image");
        cb(err, false)
    }
};

// Remove one or multiple images
exports.deleteImage = (req, res, next, directory) =>{
    var notExistFiles = [];
    var deletedFiles = [];
    
    for (let i of req.body) {
        if (fs.existsSync(`public/images/${directory}/${i}`)) {
            if (i.includes(req.user.id)) {
                fs.unlink(`public/images/${directory}/${i}`, (err) => {
                    if (err) next(err);
                });
                deletedFiles.push(i);
            } else
                console.log("This is not your own picture");
            continue;
        } else {
            notExistFiles.push(i);
        }
    }
    return {
        notExistFiles,
        deletedFiles
    }
}