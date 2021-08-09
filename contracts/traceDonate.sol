// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;

contract Project{
    // Storage state cariables
    address public owner;
    string public description;
    uint public minDonation;
    uint public raisedDonation = 0;
    uint public goal;
    uint public numberOfDonors;
    mapping (address => uint) public donations; // stores the donation of each donor
    uint numRequests;
    Request[] public requests;
    
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
    
    constructor( string memory _description, uint _minDonation, uint _goal) public {
        description = _description;
        minDonation = _minDonation;
        goal = _goal;
        owner = msg.sender; // The creator of the project is the owner of the project
        numRequests = 0;
    }
    
    function contribute() public payable{
        // A payable function will store the value that is sent to that account
        // and will be trapped there unless there is a withdraw function
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
        emit Contribute( msg.sender, msg.value);
    }
    
    // Project owner creates a request before he can spend his money
    function create_request( string memory _requestDescription, address payable _recipient, uint _value) public onlyAdmin goalReached{
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
        thisRequest.yesVotes++;
        emit DonorVote(msg.sender);
    }
    
    
    function make_payment( uint index) public onlyAdmin goalReached{
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
    string memory _description,
    uint _minDonation,
    uint _raisedDonation,
    uint _goal,
    uint _numberOfDonors,
    uint _numRequests ){
        _owner = owner;
        _description = description;
        _minDonation = minDonation;
        _raisedDonation = raisedDonation;
        _goal = goal;
        _numberOfDonors = numberOfDonors;
        _numRequests = numRequests;
    }
}


contract ProjectHub {
// Similar to a factory pattern
    
    // state variables
    Project[] public projects;
    
    event ProjectCreated(address projectAddress, string description, uint minDonation, uint goal);
    
    function create_project(string memory _description, uint _minDonation, uint _goal ) public payable returns (address _projectAddress) {
    // Create a new project, need to provide all the necessary attributes for that project
        Project project = new Project(_description, _minDonation, _goal);
        projects.push(project);
        emit ProjectCreated( address(project), _description, _minDonation, _goal);
        _projectAddress = address(project);
    }
    
    function get_projects() public view returns (Project[] memory){
        // Returns the list of all the projects addresses
        return projects;
    }
    
}