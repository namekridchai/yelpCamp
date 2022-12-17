const { urlencoded } = require('express');
const express = require('express');

const review = require('../controller/review')
const catchAsync = require('../utils/catchAsync')


const router = express.Router({mergeParams:true});

const {isLogin,isReviewAuthor,validate}= require('../utils/middleware')

router.post('/reviews',isLogin,isReviewAuthor,validate, catchAsync(review.createReview))
  
  router.delete('/reviews/:reviewId',isLogin,isReviewAuthor,review.delete);
  

  module.exports = router