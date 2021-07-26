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


// contract Donation {

//     // state variables
//     address donator;
//     address payable public receiver;
//     uint public amount; 
    
//     // Declaring events for web3.payable
//     event Donated(address donator, address receiver, uint amount);
    
//     constructor (address payable _receiver ) payable {
//         donator = msg.sender;
//         receiver = _receiver;
//     }
    
    
//     function sendDonation( ) public payable{
//         require(donator.balance >= amount);
//         // Call returns a boolean value indicating success or failure.
//         // This is the current recommended method to use.
//         // returns (bool sent, bytes memory data)
//         (bool success,  ) = receiver.call{value: amount}("");
//         require( success, " Transfer failed");
//         emit Donated(donator, receiver, amount);
        
//     }
    
//     function getAmount() public view returns (uint){
//         return amount;
//     }
    
//     function setAmount( uint _amount) public {
//         amount = _amount;
//     }
    
    
// }



// contract ProjectList {
    
//     // state variables
//     address[] public projects;
    
//     function create_project(){
//     // Create a new address for that project based on current time and adds it to the projects list

//         address addr = address(keccak256(abi.encodePacked(now)));
//         projects.push(addr);
//     }
    
//     function get_projects() public view returns (address){
//     // Returns the array containing all the projects addresses
//         return projects;
//     }
// }

contract Project {
    // Storage state cariables
    address public owner;
    string public description;
    uint public minDonation;
    uint public raisedDonation = 0;
    uint public goal;
    uint public numberOfDonors;
    mapping (address => uint) public donations; // stores the donation of each donor
    uint numRequests;
    mapping (uint => Request) requests;
    
    // For each spending request, need to create a new instance of request
    struct Request {
        string requestDescription;
        uint value;
        address payable recipient; // This is the address that the beneificiary want to send funds to.
        bool completed;
        uint numberOfVoters;
        mapping (address=>bool) voters;
    }
    
    // Modifiers to automatically check a condition, prior to executing a function
    modifier onlyAdmin{
        require(msg.sender == owner);
        _; // This is just syntax, this tells the modifier to continue with the rest of the function after it calls its body
    }
    
    modifier goalReached {
        // Allow owner to create spending requrest only when the goal is reached
        require(raisedDonation >= goal);
        _;
    }
    
    constructor( string memory _description, uint _minDonation, uint _goal) {
        description = _description;
        minDonation = _minDonation;
        goal = _goal;
        owner = msg.sender; // The creator of the project is the owner of the project
        numRequests = 0;
    }
    
    function contribute() public payable{
        // Conditions for executing the rest of the function
        require( msg.value > minDonation);
        // Checking whether this is the first time the person is contributing
        if(donations[msg.sender] == 0){
            // If its his first time, need to invrement the total number of contributors
            numberOfDonors ++;
        }
        // Add the amount sent to his previous contributions
        donations[msg.sender] += msg.value;
        raisedDonation += msg.value;
    }
    
    // Project owner creates a request before he can spend his money
    function create_request( string memory _requestDescription, address payable _recipient, uint _value) public onlyAdmin goalReached{
        // instantiating a request struct in memory
        // Store request struct variable from mapping in storage
        Request storage newRequest = requests[numRequests++];
        newRequest.requestDescription = _requestDescription;
        newRequest.value = _value;
        newRequest.recipient = _recipient;
        newRequest.numberOfVoters = 0;
        newRequest.completed = false;
        
    }
    
    function vote_request(uint index) public goalReached{
        
        // Direct Reference a specific spending request inside the requests dynamic array
        // by calling storage here,, any changes that we make to thisRequest will
        // also affect the request in tthe specific index in requests array
        Request storage thisRequest =  requests[index];
        // Checking for Conditions
        // The voter also needs to be a donor
        require(donations[msg.sender] > 0);
        // The voter cannot double vote
        require(thisRequest.voters[msg.sender] == false);
        // Counting the vote 
        // We only count positive votes
        thisRequest.voters[msg.sender] = true;
        thisRequest.numberOfVoters++;
    }
    
    
    function make_payment( uint index) public onlyAdmin goalReached{
        // Directly reference the specfic spending request inside the request dynamic array
        Request storage thisRequest = requests[index];
        
        // Check necessary Conditions 
        // Cannot allow double payment for the same request
        require(thisRequest.completed == false);
        // Number of voters that approved should be more thatn 50% voters
        require(thisRequest.numberOfVoters > numberOfDonors /2);
        
        // Performing the transder operation
        thisRequest.recipient.transfer(thisRequest.value);
        thisRequest.completed = true;
    
        
    }
    
}