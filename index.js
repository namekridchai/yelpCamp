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
const configSession = {
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
const routeCamp = require('./route/campground')
const routeReview = require('./route/review');
const routeUser = require('./route/users');

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