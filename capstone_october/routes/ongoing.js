const express = require('express');
const router = express.Router();
require('date-utils');
const conn = require("../connection");


router.get('/', function (req, res, next) {
    const dt = new Date();
    const currenttime = dt.toFormat('YYYY-MM-DD HH24:MI:SS');
    let sql = "select * from vote where vote_state= ?";

    conn.query(sql, ["진행중"], function (err, results) {
        for (let i = 0; i < results.length; i++) {
            if (Date.compare(currenttime, results[i].vote_endtime) === 1 ||
                Date.compare(currenttime, results[i].vote_endtime) === 0) {//진행중->마감
                console.log('마감');
                results[i].vote_state = '마감';
            }
            sql = "update vote set vote_state=? where vote_code=?";
            conn.query(sql, [results[i].vote_state, results[i].vote_code], function (err, rows, fields) {
                if (err) console.log(err);
            })
        }//for

        conn.query("select * from vote where vote_state=?", ["진행중"], function (err, results) {
            if (err) console.log(err)
            else {
                req.session.save(function () {
                    res.render('ongoing', {title: '투표 목록', rows: results, sessionUser: req.user.user_id});
                })
            }
        })

    })
})


module.exports = router;