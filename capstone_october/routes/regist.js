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


router.get('/',function(req,res,next){
    res.render('regist',{title:'register form',sessionUser:req.user.user_id});
})

router.post('/',function(req,res,next){
    var college = req.body.college;
    var major =req.body.major;
    var candidate= req.body.candidate;
   conn.beginTransaction(function(err){
       if(err) throw err;
     
       var sql= 'select code from authorization_code where college=? and major =?';
       conn.query(sql,[college,major],function(err,result){
           if(err){
               console.error(err);
               conn.rollback(function(){
                   console.error('rollback error');
                   throw err;
               })
           }//if err
           var auth_code = result[0].code;

           var start_time = req.body.start_time;
           var s_front = start_time.substring(0,10);
           var s_end= start_time.substring(11,16);
           start_time = `${s_front} ${s_end}`;
           var end_time= req.body.end_time;
           var e_front = end_time.substring(0,10);
           var e_end= end_time.substring(11,16);
           end_time= `${e_front} ${e_end}`;
           var vote = {
               'vote_name' : req.body.vote_name,
               'vote_starttime': start_time,
               'vote_endtime': end_time,
               'vote_state': "시작전",
               'authorization_code' : auth_code
           }
           conn.query('insert into vote set ?',vote,function(err,result){
               if(err){
                console.error(err);
                console.log(result);
                connection.rollback(function () {
                   console.error('rollback error');
                    throw err;
               });
            }//if err

            for(var i =0; i<candidate.length;i++){
                var candi =  {
                    vote_code: req.body.vote_code,
                    candidate: candidate[i],
                    poll: 0,
                    auth_code: auth_code
                }     
                conn.query('insert into vote_detail set ?',candi,function(err,result){
                    if(err){
                        console.error(err);
                        connection.rollback(function () {
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
        } ) //begin transaction
})
})


module.exports = router;