require('dotenv').config();

const express = require('express');
const multer = require('multer');
const bodyParser = require("body-parser");
const path = require('path');
const mongoose = require("mongoose");
const tools = require(__dirname + "/tools.js")
const schemas = require(__dirname + "/models/models.js")
var fs = require('fs');
const bcrypt = require('bcrypt')
const passport=require('passport');
const initializePassport=require('./passport-config');
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
}).array('myImage', 20);



//mongoose.connect("mongodb+srv://tester_1:3KGV3bWafkqSZbz@cluster0.8hgjf.mongodb.net/tolet24DB", {
mongoose.connect("mongodb://localhost:27017/tolet24DB", {   
useNewUrlParser: true,
    useUnifiedTopology: true,

});

var imgModel = mongoose.model("posts", schemas.postSchema);
var userModel = mongoose.model('users', schemas.userSchema);


const getUserByUsername= async(username)=>{
    return await userModel.findOne({ username: username }).exec();
};
const getUserById= async(_id)=>{
    return await userModel.findOne({ _id:_id }).exec();
};
initializePassport(passport,getUserByUsername,getUserById);

const app = express();

app.use(express.json())


app.use(express.urlencoded({
    extended: true
}));

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());

app.use(passport.session());






 //HOME ROUTE
app.get('/', (req, res) => {
    //res.render("home");
    res.send("home");
});



//UPLOAD
app.get('/upload',tools.checkAuthenticated, async(req, res) => {
    const username=(await req.user).username;
    // res.render('upload',{
    //     username: username
    // });
    res.send("upload");
});

app.post('/upload',tools.checkAuthenticated,async(req, res) => {
    //const username=(await req.user).username;
    console.log(req.body);
    upload(req, res, async(err) => {
        if (err) {
            res.send(err);
        }else if (req.files == undefined) {
            res.send("upload atleast one image");
        }    
        else{
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
                contactNumber: req.body.contactNumber,
                numberOfTotalRooms: req.body.numberOfTotalRooms,
                numberOfBedrooms: req.body.numberOfBedrooms,
                kitchen: req.body.kitchen,
                attachedToiletBathroom: req.body.attachedToiletBathroom,
                floorArea: req.body.floorArea,
                floorNumber: req.body.floorArea,
                water: req.body.water,
                monthlyRent: req.body.monthlyRent,
                electricityChargeIncluded: req.body.electricityChargeIncluded,
                location: req.body.location,
                city: req.body.city,
                pincode:req.body.pincode,
                description: req.body.description,
                imgs: imgs
            }
            imgModel.create(obj, (err, item) => {
                if (err) {
                    console.log(err);
                    res.send("upload err "+err);
                } else {
                    res.send("upload success");
                    item.save();
                }
            });
        }
    });
});



//SEARCH
app.get('/search',tools.checkAuthenticated, async(req, res) => {
    // res.render('search', {
    //     items: []
    // });
    res.send("search");
});

app.post('/search',tools.checkAuthenticated, async(req, res) => {
    // imgModel.find({
    //     city: req.body.city
    // }, (err, items) => {
    //     if (err) {
    //         console.log(err);
    //         res.status(500).send('An error occurred', err);
    //     } else {
    //         // res.render('search', {
    //         //     items: items
    //         // });
    //         res.send();
    //         res.json(CarsList);
    //     }
    // });
    if(!req.body.city)
    {
    try {
        const imgModels = await imgModel.find({city:req.body.city})
        res.json(imgModels);
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
    }
    else
    {
        try {
            const imgModels = await imgModel.find()
            res.json(imgModels);
        }
        catch (err) {
            res.status(500).json({message: err.message});
        }

    }

});



app.get('/signup',tools.checkNotAuthenticated, (req, res) => {
    //res.render('signup');
    res.send("signup");
});

// -------------------- code by Mannan---------------------------------------
app.post('/signup',tools.checkNotAuthenticated, async (req, res) => {
    console.log(req.body);
    let passwordHash = await bcrypt.hash(req.body.password, 10)
   
    var obj = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        mobileno: req.body.mobileno,
        email: req.body.email,
        password: passwordHash,
    }
    userModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
            res.send(err)
            return;
        } else {
            item.save();
        }
    });
    res.send("Creted Succesfully")
});



// LOGIN
// app.get('/login',tools.checkNotAuthenticated,(req,res)=>{
//     //res.render('login.ejs');
// });

// app.post('/login',tools.checkNotAuthenticated, passport.authenticate('local',{
//     successRedirect:'/search',
//     failureRedirect:'/login',
//     failureFlash:true
// }));

// app.get('/login',tools.checkNotAuthenticated,(req,res)=>{
//     res.render('login.ejs');
// });

app.post('/login',tools.checkNotAuthenticated, passport.authenticate('local'),(req, res)=> {
    res.send("First time autentication successful");
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
                    // res.render('user', {
                    //     userInfo:userInfo,
                    //     userPosts:userPosts,
                    //     msg:req.query.msg
                    // });
                    res.send("user info");
                }
            });
        }
    });
});


// //UPDATE USER ACCOUNT
app.post('/update-user',tools.checkAuthenticated,async(req,res)=>{
    let updatedUser=req.body;
    let redirectURL='/';

    let correctPassword=(await req.user).password;
    let checkPassword = await bcrypt.compare(updatedUser["password"],correctPassword);
    if(!checkPassword){
        redirectURL="/users/"+updatedUser.username+"?msg=Wrong Paswword";
    }else{
        const filter={username :updatedUser.username};
        const update={firstname:updatedUser.firstname,
                      lastname :updatedUser.lastname,
                      mobileno :updatedUser.mobileno,
                      email    :updatedUser.email,
        };
        await userModel.findOneAndUpdate(filter,update);
        redirectURL="/users/"+updatedUser.username+"?msg=Account updated Successfully";
    }
    //res.redirect(redirectURL);
    res.send("Account Updated");
});




// //DELETE POST
app.get('/delete-post',tools.checkAuthenticated,async(req,res)=>{

    const postID=req.query.postID;
    const username=req.query.username;
    imgModel.deleteOne({ _id:postID }, (err,post)=>{
        if(err){
            //res.redirect("/users/"+username+"?msg=Cannot Delete");
            res.send("Cannot Delete");
        }
        else{
            //res.redirect("/users/"+username+"?msg=Deleted Successfully");
            res.send("Deleted");
        }
    });
});

app.get('/changePassword',tools.checkAuthenticated,async(req,res)=>{
    //res.render('changePassword');
    res.send("Change Password");
});

app.post('/changePassword',tools.checkAuthenticated,async(req,res)=>{
    const oldPassword=req.body.oldPassword;
    const newPassword=req.body.newPassword;
    const newRePassword=req.body.newRePassword;
    let correctPassword=(await req.user).password;
    let checkPassword = await bcrypt.compare(oldPassword,correctPassword);


    if(newPassword!==newRePassword){
        //res.render('changePassword',{ message:"Password do not match"});
        res.send("Password do not match");
    }
    else if(!checkPassword){
        //res.render('changePassword',{ message:"Wrong Password"});
        res.send("Wrong Password");
    }
    else{
        const filter={username :(await req.user).username};
        const update={password: await bcrypt.hash(newPassword, 10)};
        await userModel.findOneAndUpdate(filter,update);
        const redirectURL="/users/"+(await req.user).username+"?msg=Password Changed Successfully";
        res.redirect(redirectURL);
    }
});

const port = process.env.PORT||5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
