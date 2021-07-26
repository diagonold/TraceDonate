// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;




/**
Here are things missing in the contract
1. The contract should be able to track all the organization's address
2. The contract should be able to track all the organization's total collected donation
3. Should the donation be time base so that there is a limited amount of time a user can donate?

Should an organization have its own contract 
1. This will be for their sepnding
2. This contract will keep track of 


Should merchants have their own contracts
1. This is so that they can be categorized
2. This limits the addresses that they can spend on....
3. 


Currently buggy when tested with remix, Enquire professor or alex on this!!!
 */


contract Donation {

    // state variables
    address donator;
    address payable public receiver;
    uint public amount; 
    
    // Declaring events for web3.payable
    event Donated(address donator, address receiver, uint amount);
    
    constructor (address payable _receiver ) payable {
        donator = msg.sender;
        receiver = _receiver;
    }
    
    
    function sendDonation( ) public payable{
        require(donator.balance >= amount);
        // Call returns a boolean value indicating success or failure.
        // This is the current recommended method to use.
        // returns (bool sent, bytes memory data)
        (bool success,  ) = receiver.call{value: amount}("");
        require( success, " Transfer failed");
        emit Donated(donator, receiver, amount);
        
    }
    
    function getAmount() public view returns (uint){
        return amount;
    }
    
    function setAmount( uint _amount) public {
        amount = _amount;
    }
    
    
}