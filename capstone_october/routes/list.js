const express = require('express');
const router = express.Router();
const conn = require("../connection");

require('date-utils');

router.get('/', function (req, res, next) {
    if (!req.user.user_id) {
        res.redirect('/login');
    }
    //console.log('list: '+req.user.user_id);
    //console.log('list: '+req.user.auth_code);
    const dt = new Date();
    const currenttime = dt.toFormat('YYYY-MM-DD HH24:MI:SS');

    let sql = 'select * from vote';

    conn.query(sql, function (err, results) {
        if (err) console.log(err);

        for (let i = 0; i < results.length; i++) {
            if (results[i].vote_state === '시작전') {
                if (Date.compare(currenttime, results[i].vote_starttime) === 1
                    || Date.compare(currenttime, results[i].vote_starttime) === 0) {//시작전->진행중
                    console.log('진행중');
                    results[i].vote_state = '진행중';
                }
            } else if (results[i].vote_state === '진행중') {
                if (Date.compare(currenttime, results[i].vote_endtime) === 1 ||
                    Date.compare(currenttime, results[i].vote_endtime) === 0) {//진행중->마감
                    console.log('마감');
                    results[i].vote_state = '마감';
                }

            }
            sql = "update vote set vote_state=? where vote_code=?";
            conn.query(sql, [results[i].vote_state, results[i].vote_code], function (err, rows, fields) {
                if (err) console.log(err);
            })

        }//for

        conn.query("select * from vote", function (err, results) {
            if (err) console.log(err)
            else {
                req.session.save(function () {
                    res.render('list', {title: '투표 목록', rows: results, sessionUser: req.user.user_id});
                })
                //res.render('list',{title:'투표 목록', rows: results});
            }
        })

    })//query
})//router.get


module.exports = router;