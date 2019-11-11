const express = require('express');
const router = express.Router();
const conn = require("../connection");

router.get('/', function (req, res, next) {

    let sum = 0;
    conn.query("select candidate,poll from vote_detail where vote_code=?", [req.query.voteCode], function (err, results) {
        if (err) console.log(err);

        for (let i = 0; i < results.length; i++) {
            sum = sum + parseInt(results[i].poll);
        }
        res.render('result', {title: req.query.voteName, rows: results, sum: sum, sessionUser: req.user.user_id});

    })


})


module.exports = router;