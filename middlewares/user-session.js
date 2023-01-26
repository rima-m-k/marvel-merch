function isLoggedIn(req,res,next) {
const User = require("../model/userschema");

    if(req.session.usersession){
        user = User.findById({_id:req.session.usersession})
        if(user.blocked){
            res.redirect('/login')

        }else {

            next();
        }
    }else{
        res.redirect('/login')
    }
}
module.exports=isLoggedIn  