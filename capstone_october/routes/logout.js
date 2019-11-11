var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password: '32167352',
    database : 'voting',
    dateStrings: 'date'
  })
  
  conn.connect();

router.get('/',function(req,res){
    req.logout();
    req.session.save(function(){
        res.redirect('/login');
    })
})

  module.exports = router;