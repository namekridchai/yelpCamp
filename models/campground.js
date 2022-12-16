const mongoose = require('mongoose');
const Review = require('./review')
const {Schema} = mongoose
const camgroundSchema= new mongoose.Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    Reviews:
    [{type:Schema.Types.ObjectId,
            ref:'Review'
    }],
  });
  camgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc.Reviews.length && doc){
       const c = await Review.deleteMany({
            _id:{$in:doc.Reviews}
        })
        console.log(c);
    }    
})
  const Campground = mongoose.model('Campground', camgroundSchema);

  module.exports = Campground;