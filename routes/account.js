const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Post = require('../models/post');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db')
const bodyParser = require('body-parser')

// create application/json parser
const jsonParser = bodyParser.json()

router.post('/reg', jsonParser, (req, res) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        login: req.body.login,
        password: req.body.password
    })
    // console.log(newUser);
    User.addUser(newUser, function (err, user) {
        console.log(user, 'user');
        if (err) {
            res.json({success: false, msg: 'User has not been added.'})
        } else {
            res.json({success: true, msg: 'User has been added.'})
        }
    })
})

router.post('/auth', jsonParser, (req, res) => {
    const login = req.body.login;
    const password = req.body.password;

    User.getUserByLogin(login, (err, user) => {
        console.log(err);
        console.log(user);

        if (err) throw err;
        if (!user) {
            return res.json({success: false, msg: "This user was not found."})
        } else {

        }

        User.comparePass(password, user.password, (err, isMatch) => {
            console.log(err);
            console.log(isMatch, 'isMatch');

            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 3600 * 24
                });

                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        login: user.login,
                        email: user.email
                    }
                })
            } else {
                return res.json({success: false, msg: "Password mismatch."})
            }
        });
    });
})

router.post('/dashbord', passport.authenticate('jwt', { session: false }), (req, res) => {
    let newPost = new Post({
        category: req.body.category,
        title: req.body.title,
        photo: req.body.photo,
        text: req.body.text,
        author: req.body.author,
        date: req.body.date,
    });

    Post.addPost(newPost, (err) => {
        if (err) {
            let errors = [];
            Object.keys(err.errors).forEach(key => {
                errors.push(err.errors[key])
            })
            res.json({success: false, msg: errors});
        } else {
            res.json({success: true, msg: "Post has been added."});
        }
    });
})

module.exports = router;
