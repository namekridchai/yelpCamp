const { urlencoded } = require('express');
const express = require('express');
const Review = require('../models/review');
const AppError = require('../utils/expressError')
const catchAsync = require('../utils/catchAsync')
const app = express();
const Joi = require('Joi');
const router = express.Router({mergeParams:true});
const Campground = require('../models/campground')

router.post('/reviews', catchAsync(async(req,res) =>{
    const Schema = Joi.object(
      {review:Joi.object(
        {
          body:Joi.string().required(),
          rating:Joi.number().required().min(0).max(5),
        }
      ).required()
      })
  const{error} = Schema.validate(req.body);
  if(error){
  const msg = error.details.map(el=>el.message).join(',')
  throw new AppError(msg,400)
  }  
    
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.Reviews.push(review)
    await camp.save()
    await review.save()
    req.flash('success','post data success')
    res.redirect(`/campgrounds/${req.params.id}`)
  
  }))
  
  router.delete('/reviews/:reviewId',async (req,res) =>{
    const{id,reviewId} = req.params
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id,{$pull:{Reviews:reviewId}})
    res.redirect(`/campgrounds/${id}`);
     
  });
  

  module.exports = router