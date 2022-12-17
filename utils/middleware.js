const Campground = require('../models/campground')
const Review = require('../models/review');
const Schema = require('../joiSchema/joiReview')
const reviewSchema = require('../joiSchema/joiCampground')
module.exports.isLogin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error','you must need loged in first')
       return  res.redirect('/login')
    }
        next()
}

module.exports.isAuthor = async(req,res,next)=>{
    const{id} = req.params;
    const campID = await Campground.findById(id);
    if(campID && !campID.author.equals(req.user._id)){
      req.flash('error','you dont have permission')
      return res.redirect(`/campgrounds/${campID._id}`)
    }
    next()
}
module.exports.isReviewAuthor = async(req,res,next)=>{
    const{id,reviewId} = req.params
    const review = await Review.findById(reviewId);
    if(review && !review.author.equals(req.user._id)){
      req.flash('error','you dont have permission')
      return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.validate = async(req,res,next)=>{
    const{error} = Schema.validate(req.body);
      if(error){
        const msg = error.details.map(el=>el.message).join(',')
         req.flash('error',msg)
         return res.redirect('/campgrounds/new')
      }
      next() 
}
module.exports.validateCampground = async(req,res,next)=>{
    const{error} = reviewSchema .validate(req.body);
      if(error){
        const msg = error.details.map(el=>el.message).join(',')
         req.flash('error',msg)
         return res.redirect('/campgrounds/new')
      }
      next() 
}