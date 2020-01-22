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


router.post('/', function (req, res, next) {//투표 결과 처리
    console.log(req.body.selectedCandidate);
    console.log(req.body);
    web3.eth.getAccounts(function(e,accounts){
        if(e){
            console.log("계정가져오기에러: " +e);
        }
        let account = accounts[1];
        console.log(`현 계정 : ${account}`)
        const vote_code=  parseInt(req.body.voteCode);
        console.log(vote_code);
        contract.methods.vote(50, 0).send({from: account},function(e,r){
            if(e){
                console.log(`투표 실패 에러 : ${e}`);
            }else{
                
                console.log(`후보자 ${req.body.selectedCandidate}에 투표했습니다.`);
            }
        });
          
    })

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
        console.log(`투표코드: ${auth}, 유저권한코드: ${req.user.auth_code}`);
        //전체투표 | 단과대투표 | 과별투표 분기
        const authStr =  String(auth);
        const collegeStrCode = authStr.substring(0,2);
        const majorStrCode = authStr.substring(2,4);
        if (auth === 1000){
            res.render('vote', {title: req.query.voteName, rows: results, sessionUser: req.user.user_id, voteCD :voteCode});
        }else if(majorStrCode === "00"){
            const userCollegeCD = String(req.user.auth_code).substring(0,2)
            if(collegeStrCode === userCollegeCD){
                res.render('vote', {title: req.query.voteName, rows: results, sessionUser: req.user.user_id, voteCD :voteCode});
            }else{
                res.send('<script type="text/javascript">alert("권한이 없는 투표입니다.");</script>');
            }
               
        }else{
            if (auth === req.user.auth_code) {
                res.render('vote', {title: req.query.voteName, rows: results, sessionUser: req.user.user_id, voteCD :voteCode});
            }else {
                res.send('<script type="text/javascript">alert("권한이 없는 투표입니다.");</script>');
                //alert('권한이 없는 투표입니다');
            }
        }
    })
})


module.exports = router;