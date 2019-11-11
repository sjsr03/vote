const express = require('express');
const router = express.Router();
const conn = require("../connection");

router.post('/', function (req, res, next) {//투표 결과 처리

    conn.query("DELETE FROM vote WHERE vote_code=?", [req.body.voteCode], function (err, results) {
        if (err) console.log(err);

        req.session.save(function () {
            res.redirect('/list');
        })
    })
})


module.exports = router;