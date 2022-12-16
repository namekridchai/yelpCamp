const mongoose = require('mongoose');
const {Schema} = mongoose
const passport = require("passport-local-mongoose")
const userSchema= new mongoose.Schema({
    email:  {
        type:String,
        required:true,
        unique:true,
    }, // String is shorthand for {type: String}
    // username: {
    //     type:String,
    //     required:true,
    // },
})
userSchema.plugin(passport)
module.exports = mongoose.model('User',userSchema)
    
    
 