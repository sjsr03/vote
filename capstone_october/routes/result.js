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

  router.get('/', function(req,res,next){
    
    var sum=0;
    conn.query("select candidate,poll from vote_detail where vote_code=?",[req.query.voteCode],function(err,results){
        if(err) console.log(err);

        for(var i=0; i<results.length; i++){
            sum = sum + parseInt(results[i].poll);
        }
        res.render('result',{title: req.query.voteName, rows: results, sum:sum, sessionUser:req.user.user_id});

    })


  })


  module.exports =router;