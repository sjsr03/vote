const express = require('express');
const router = express.Router();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const conn = require("../connection");

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log(222);
    if (!req.user) {
            res.render('login', {title: 'login'});
        } else {
            res.redirect('/list');
        }


    }
);


passport.serializeUser(function (user, done) {
    console.log('passport session save: ', user.id);
    console.log(user.auth_code);
    const userInfo = {
        user_id: user.id,
        auth_code: user.authorization_code
    }
    done(null, userInfo);
});//로그인에 성공할시 세션에 user에서 id만 세션에 저장

passport.deserializeUser(function (userInfo, done) {
    console.log("deserializeUser=" + userInfo.auth_code);

    done(null, userInfo);//user.id인 학번
})


passport.use('local-login', new LocalStrategy(
    function (username, password, done) {//로그인 인증처리
        const sql = "SELECT * FROM users WHERE id=?";
        conn.query(sql, [username], function (err, results, fields) {
            if (err) return done(err);
            if (!results[0])
                return done('please check your id');

            const user = results[0];//user.id user.password
            if (password === user.password)
                return done(null, user);
            else
                return done('please check your password');
        })
    })
)

router.post('/login',
    passport.authenticate('local-login',
        {
            successRedirect: '/list',//성공하면 투표목록으로
            failureRedirect: '/login',//실패하면 로그인폼으로
            failureFlash: false
        })
);
module.exports = router;
