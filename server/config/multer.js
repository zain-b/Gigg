var path = require('path');
var multer = require('multer');
var properties = require('./properties');
var sha1 = require('sha1');

var storage = multer.diskStorage({
    destination:
        function (req, file, cb) {
            cb(null, properties.uploadsDir)
        },
    filename:
        function (req, file, cb) {
            cb(null, prepareFileName(file));
        }
});

function prepareFileName(file) {
    let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
    let hashed = sha1(file.originalname + Date.now());
    return hashed + ext;
}

var upload = multer({ //multer settings
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'));
        }
        callback(null, true);
    },
    limits:{
        fileSize: 2000 * 2000
    }
});

module.exports = upload;