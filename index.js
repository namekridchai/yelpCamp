const { urlencoded } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const path = require('path');
const Campground = require('./models/campground')
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const morgan = require('morgan');
const myError = require('./err')
const AppError = require('./utils/expressError')
const catchAsync = require('./utils/catchAsync')
const Joi = require('Joi');

app.use(express.json());
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(express.urlencoded({extended:true}));
app.use(morgan('tiny'))

main().then(err => console.log('whooo'));
app.use(methodOverride('_method'));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp');
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}
app.engine('ejs',ejsMate);
app.use((req,res,next)=>{
  console.log(req.method);
  next();

})
app.get('/', (req,res) =>{
  res.render('home');   
 
})

app.get('/campgrounds',async (req,res) =>{
  const camp = await Campground.find({});
   res.render('campgrounds/index',{camp});
});

app.get('/campgrounds/new',(req,res) =>{
   res.render('campgrounds/new');
});

app.get('/campgrounds/:id',async (req,res) =>{
  const camp = await Campground.findById(req.params.id);
   res.render('campgrounds/show',{camp});
});

app.post('/campgrounds', catchAsync( async (req,res,next) =>{
  // if(!req.body.campground){
  //   throw new AppError('Invalid CampGround',404)
  // }
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
     res.redirect(`/campgrounds/${newCampground._id}`); 
}));

app.get('/campgrounds/:id/edit',async (req,res) =>{
  const camp = await Campground.findById(req.params.id);
  res.render('campgrounds/edit',{camp});
});

app.get('/makeCampground',async (req,res) =>{
    const newCampground = new Campground({name:'hotel',price:'hahah'});
    await newCampground.save();
     res.send(newCampground);
 })
 
 app.put('/campgrounds/:id',async (req,res) =>{
  const{id} = req.params;
  const camp = await Campground.findByIdAndUpdate(id,req.body.campground);
  res.redirect(`/campgrounds/${camp._id}`);

});

app.delete('/campgrounds/:id',async (req,res) =>{
  await Campground.findByIdAndDelete(req.params.id);
  res.redirect('/campgrounds');
   
});
app.get('/error', (req,res) =>{
  throw new myError('error',404);
})

app.all('*', (req,res,next) =>{
  next(new AppError('page not found',404));
})

app.use((err,req,res,next)=>{
  if(!err.message)
    err.message = 'default';
  const{status = 500} = err;
  res.status(status).render('err',{err});
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})