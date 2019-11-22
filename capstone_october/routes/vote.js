const express = require('express');
const router = express.Router();
const conn = require("../connection");


router.post('/', function (req, res, next) {//투표 결과 처리
    console.log(req.body.selectedCandidate);
    console.log(req.body);

    conn.query("update vote_detail set poll=poll+1 where idx=?", [req.body.selectedCandidate], function (err, results) {
        if (err) console.log(err);

        req.session.save(function () {
            res.redirect('/ongoing');
        })
    })
})

router.get('/', function (req, res, next) {//투표 폼으로
    const voteCode = req.query.voteCode;
    const sql = `
    SELECT idx, candidate, poll, v.authorization_code as auth_code FROM vote_detail vd JOIN vote v ON vd.vote_code = v.vote_code WHERE vd.vote_code = ${voteCode};
    `;
    conn.query(sql, [voteCode], function (err, results) {
        if (err) console.log(err)
        const auth = results[0].auth_code;
        // req.user.user_id
        if (auth === req.user.auth_code) {
            res.render('vote', {title: req.query.voteName, rows: results, sessionUser: req.user.user_id});
        } else {
            res.send('<script type="text/javascript">alert("권한이 없는 투표입니다.");</script>');
            //alert('권한이 없는 투표입니다');
        }


    })
})


module.exports = router;