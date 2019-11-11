const express = require('express');
const router = express.Router();
const conn = require("../connection");

router.get('/', function (req, res, next) {
    res.render('regist', {title: 'register form', sessionUser: req.user.user_id});
})

router.post('/', function (req, res, next) {
    const college = req.body.college;
    const major = req.body.major;
    const candidate = req.body.candidate;
    conn.beginTransaction(function (err) {
        if (err) throw err;

        const sql = 'select code from authorization_code where college=? and major =?';
        conn.query(sql, [college, major], function (err, result) {
            if (err) {
                console.error(err);
                conn.rollback(function () {
                    console.error('rollback error');
                    throw err;
                })
            }//if err
            const auth_code = result[0].code;

            let start_time = req.body.start_time;
            const s_front = start_time.substring(0, 10);
            const s_end = start_time.substring(11, 16);
            start_time = `${s_front} ${s_end}`;
            let end_time = req.body.end_time;
            const e_front = end_time.substring(0, 10);
            const e_end = end_time.substring(11, 16);
            end_time = `${e_front} ${e_end}`;
            const vote = {
                'vote_name': req.body.vote_name,
                'vote_starttime': start_time,
                'vote_endtime': end_time,
                'vote_state': "시작전",
                'authorization_code': auth_code
            };
            conn.query('insert into vote set ?', vote, function (err, result) {
                if (err) {
                    console.error(err);
                    console.log(result);
                    connection.rollback(function () {
                        console.error('rollback error');
                        throw err;
                    });
                }//if err

                for (let i = 0; i < candidate.length; i++) {
                    const candi = {
                        vote_code: result.insertId,
                        candidate: candidate[i],
                        poll: 0,
                    };
                    conn.query('insert into vote_detail set ?', candi, function (err, result) {
                        if (err) {
                            console.error(err);
                            conn.rollback(function () {
                                console.error('rollback error');
                                throw err;
                            });
                        }//if err
                    })
                }//for
                conn.commit(function (err) {
                    if (err) {
                        console.error(err);
                        conn.rollback(function () {
                            console.error('rollback error');
                            throw err;
                        });
                    }// if err
                    res.redirect('/list');
                });// commit
            })//insert into vote
        }) //begin transaction
    })
})


module.exports = router;