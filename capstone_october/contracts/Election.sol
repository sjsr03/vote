pragma solidity ^0.5.11;

contract  Election {
    struct Candidate {
        uint idx;
        string name;
        uint voteCount;
    }
    struct CandidateByVote {
        uint candidateCount;
        mapping(uint=> Candidate) candidates;
        }

    mapping(uint=>CandidateByVote) public voteList;
    mapping(uint=> mapping(address=>bool)) public voters;
    
    //mapping(address=> bool) public voters; // 이미 투표한 accounts 구분

    function addCandidates(uint _voteCode, string memory _name) public returns(bool){
        uint count = voteList[_voteCode].candidateCount;
        count++;
        voteList[_voteCode].candidates[count] = Candidate(count, _name, 0);
    }

    function vote(uint _voteCode,uint _candidateId) public {
        require(!voters[_voteCode][msg.sender], "이미 투표한 투표자입니다!");
        
        //require(voters[_voteCode][_candidateId] >0 && _candidateId <= voteList[_voteCode].candidateCount,"등록된 후보자에게 투표해야합니다.");
        voters[_voteCode][msg.sender] = true;
        voteList[_voteCode].candidates[_candidateId].voteCount++;
    }
}