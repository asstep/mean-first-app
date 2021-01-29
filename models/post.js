const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: false
    },
    text: {
        type: String,
        required: false
    },
    author: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
})

const Post = module.exports = mongoose.model('Post', PostSchema);

module.exports.addPost = function (newPost, callback) {
    newPost.save(callback);
}
