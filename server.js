require('dotenv').config();
process.env.NODE_ENV = 'production';
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const compression = require('compression')
const port = 5000 || process.env.PORT;

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to MongoDB!'));

app.use(express.json());
app.use(cors());
app.use(compression());

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

app.listen(port, () => {
    console.log(`Server started on port : ${port}`)
});
