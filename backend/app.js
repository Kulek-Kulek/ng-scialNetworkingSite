const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts-routes');

const app = express();

mongoose.connect('mongodb+srv://..........@cluster0.cn8hp.mongodb.net/.........?retryWrites=true&w=majority')
    .then(() => {
        console.log('mongoDB connected');
    })
    .catch((err) => {
        console.log(err);
    });

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
});


app.use('/api/posts', postsRoutes);


module.exports = app;