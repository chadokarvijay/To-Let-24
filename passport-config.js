const LocalStrategy=require('passport-local').Strategy;
const bcrypt=require('bcrypt');

function initialize(passport,getUserByUsername,getUserById){
    const authenticateUser= async(username,password,done)=>{
        const user=await getUserByUsername(username);
        if(user==null){
            return done(null,false,{message:'No user with that username'});
        }

        const match= await bcrypt.compare(password,user.password);

        if(match){
            return done(null,user);
        }else{
            return  done(null,false,{message:"Password Incorrect"});
        }
    }
    passport.use(new LocalStrategy({usernameField:'username'},authenticateUser));
    passport.serializeUser((user,done)=> done(null,user._id));
    passport.deserializeUser((_id,done)=>{
        return done(null,getUserById(_id));
    });
}

module.exports=initialize;
