const express = require('express');
const multer = require('multer');
const bodyParser = require("body-parser");
const ejs = require('ejs');
const path = require('path');
const mongoose = require("mongoose");
const tools = require(__dirname + "/tools.js")
const schemas = require(__dirname + "/schemas.js")
var fs = require('fs');
const bcrypt = require('bcrypt')

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
    useUnifiedTopology: true,
    useFindAndModify: false
});

var imgModel = mongoose.model("posts", schemas.imageSchema);
var userModel = mongoose.model('users', schemas.userSchema);

 //HOME ROUTE
app.get('/', (req, res) => {
    res.render("home");
});



//UPLOAD
app.get('/upload', (req, res) => {
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



//SEARCH
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



//SIGNUP
app.get('/signup', (req, res) => {
    res.render('signup');
});

// -------------------- code by Mannan---------------------------------------
app.post('/signup', async (req, res) => {

    let passwordHash = await bcrypt.hash(req.body.password, 10);
    var obj = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        mobileno: req.body.mobileno,
        email: req.body.email,
        password: passwordHash
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



//LOGIN
app.get('/login', (req, res) => {
    res.render('login');
});


app.post('/login', async (req, res) => {

    password = req.body.password
    let user = await userModel.findOne({
        username: req.body.username
    });

    if (user == null) {
        res.render('login', {
            msg: 'NO SUCH USER EXISTS'
        });
        console.log("NO USER EXISTS")
        return;
    }

    let checkPassword = await bcrypt.compare(password, user["password"])

    if (!checkPassword) {
        res.render('login', {
            msg: 'INCORRECT PASSWORD'
        });
        console.log("INCORRECT PASSWORD")
        return;
    } else {
     res.redirect('/');
    }
});
//------------------------------------------------------------------------

//USER ACCOUNT
app.get('/users/:username',(req,res)=>{
    const username=req.params.username;
    userModel.findOne({
        username:username
    }, (err, userInfo) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        } else if(userInfo===null){
            res.send("No such user exist");
        } else {
            imgModel.find({
                username:username
            }, (err, userPosts) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('An error occurred', err);
                } else {
                    res.render('user', {
                        userInfo:userInfo,
                        userPosts:userPosts,
                        msg:req.query.msg
                    });
                }
            });
        }
    });
});


//UPDATE USER ACCOUNT
app.post('/update-user',async(req,res)=>{
    let user=req.body;
    let redirectURL='/';
    
    if(user.password!=user.repassword){
        redirectURL="/users/"+user.username+"?msg=Password do not match";
    }else{
        delete user['repassword'];
        let passwordHash = await bcrypt.hash(user["password"], 10);
        user["password"]=passwordHash;
        await userModel.findOneAndUpdate({username:user.username}, user);
        redirectURL="/users/"+user.username+"?msg=Account updated Successfully";
    }
    res.redirect(redirectURL);
});


//DELETE POST
app.get('/delete-post',async(req,res)=>{

    const postID=req.query.postID;
    const username=req.query.username;
    imgModel.deleteOne({ _id:postID }, (err,post)=>{
        if(err){
            res.redirect("/users/"+username+"?msg=Cannot Delete");
        }
        else{
            res.redirect("/users/"+username+"?msg=Deleted Successfully");
        }
    });
});



const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
