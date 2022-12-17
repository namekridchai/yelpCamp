const { urlencoded } = require('express');
const express = require('express');
const catchAsync = require('../utils/catchAsync')
const {isLogin,isAuthor,validateCampground}= require('../utils/middleware')
const app = express();
const campground = require('../controller/campground')
const router = express.Router({mergeParams:true});


router.get('/',campground.index);
  
  router.get('/new',isLogin,isAuthor,campground.newForm);
  
  router.get('/:id',catchAsync(campground.showCampground));
  
  router.post('/', isLogin,isAuthor,validateCampground,catchAsync( campground.createCampground));
  
  router.get('/:id/edit',isLogin,isAuthor,catchAsync(campground.renderEditForm));
  
  router.put('/:id',isLogin,isAuthor,catchAsync(campground.update));
  
  router.delete('/:id',isLogin,isAuthor,catchAsync(campground.delete))

  module.exports = router