const express = require('express');
const router = express.Router();
const conn = require("../connection");

router.get('/', function (req, res, next) {
    if (!req.user.user_id) {
        res.redirect('/login');
    }
    console.log(req.user);
    let sql = `SELECT u.id, u.college, u.major FROM users u
    WHERE u.id = '${req.user.user_id}'`;
    conn.query(sql, function (err, results) {
        const user = results[0];
        res.render('mypage', {sessionUser: req.user.user_id, user: user});
    })
}) //router.get


module.exports = router;