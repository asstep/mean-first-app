const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/db');

const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserByLogin = function (login, callback) {
    const query = {login: login};
    User.findOne(query, callback)
}

module.exports.getUserById = function (id, callback) {
    console.log(callback);
    User.findById(id, callback);
}

module.exports.addUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        console.log(err);
        console.log(salt, 'salt');

        bcrypt.hash(newUser.password, salt, function (err, hash) {
            console.log(err);
            console.log(hash, 'hash');

            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        })
    })
}

module.exports.comparePass = function (passFromUser, userDbPass, callback) {
    bcrypt.compare(passFromUser, userDbPass, (err, isMatch) => {
        console.log(err);
        console.log(isMatch);

        if (err) throw err;
        callback(null, isMatch);
    })
}
