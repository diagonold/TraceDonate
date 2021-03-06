// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;

contract Project{
    // Storage state cariables
    address public owner;
    string public description;
    string public name;
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
        uint yesVotes;
        mapping (address=>bool) voters;
    }
    
    // Events needed by the web app
    event Contribute( address donor, uint amount);
    event CreateRequest( address owner, address recipient, string requestDescription, uint value );
    event PaymentMade( address owner, address recipient, uint value );
    event DonorVote( address donor);
    
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
    
    constructor( string memory _name, string memory _description, uint _minDonation, uint _goal, address _owner) public {
        name = _name;
        description = _description;
        minDonation = _minDonation;
        goal = _goal;
        owner = _owner; // The creator of the project is the owner of the project
        numRequests = 0;
    }
    
    function contribute() public payable{
        // A payable function will store the value that is sent to that account
        // and will be trapped there unless there is a withdraw function
        // Conditions for executing the rest of the function
        require( msg.value >= minDonation);
        // Checking whether this is the first time the person is contributing
        if(donations[msg.sender] == 0){
            // If its his first time, need to invrement the total number of contributors
            numberOfDonors ++;
        }
        // Add the amount sent to his previous contributions
        donations[msg.sender] += msg.value;
        raisedDonation += msg.value;
        emit Contribute( msg.sender, msg.value);
    }
    
    // Project owner creates a request before he can spend his money
    function create_request( string memory _requestDescription, address payable _recipient, uint _value) public onlyAdmin {
        // Check request is legit
        require( _value <= raisedDonation);

        // Freeze requested money
        raisedDonation -= _value;

        // instantiating a request struct in memory
        // Store request struct variable from mapping in storage
        Request storage newRequest = requests[numRequests++];
        newRequest.requestDescription = _requestDescription;
        newRequest.value = _value;
        newRequest.recipient = _recipient;
        newRequest.yesVotes = 0;
        newRequest.completed = false;

        emit CreateRequest( msg.sender, _recipient, _requestDescription, _value);
    }
    
    function vote_request(uint index) public {
        
        // Direct Reference a specific spending request inside the requests dynamic array
        // by calling storage here,, any changes that we make to thisRequest will
        // also affect the request in the specific index in requests array
        Request storage thisRequest =  requests[index];
        // Checking for Conditions
        // The voter also needs to be a donor
        require(donations[msg.sender] > 0);
        // The voter cannot double vote
        require(thisRequest.voters[msg.sender] == false);
        // Counting the vote 
        // We only count positive votes
        thisRequest.voters[msg.sender] = true;
        thisRequest.yesVotes++;
        emit DonorVote(msg.sender);
    }
    
    
    function make_payment( uint index) public onlyAdmin {
        // Directly reference the specfic spending request inside the request dynamic array
        Request storage thisRequest = requests[index];
        
        // Check necessary Conditions 
        // Cannot allow double payment for the same request
        require(thisRequest.completed == false);
        // Number of voters that approved should be more thatn 50% voters
        require(thisRequest.yesVotes > numberOfDonors /2);
        
        // Performing the transder operation
        thisRequest.recipient.transfer(thisRequest.value);
        thisRequest.completed = true;
        emit PaymentMade( msg.sender, thisRequest.recipient, thisRequest.value );
    }

    function get_summary() public view returns ( 
    address _owner, 
    string memory _name,
    string memory _description,
    uint _minDonation,
    uint _raisedDonation,
    uint _goal,
    uint _numberOfDonors,
    uint _numRequests ){
        _name = name;
        _owner = owner;
        _description = description;
        _minDonation = minDonation;
        _raisedDonation = raisedDonation;
        _goal = goal;
        _numberOfDonors = numberOfDonors;
        _numRequests = numRequests;
    }

    // Need to offload the calling of each request to backend
    // input: index. Range is from 0 to (numRequests - 1)
    function get_request_details(uint index) public view returns (
    string memory _requestDescription,
    uint _value,
    address _recipient,
    bool _completed,
    uint _yesVotes){
        _requestDescription = requests[index].requestDescription;
        _value = requests[index].value;
        _recipient = requests[index].recipient;
        _completed = requests[index].completed;
        _yesVotes = requests[index].yesVotes;
    }
   
}


contract ProjectHub {
// Similar to a factory pattern
    
    // state variables
    Project[] public projects;
    
    event ProjectCreated(address projectAddress, string name, string description, uint minDonation, uint goal);
    
    function create_project(string memory _name, string memory _description, uint _minDonation, uint _goal ) public payable {
    // Create a new project, need to provide all the necessary attributes for that project
        Project project = new Project(_name, _description, _minDonation, _goal, msg.sender);
        projects.push(project);
        emit ProjectCreated( address(project), _name, _description, _minDonation, _goal);
    }
    
    function get_projects() public view returns (Project[] memory){
        // Returns the list of all the projects addresses
        return projects;
    }
    
}