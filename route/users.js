const express = require('express');
const User = require('../models/user');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
router.get('/register',(req,res)=>{
        res.render('users/register')
})

router.post('/register',catchAsync(async(req,res,next)=>{
    try{
        const{username,password,email} = req.body
        const user = new User({email,username})
         const register =await User.register(user,password)
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
}))

router.get('/login',(req,res)=>{
    res.render('users/login')
})


router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login',keepSessionInfo: true}),(req,res)=>{
    const redirect = req.session.returnTo||'/campgrounds'
    delete req.session.returnTo
    req.flash('success','welcome back')
    res.redirect(redirect)
})

router.get('/logout',(req,res,next)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success','log you out')
        res.redirect('/campgrounds')
      });
   
    
})
module.exports = router