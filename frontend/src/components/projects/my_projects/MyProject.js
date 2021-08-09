import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setProjectModalOpened } from '../../../redux/reducers/projectModalReducer';
import { setDonationThankYouModalOpened } from '../../../redux/reducers/donationThankYouModalReducer';

import BlockchainServices from '../../../services/Blockchain';
import LocalStorageUtil from '../../../utils/LocalStorage';

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

     const history = useHistory();

     const donateToProject = async () => {
         const donationAmount = parseInt(document.getElementById("donationAmount").value);
         const blockchainServices = new BlockchainServices(LocalStorageUtil.read("token"), history);
         const response = await blockchainServices.donate({
             "receiver_addy": owner,
             "amount": donationAmount
         });
         if (response.status === 201) {
            dispatch(setDonationThankYouModalOpened({
                "receiver": owner,
                "amount": donationAmount
            }));
         }
     }

    return (
        <div 
            className="container-md bg-white bg-gradient my-3 p-4 border border-4 text-start project-card-text" 
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
            <div className="container-sm d-flex justify-content-end">
                <input type="number" id="donationAmount" />
                &nbsp;
                &nbsp;
                <button type="button" className="btn btn-primary" onClick={donateToProject}>Donate</button>
            </div>
        </div>
    );
}