// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "/home/ryansacatani/Documents/SUTD/Term_8/50.037_BlockchainTechnology/TraceDonate/Contract/Project.sol";


contract ProjectHub {
// Similar to a zombie factory
    
    // state variables
    Project[] public projects;
    
    event ProjectCreated(address projectAddress, string description, uint minDonation, uint goal);
    
    function create_project(string memory _description, uint _minDonation, uint _goal ) public payable {
    // Create a new project, need to provide all the necessary attributes for that project
        Project project = new Project(_description, _minDonation, _goal);
        projects.push(project);
        emit ProjectCreated( address(project), _description, _minDonation, _goal);
    }
    
    function get_projects() public view returns (Project[] memory){
        // Returns the list of all the projects addresses
        return projects;
    }
    
}