const Campground = require('../models/campground')
const Review = require('../models/review');
module.exports.createReview = async(req,res) =>{  
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id
    camp.Reviews.push(review)
    await camp.save()
    await review.save()
    req.flash('success','post data success')
    res.redirect(`/campgrounds/${req.params.id}`)
  
  }
module.exports.delete = async (req,res) =>{
    const{id,reviewId} = req.params
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id,{$pull:{Reviews:reviewId}})
    res.redirect(`/campgrounds/${id}`);
     
  }