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
                "project_address": owner
            }))}>
            <p>{owner}</p>
            <hr/>
            <p>{description}</p>
            <p>Target Doantion: {goal}</p>
            <p>{raisedDonation} / {minDonation}</p>
            <p>{numberOfDonors} Donor(s)</p>
            </div>
        </div>
    );
}