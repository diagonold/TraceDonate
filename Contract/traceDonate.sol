// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

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