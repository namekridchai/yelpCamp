if(process.env.NODE_ENV !== "production")
    require('dotenv').config()
console.log(process.env.cloud_name)
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
const session = require('express-session')
const flash  = require('connect-flash')
const user = require('./models/user')
const local = require('passport-local')
const passport = require('passport')
const MongoStore = require('connect-mongo');
const atlas = process.env.atlas||'mongodb://127.0.0.1:27017/yelp'
const url = 'mongodb://127.0.0.1:27017/yelp'
const store = new MongoStore({
  mongoUrl: atlas,
  secret:'secret',
  touchAfter: 24 * 60 * 60
});
store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e)
})
const configSession = {
  store,
  secret:'secret'
  ,resave:false,
  saveUninitialized:true,
  cookie:{
    httpOnly:true,
    expires:Date.now()+1000*60*60*24*7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    message:"time out",
    
  }
}
const mongoSanitize = require('express-mongo-sanitize');
const routeCamp = require('./route/campground')
const routeReview = require('./route/review');
const routeUser = require('./route/users');
const helmet = require("helmet");
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: [],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
              "https://res.cloudinary.com/dyjryngbn/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
              "https://images.unsplash.com/",
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
      },
  })
);

app.use(
  mongoSanitize({
    replaceWith: '_',
  }),
);
app.use(session(configSession))
app.use('/', express.static(__dirname + '/public'));
app.use(express.json());
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));
app.use(express.urlencoded({extended:true}));
app.use(morgan('tiny'))
app.use(methodOverride('_method'));
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new local(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())

app.use((req,res,next)=>{
  //console.log(req.session)
  res.locals.success = req.flash('success')
  res.locals.fail = req.flash('fail')
  res.locals.error = req.flash('error')
  res.locals.user = req.user
  next()
})

app.use('/campgrounds', routeCamp)
app.use('/campgrounds/:id',routeReview)
app.use('/',routeUser)

mongoose.set('strictQuery', false);
main().then(err => console.log('whooo'));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp');
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}
app.engine('ejs',ejsMate);
app.use((req,res,next)=>{
  next();
})

app.get('/fakeuser',async (req,res) =>{
  const User = new user({email:'kkk.1',username:'sup'})
  const realUser = await user.register(User,'chicken')
  res.send(realUser)
})

app.get('/makeCampground',async (req,res) =>{
  const newCampground = new Campground({name:'hotel',price:'hahah'});
  await newCampground.save();
   res.send(newCampground);
})

app.get('/', (req,res) =>{
  res.render('home');   
 
})

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
    console.log(`Example app listening on port git ${port}`);
})