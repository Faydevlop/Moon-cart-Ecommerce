var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
const session = require('express-session');



var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');

const port = 3001

require('dotenv').config()
var app = express();

app.use(session({
  secret:'zencom',
  resave:false,
  saveUninitialized:false, 
}))

//mongo connection 


// console.log(process.env.MONGODB_URI);

let MONGODB_URI=  
mongoose.connect(process.env.MONGODB_URIs, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection; 

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('MongoDB connection successful!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRouter);
app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
