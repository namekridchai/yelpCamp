const User = require('../models/user');

module.exports.renderRegister = (req,res)=>{
    res.render('users/register')
}

module.exports.register = async(req,res,next)=>{
    try{
        const{username,password,email} = req.body;
        const user = new User({email,username});
         const register =await User.register(user,password);
        req.login(register,(err)=>{
            if(!err){
                req.flash('success','register success')
                res.redirect('/campgrounds')
            }
            else
                next(err)
           
        })
         
    }
    catch(e){
        req.flash('fail',e.message)
        res.redirect('/register')
    }  
}


module.exports.renderLogin = (req,res)=>{
    res.render('users/login')
}

module.exports.login  = (req,res)=>{
    const redirect = req.session.returnTo||'/campgrounds'
    delete req.session.returnTo
    req.flash('success','welcome back')
    res.redirect(redirect)
}

module.exports.logout = (req,res,next)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success','log you out')
        res.redirect('/campgrounds')
      });
   
    
}