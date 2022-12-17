const express = require('express');
const user = require('../controller/user')
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
router.get('/register',user.renderRegister)

router.post('/register',catchAsync(user.register))

router.get('/login',user.renderLogin)


router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login',keepSessionInfo: true}),user.login)

router.get('/logout',user.logout)
module.exports = router