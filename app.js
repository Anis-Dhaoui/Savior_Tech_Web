var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fileUpload = require('express-fileupload');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
require("dotenv").config();


var eventRouter = require('./routes/eventsRouter');
var userRouter = require('./routes/usersRouter');
var roleRouter = require('./routes/roleRouter');

var publicationsRouter = require('./routes/publications');
var CommentairesRouter = require('./routes/commentaires');
var ReactionsRouter = require('./routes/reactions');
var SignalerRouter = require('./routes/Signaler');

var QuestionsRouter = require('./routes/Question');
var ReponsesRouter = require('./routes/Reponses');
var AimesRouter = require('./routes/Aimes');

var app = express();

const db = require('./models');
db.sequelize.sync().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use('/events', eventRouter);

app.use('/users', userRouter);
app.use('/roles', roleRouter);

app.use('/publications', publicationsRouter);
app.use('/commentaires', CommentairesRouter);
app.use('/reactions', ReactionsRouter);
app.use('/signaler',SignalerRouter);


app.use('/questions', QuestionsRouter);
app.use('/reponses', ReponsesRouter);
app.use('/aimes', AimesRouter);

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