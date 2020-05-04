var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts){
    var electionInstance;
    it("initializes with two candidates",function(){
        return Election.deployed().then(function(instance){
            return instance.candidatesCount();
        }).then(function(count){
            assert.equal(count,2);
        });
    });

    it("it initializes the candidates with the correct value",function(){
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            return electionInstance.candidates(1);
        }).then(function(candidate){
            assert.equal(candidate[0],1,"contains correct id");
            assert.equal(candidate[1],"Candidate 1","contains correct name");
            assert.equal(candidate[2],0,"contains correct votes");
            return electionInstance.candidates(2);
        }).then(function(candidate){
            assert.equal(candidate[0],2,"contains correct id");
            assert.equal(candidate[1],"Candidate 2","contains correct name");
            assert.equal(candidate[2],0,"contains correct votes");
        });
    });

    it("Allows a voter to cast a vote",function(){
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            candidateId = 1;
            return electionInstance.vote(candidateId,{from:accounts[0]});
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, "an event was triggered");
            assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
            assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");
            return electionInstance.voters(accounts[0]);
        }).then(function(voted){
            assert(voted,"The voter is marked as voted");
            return electionInstance.candidates(candidateId);
        }).then(function(candidate){
            var voteCount = candidate[2];
            assert.equal(voteCount,1,"Increment the candidates vote count");
        });
    });

    it("Throws exception for invalid candidates",function(){
        return Election.deployed().then(function(instance){
            electionInstance=instance;
            return electionInstance.vote(99,{from:accounts[0]})
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert')>=0, "Error message must contain revert");
            return electionInstance.candidates(1);
        }).then(function(candidate1){
            var voteCount = candidate1[2];
            assert.equal(voteCount,1,"Candidate 1 did not get any vote");
            return electionInstance.candidates(2);
        }).then(function(candidate2){
            var voteCount = candidate2[2];
            assert.equal(voteCount,0,"Candidate 2 did not get any vote");
        });
    });

    it("Throws an exception for casting double votes",function(){
        Election.deployed().then(function(instance){
            electionInstance = instance;
            candidateId = 2;
            electionInstance.vote(candidateId,{from:accounts[1]});
            return electionInstance.candidates(candidateId);
        }).then(function(candidate){
            var voteCount = candidate[2];
            assert.equal(voteCount,1,"Accepts first vote");
            return electionInstance.candidates(candidateId);
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert')>=0, "Error message must contain revert");
            return electionInstance.candidates(1);
        }).then(function(candidate1){
            var voteCount = candidate1[2];
            assert.equal(voteCount,1,"Candidate 1 did not get any vote");
            return electionInstance.candidates(2);
        }).then(function(candidate2){
            var voteCount = candidate2[2];
            assert.equal(voteCount,0,"Candidate 2 did not get any vote");
        });
    });
});