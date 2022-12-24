const cloudinary = require('cloudinary').v2
const{CloudinaryStorage} = require('multer-storage-cloudinary')
cloudinary.config({
    cloud_name:process.env.cloud_name,
    api_key:process.env.cloud_key,
    api_secret:process.env.secret,
})
const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'Yelpcamp',
        allowedFormats:['jpg','png','jpeg']
    }
    
})

module.exports = {cloudinary,storage}
