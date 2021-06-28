const express = require('express');
const multer = require('multer');
const bodyParser = require("body-parser");
const ejs = require('ejs');
const path = require('path');
const mongoose = require("mongoose");
const tools = require(__dirname + "/tools.js")
const schemas = require(__dirname + "/schemas.js")
var fs = require('fs');

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter: function(req, file, cb) {
        tools.checkFileType(file, cb, path);
    }
}).array('myImage', 4);


const app = express();

app.set('view engine', 'ejs');

app.use(express.static('./public'));

app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/tolet24DB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var imgModel = mongoose.model("posts", schemas.imageSchema);
var userModel = mongoose.model('users', schemas.userSchema);


app.get('/', (req, res) => {
    res.render('index');
});

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            });
        } else if (req.files == undefined) {
            res.render('index', {
                msg: 'Error: No File Selected!'
            });
        } else {
            const imgs = [];
            const files = req.files;

            files.forEach((file) => {
                const img = {
                    data: fs.readFileSync(path.join(__dirname + '/public/uploads/' + file.filename)),
                    contentType: 'image/png'
                }
                imgs.push(img);

                fs.unlink("./public/uploads/" + file.filename, (err) => {
                    if (err) {
                        console.log("failed to delete local image:" + err);
                    }
                })
            });

            var obj = {
                username: req.body.username,
                city: req.body.city,
                description: req.body.description,
                imgs: imgs
            }
            imgModel.create(obj, (err, item) => {
                if (err) {
                    console.log(err);
                } else {
                    item.save();
                }
            });

            res.render('index', {
                msg: 'Successfully uploaded!'
            });
        }
    });
});




app.get('/search', (req, res) => {
    res.render('search', {
        items: []
    });
});

app.post('/search', (req, res) => {
    imgModel.find({
        city: req.body.city
    }, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        } else {
            res.render('search', {
                items: items
            });
        }
    });
});



app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', (req, res) => {
    var obj = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        mobileno: req.body.mobileno,
        email: req.body.email,
        password: req.body.password
    }
    userModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        } else {
            item.save();
        }
    });
    res.redirect('/');
});


const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
