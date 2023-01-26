function isLoggedIn(req,res,next) {

    if(req.session.adminsession){
        next();
    }else{
        res.redirect('/admin')
    }
}
module.exports=isLoggedIn  