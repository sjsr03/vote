const express = require('express');
const router = express.Router();
const conn = require("../connection");
const Web3 = require('web3');
if (typeof web3 !== 'undefined') { 
        web3 = new Web3(web3.currentProvider); } 
else { 
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
}
const abi_str = [{"constant": true,"inputs": [{"internalType": "uint256","name": "","type": "uint256"}],"name": "voteList","outputs": [{"internalType": "uint256","name": "candidateCount","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"internalType": "uint256","name": "","type": "uint256"},{"internalType": "address","name": "","type": "address"}],"name": "voters","outputs": [{"internalType": "bool","name": "","type": "bool"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"internalType": "uint256","name": "_voteCode","type": "uint256"},{"internalType": "string","name": "_name","type": "string"}],"name": "addCandidates","outputs": [{"internalType": "bool","name": "","type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"internalType": "uint256","name": "_voteCode","type": "uint256"},{"internalType": "uint256","name": "_candidateId","type": "uint256"}],"name": "vote","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"}];

const EA = "0x1899151e9Ea81b82F499D772aE3Ed5D372f03d7A";
const contract = new web3.eth.Contract(abi_str,EA);

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
            const auth_code = result[0].code; //권한코드

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
                web3.eth.getAccounts(function(e,accounts){
                    if(e){
                        console.log("계정가져오기에러: " +e);
                    }
                    let account = accounts[0];
                    
                
                    
                //})
                console.log(account);

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
            })
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