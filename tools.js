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

function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/login');
}
module.exports.checkAuthenticated=checkAuthenticated;


function checkNotAuthenticated(req,res,next){
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
