pragma solidity >=0.4.21 <0.7.0;
contract Election{
    //Model a Candidate
    struct Candidate{
        uint id;
        string name;
        uint voteCount;
    }
    //Store Candidate
    //Fetch Candidate
    mapping(uint => Candidate) public candidates;
    //Record Voting
    mapping(address => bool) public voters;
    //Store Candidate Count
    uint public candidatesCount;

    constructor() public{
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function addCandidate(string memory _name) private{
        candidatesCount  ++;
        candidates[candidatesCount] = Candidate(candidatesCount,_name,0);
    }

    function vote(uint _candidateId) public{
        voters[msg.sender] = true; //Record if an account has voted
        candidates[_candidateId].voteCount ++; //Increase vote Count of Candidate
    }

}