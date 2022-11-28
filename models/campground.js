const mongoose = require('mongoose');
const Schema= new mongoose.Schema({
    title:  {
        type:String,
    }, // String is shorthand for {type: String}
    price: {
        type:Number,
    },
    description:{
        type:String,
    },
    location:{
        type:String,
    },
    image:{
        type:String,
    }
  });

  const Campground = mongoose.model('Campground', Schema);

  module.exports = Campground;