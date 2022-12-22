const mongoose = require('mongoose');
const Campground = require('../models/campground')
main().then(err => console.log('whooo'));
const cities = require('./cities');
const {descriptors,places} = require('./seedHelpers');
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp');
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}


const givenArr = arr=> arr[Math.floor(Math.random()*arr.length)];

const createSeed = async()=>{
    await Campground.deleteMany({});
    for(let i = 0;i<50;i++){
        const price = Math.floor(Math.random()*30);
        const rand =  Math.floor( Math.random()*1000) ;
        const test = new Campground({location:`${cities[rand].city},${cities[rand].state}`,
                                title:`${givenArr(descriptors)}, ${givenArr(places)}`,
                                price:price,
                                author:"639c568c1d904d57a594f5e2",
                                image: [
                                    {
                                      url: 'https://res.cloudinary.com/dyjryngbn/image/upload/v1671531647/samples/landscapes/beach-boat.jpg',
                                      filename: 'Yelpcamp/jjqdmmhk6eretgr97ikv',
                                   
                                    },
                                    {
                                      url: 'https://res.cloudinary.com/dyjryngbn/image/upload/v1671717623/Yelpcamp/sfevccssc3kkzrrkiwuo.jpg',
                                      filename: 'Yelpcamp/sfevccssc3kkzrrkiwuo',
                                      
                                    }
                                  ],
                                description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam aut at reiciendis numquam veniam praesentium, impedit, sunt consequatur laudantium, beatae quo iusto molestiae aliquid voluptatum labore maxime! Cupiditate, dolorem a."
                               });
        await test.save();
    }
    
}



createSeed().then(()=>{
    mongoose.connection.close();
})

// Checklist.insertMany(cArr).then(c=>{console.log(c)});