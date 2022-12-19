const { urlencoded } = require('express');
const express = require('express');
const catchAsync = require('../utils/catchAsync')
const {isLogin,isAuthor,validateCampground}= require('../utils/middleware')
const app = express();
const campground = require('../controller/campground')
const router = express.Router({mergeParams:true});

router.route('/')
      .get(campground.index)
      .post( isLogin,isAuthor,validateCampground,catchAsync( campground.createCampground))
  
router.get('/new',isLogin,isAuthor,campground.newForm);
router.route('/:id')
       .get(catchAsync(campground.showCampground))
       .put(isLogin,isAuthor,catchAsync(campground.update))
       .delete(isLogin,isAuthor,catchAsync(campground.delete))
  
router.get('/:id/edit',isLogin,isAuthor,catchAsync(campground.renderEditForm));
  

  
  

  module.exports = router