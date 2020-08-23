'use strict';

var express = require('express');

var cors = require('cors');

var mongoose = require('mongoose');

var compression = require('compression');

var logger = require('morgan');

var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');

var path = require('path');

var debug = require('debug');

var server;
var app = express();
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
app.use(express.json());
app.use(cors());
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express["static"](path.join(__dirname, 'uploads'))); //-------------API Routes--------------

var eventRouter = require('./routes/EventRoute');

app.use('/api/eventdata', eventRouter);

var memberRouter = require('./routes/MemberRoute');

app.use('/api/memberdata', memberRouter);

var noticeRouter = require('./routes/NoticeRouter');

app.use('/api/noticedata', noticeRouter);

var resourceRouter = require('./routes/ResourceRouter');

app.use('/api/resourcedata', resourceRouter);

var galleryRouter = require('./routes/GalleryRoute');

app.use('/api/gallerydata', galleryRouter); //-------------------------------------
//-----------------Upload Routes--------------------

var imageRouter = require('./routes/data/ImageRouter');

app.use('/upload/image', imageRouter);

var pdfRouter = require('./routes/data/PdfRouter');

app.use('/upload/pdf', pdfRouter); //--------------------------------------------------
//-------------ERROR HANDLING------------------
// catch 404 and forward to error handler

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
}); // error handlers
// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
} // production error handler
// no stacktraces leaked to user


app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
}); //------------------------Serving Server------------------------

app.set('port', process.env.PORT || 3000);

exports.listen = function () {
  server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
  });
};

exports.close = function () {
  server.close(function () {
    debug('Server stopped.');
  });
};

(void 0).listen();