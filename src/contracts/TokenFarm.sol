pragma solidity ^0.5.0;
import "./DappToken.sol";
import "./DaiToken.sol";
contract TokenFarm{

    address public owner;
    DappToken public dappToken;
    DaiToken public daiToken;
    string public name = "Dapp Token Farm";
    address[] public stakers;
    mapping(address=> uint ) public stakingBalance;
    mapping(address=> bool) public hasStaked;
    mapping(address=> bool) public isStaking;

    constructor(DappToken _dappToken,DaiToken _daiToken) public  {
        dappToken= _dappToken;
        daiToken= _daiToken;
        owner = msg.sender;
    }

    function stakeTokens(uint _amount) public {
        require(_amount >0, "Amount less than 0");
        daiToken.transferFrom(msg.sender, address(this),_amount);
        stakingBalance[msg.sender]= stakingBalance[msg.sender] + _amount;

        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;

    }
    
    function issueToken() public {
        require(msg.sender == owner , "not owner");
        for (uint i=0; i<stakers.length;i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance>0){
                dappToken.transfer(recipient,balance);
            }
        }       
    }

    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        require(balance>0 , "Balance less than 0");

        daiToken.transfer(msg.sender, balance);       

        stakingBalance[msg.sender] =0;

        isStaking[msg.sender] = false;
    }

}