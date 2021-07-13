if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}
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
const passport=require('passport');
const initializePassport=require('./passport-config');
const flash=require('express-flash');
const session=require('express-session');

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



mongoose.connect("mongodb://localhost:27017/tolet24DB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

var imgModel = mongoose.model("posts", schemas.imageSchema);
var userModel = mongoose.model('users', schemas.userSchema);


const getUserByUsername= async(username)=>{
    return await userModel.findOne({ username: username }).exec();
};
const getUserById= async(_id)=>{
    return await userModel.findOne({ _id:_id }).exec();
};
initializePassport(passport,getUserByUsername,getUserById);

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('./public'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(flash());

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());

app.use(passport.session());






 //HOME ROUTE
app.get('/', (req, res) => {
    res.send("Home Route");
});



//UPLOAD
app.get('/upload',tools.checkAuthenticated, (req, res) => {
    res.render('index');
});

app.post('/upload',tools.checkAuthenticated,(req, res) => {
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
app.get('/search',tools.checkAuthenticated, (req, res) => {
    res.render('search', {
        items: []
    });
});

app.post('/search',tools.checkAuthenticated, (req, res) => {
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
app.get('/signup',tools.checkNotAuthenticated, (req, res) => {
    res.render('signup');
});

// -------------------- code by Mannan---------------------------------------
app.post('/signup',tools.checkNotAuthenticated, async (req, res) => {

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
app.get('/login',tools.checkNotAuthenticated,(req,res)=>{
    res.render('login.ejs');
});

app.post('/login',tools.checkNotAuthenticated, passport.authenticate('local',{
    successRedirect:'/search',
    failureRedirect:'/login',
    failureFlash:true
}));


//LOGOUT
app.get('/logout',(req,res)=>{
    tools.logout(req,res);
});


//------------------------------------------------------------------------

//USER ACCOUNT
app.get('/users/:username',tools.checkAuthenticated,(req,res)=>{
    const username=req.params.username;     //at now any authenticated user can access other
    userModel.findOne({                     //user's profile
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
app.post('/update-user',tools.checkAuthenticated,async(req,res)=>{
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
app.get('/delete-post',tools.checkAuthenticated,async(req,res)=>{

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



const port = process.env.PORT||3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
