const mongoose = require('mongoose');
const Schema= new mongoose.Schema({
    body: String,
    rating: Number,
 
  });

  const Review = mongoose.model('Review', Schema);

  module.exports = Review;