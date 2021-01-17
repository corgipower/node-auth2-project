const db = require('../database/config');

function find() {
    return db.select('id', 'username').from('user');
}

function findByUsername(username) {
    return db.select('id', 'username', 'password').from('user').where('username', username);
}

function add(user) {
    return db.insert(user).into('user');
}

module.exports = {
    find,
    findByUsername,
    add,
}