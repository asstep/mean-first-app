const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');

const config = require('./config/db');
const accout = require('./routes/account');
const Post = require('./models/post');

const app = express();
const port = 3000;

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use(cors())

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    limit: 1000000
}));

// Database connection
mongoose.connect(config.db,  { useNewUrlParser: true, useUnifiedTopology: true }, (res) => {
    console.log('connect', res);
} );
mongoose.connection.on('connected', () => {
    console.log('Successful connection to DB');
})
mongoose.connection.on('error', () => {
    console.log('Error connection to DB');
})

// Server run
let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}
app.listen(_port, () => {
    console.log('Server is running on port: ' + _port)
})

app.get('/', (req, res) => {
    console.log('test');
    Post.find().then( posts => {
        res.json(posts)
    })
})

app.get('/post/:id', (req, res) => {
    let id = req.params.id;
    Post.findById(id).then( post => {
        res.json(post);
    })
})

app.delete('/post/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    let id = req.params.id;
    Post.deleteOne({_id: id}).then( () => {
        res.json({success: true});
    })
})

app.use('/account', accout);
