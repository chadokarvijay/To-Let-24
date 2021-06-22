const express = require('express');
const multer = require('multer');
const bodyParser = require("body-parser");
const ejs = require('ejs');
const path = require('path');
const mongoose = require("mongoose");
var fs = require('fs');

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage');

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Init app
const app = express();

// EJS
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./public'));

app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/tolet24DB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var imageSchema = new mongoose.Schema({
    userid: String,
    city: String,
    img: {
        data: Buffer,
        contentType: String
    }
});
var imgModel = mongoose.model("posts", imageSchema);



app.get('/', (req, res) => {
    imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('index', { items: items });
        }
    });
});

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            });
        } else if (req.file == undefined) {
            res.render('index', {
                msg: 'Error: No File Selected!'
            });
        } else {

            var obj = {
                userid: req.body.userid,
                city:req.body.city,
                img: {
                    data: fs.readFileSync(path.join(__dirname + '/public/uploads/' + req.file.filename)),
                    contentType: 'image/png'
                }
            }
            imgModel.create(obj, (err, item) => {
                if (err) {
                    console.log(err);
                } else {
                    item.save();
                }
            });

            fs.unlink("./public/uploads/" + req.file.filename, (err) => {
                if (err) {
                    console.log("failed to delete local image:" + err);
                } else {
                    console.log('successfully deleted local image');
                }
            });

            res.redirect("/");
        }
    });
});

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
