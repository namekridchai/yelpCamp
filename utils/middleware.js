module.exports.isLogin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error','you must need loged in first')
       return  res.redirect('/login')
    }
        next()
}