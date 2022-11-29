const mongoose = require('mongoose');
const Schema= new mongoose.Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
  });

  const Campground = mongoose.model('Campground', Schema);

  module.exports = Campground;