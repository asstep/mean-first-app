module.exports = {
    db: process.env.MONGOBD_URI ? process.env.MONGOBD_URI : 'mongodb://localhost:27017/wallets',
    secret: 'some_secret_key',
    // user: 'new_user'
}
