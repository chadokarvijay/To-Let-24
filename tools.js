exports.checkFileType = function (file, cb, path) {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }

async function checkAuthenticated(req,res,next){

    if(req.isAuthenticated()){
        const auth1=(req.params.username===undefined || req.params.username==(await req.user).username);
        const auth2=(req.query.username===undefined  || req.query.username==(await req.user).username);
        if(!auth1 || !auth2){
            res.send('Access Denied'); //trying to enter into other user's profile
            return false;
        }
        return next();
    }

    res.redirect('/login');
}
module.exports.checkAuthenticated=checkAuthenticated;


async function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return res.redirect('/search');
    }

    next();
}
module.exports.checkNotAuthenticated=checkNotAuthenticated;

function logout(req, res) {
    req.logout();
    res.redirect('/login');
};
module.exports.logout=logout;
