const Campground = require('../models/campground')
const{cloudinary} = require('../cloudinary')
const token = process.env.token;
const Geocoding  = require('@mapbox/mapbox-sdk/services/geocoding')
const geocoder = Geocoding({accessToken:token})
module.exports.index = async (req,res) =>{
    const camp = await Campground.find({});
    const rawData = {features:camp}
    console.log(camp);
     res.render('campgrounds/index',{camp,rawData});
  }
module.exports.newForm = (req,res) =>{
    res.render('campgrounds/new');
 }
module.exports.showCampground = async (req,res) =>{
    const camp = await Campground.findById(req.params.id).populate({path:'Reviews',populate:{path:'author'}})
                                                          .populate('author');
    if(!camp){
      req.flash('fail','get data fail')
      res.redirect('/campgrounds')
    }
     res.render('campgrounds/show',{camp});
  }
module.exports.createCampground = async (req,res,next) =>{
    const newCampground = new Campground(req.body.campground);
    const geoData = await geocoder.forwardGeocode({
      query:req.body.campground.location,
      limit:1
    }).send()
    console.log(geoData.body.features[0].geometry.coordinates)
    newCampground.geometry = geoData.body.features[0].geometry
    newCampground.image = req.files.map(f=>({
        url:f.path,
        filename:f.filename
    }))
     newCampground.author = req.user._id 
     await newCampground.save();
      req.flash('success','post data success')
       res.redirect(`/campgrounds/${newCampground._id}`); 
  }
module.exports.renderEditForm = async (req,res) =>{
    const camp = await Campground.findById(req.params.id);
    if(!camp){
      req.flash('fail','post is not exist')
      res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{camp});
  }
module.exports.update = async (req,res) =>{
    const{id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id,req.body.campground);
    const image = req.files.map(f=>({
        url:f.path,
        filename:f.filename
    }))
    camp.image.push(...image)
    console.log(req.body.deleteImg)
    if(req.body.deleteImg){
      await camp.updateOne({$pull:{image:{filename:{$in:req.body.deleteImg}}}})
      for(let img of req.body.deleteImg){
        await cloudinary.uploader.destroy(img)
      }
    }
    
    await camp.save()
    req.flash('success','update data success')
    res.redirect(`/campgrounds/${camp._id}`);
  }
module.exports.delete = async (req,res) =>{
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');  
}