'use strict';
require('dotenv').config();
process.env.NODE_ENV = 'production';
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const compression = require('compression');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const debug = require('debug');

var server; 
const app = express();

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to MongoDB!'));

app.use(express.json());
app.use(cors());
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'uploads')));

//-------------API Routes--------------

const eventRouter = require('./routes/EventRoute');
app.use('/api/eventdata', eventRouter);

const memberRouter = require('./routes/MemberRoute');
app.use('/api/memberdata', memberRouter);

const noticeRouter = require('./routes/NoticeRouter');
app.use('/api/noticedata', noticeRouter);

const resourceRouter = require('./routes/ResourceRouter');
app.use('/api/resourcedata', resourceRouter);

const galleryRouter = require('./routes/GalleryRoute');
app.use('/api/gallerydata',galleryRouter);

//-------------------------------------

//-----------------Upload Routes--------------------

const imageRouter = require('./routes/data/ImageRouter');
app.use('/upload/image', imageRouter);

const pdfRouter = require('./routes/data/PdfRouter');
app.use('/upload/pdf', pdfRouter);

//--------------------------------------------------

//-------------ERROR HANDLING------------------

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

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
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//-----------------Serving Server------------------------

app.set('port', process.env.PORT || 3000);

exports.listen = function () {
    server = app.listen(app.get('port'), function () {
        debug('Express server listening on port ' + server.address().port);
    });
}

exports.close = function () {
    server.close(() => {
        debug('Server stopped.');
    });
}

this.listen();
