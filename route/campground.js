const { urlencoded } = require('express');
const express = require('express');
const Campground = require('../models/campground')
const AppError = require('../utils/expressError')
const catchAsync = require('../utils/catchAsync')
const {isLogin}= require('../utils/middleware')
const app = express();
const Joi = require('Joi');
const router = express.Router({mergeParams:true});


router.get('/',async (req,res) =>{
    const camp = await Campground.find({});
     res.render('campgrounds/index',{camp});
  });
  
  router.get('/new',isLogin,(req,res) =>{
     res.render('campgrounds/new');
  });
  
  router.get('/:id',catchAsync(async (req,res) =>{
    const camp = await Campground.findById(req.params.id).populate('Reviews');
    if(!camp){
      req.flash('fail','get data fail')
      res.redirect('/campgrounds')
    }
     res.render('campgrounds/show',{camp});
  }));
  
  router.post('/', isLogin,catchAsync( async (req,res,next) =>{
   
    const Schema = Joi.object(
                  {campground:Joi.object(
                    {
                      title:Joi.string().required(),
                      price:Joi.number().required().min(0),
                      image:Joi.string().required(),
                      location:Joi.string().required(),
                      description:Joi.string().required(),
                    }
                  ).required()
                  })
      const{error} = Schema.validate(req.body);
      if(error){
        const msg = error.details.map(el=>el.message).join(',')
         throw new AppError(msg,400)
      }  
    const newCampground = new Campground(req.body.campground);
      await newCampground.save();
      req.flash('success','post data success')
       res.redirect(`/campgrounds/${newCampground._id}`); 
  }));
  
  router.get('/:id/edit',catchAsync(async (req,res) =>{
    const camp = await Campground.findById(req.params.id);
    if(!camp){
      req.flash('fail','post is not exist')
      res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{camp});
  }));
  
  
   
   router.put('/:id',isLogin,catchAsync(async (req,res) =>{
    const{id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id,req.body.campground);
    req.flash('success','update data success')
    res.redirect(`/campgrounds/${camp._id}`);
  
  }));
  
  router.delete('/:id',isLogin,catchAsync(async (req,res) =>{
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');  
  }))

  module.exports = router