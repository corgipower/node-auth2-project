const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("./users-model");
const { restrict } = require("./users-middleware");

const router = express.Router();

router.get('/api/users', restrict(), async (req, res, next) => {
    try {
        users = await Users.find();
        res.json(users);
    }
    catch (err) {
        next(err);
    }
});

router.post('/api/register', async (req, res, next) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const department = req.body.department;
        const user = await Users.findByUsername(username).first();

        if(user) {
            return res.status(409).json({
                message: 'name unavailable',
            })
        }

        const newUser = await Users.add({
            username,
            password: await bcrypt.hash(password, 14),
            department,
        });

        res.status(201).json(newUser);
    }
    catch (err) {
        next(err);
    }
})

router.post('/api/login', async (req, res, next) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const user = await Users.findByUsername(username).first();
        const validPassword = await bcrypt.compare(password, user.password);
        if(!user || !validPassword) {
            return res.status(401).json({
                message: 'user does not exist',
            })
        }

        const token = jwt.sign({
            userID: user.id,
            userDept: user.department,
        }, process.env.JWT_SECRET);

        res.cookie('token', token);

        res.json({
            message: `Hello ${user.username}`,
        })
    }
    catch (err) {
        next(err);
    }
})

module.exports = router;