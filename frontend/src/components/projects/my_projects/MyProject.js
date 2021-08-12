import React from 'react';
import { useDispatch } from 'react-redux';
import { setProjectModalOpened } from '../../../redux/reducers/projectModalReducer';

export default function MyProject({ project }) {

    const {
        owner,
        description,
        minDonation,
        raisedDonation,
        goal,
        participated,
        project_name,
        project_addy,
        numberOfDonors,
        donations,
        requests
     } = project;

     const dispatch = useDispatch();

    return (
        <div 
            className="container-md bg-secondary my-3 p-4 border border-4 text-light text-start project-card-text" 
        >
            <div 
            style={{ cursor: "pointer" }}
            onClick={() => dispatch(setProjectModalOpened({
                "donations": donations,
                "requests": requests,
                "project_address": project_addy,
                "owner": owner,
                "raisedDonation": raisedDonation,
                "participated": participated
            }))}>
            <p>Project Name: {project_name}</p>
            <p>Project Address: {project_addy}</p>

            <hr/>
            <p>Project Description: {description}</p>
            <p>Target Donation: {goal} ETH</p>
            <p>Raised Donation: {raisedDonation} ETH</p>
            <p>Min Donation: {minDonation} ETH</p>
            <p>{numberOfDonors} Donor(s)</p>
            </div>
        </div>
    );
}