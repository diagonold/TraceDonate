import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setProjectModalOpened } from '../../redux/reducers/projectModalReducer';
import { setDonationThankYouModalOpened } from '../../redux/reducers/donationThankYouModalReducer';

import BlockchainServices from '../../services/Blockchain';
import LocalStorageUtil from '../../utils/LocalStorage';

export default function Project({ project }) {

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

     const history = useHistory();

     const [ currentDonationAmount, setCurrentDonationAmount ] = useState(minDonation);
     const [ nonEmptyDonationAmount, setNonEmptyDonationAmount ] = useState(false);

     const donateToProject = async () => {
         const donationAmount = parseInt(document.getElementById(`donationAmount_${owner}`).value);
         if (isNaN(donationAmount) || donationAmount === minDonation) { setNonEmptyDonationAmount(false); return };
         const blockchainServices = new BlockchainServices(LocalStorageUtil.read("token"), history);
         const response = await blockchainServices.donate({
             "project_addy": project_addy,
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
            className="container-md bg-secondary my-3 p-4 border border-4 text-light text-start project-card-text" 
        >
            <div 
            style={{ cursor: "pointer" }}
            onClick={() => dispatch(setProjectModalOpened({
                "donations": donations,
                "requests": requests,
                "project_address": project_addy
            }))}>
            <p>Project Name: {project_name}</p>
            <hr/>
            <p>Project Description: {description}</p>
            <p>Target Donation: {goal} ETH</p>
            <p>Raised Donation: {raisedDonation} ETH</p>
            <p>Min Donation: {minDonation} ETH</p>
            <p>{numberOfDonors} Donor(s)</p>
            </div>
            { owner !== LocalStorageUtil.read("TraceDonateWallet") && (
            <div className="container-sm d-flex justify-content-end">
                <input type="number" id={`donationAmount_${owner}`} value={currentDonationAmount} onChange={(e) => {
                    setCurrentDonationAmount(parseInt(e.target.value) || minDonation);
                    if (currentDonationAmount > minDonation) {
                        setNonEmptyDonationAmount(true);
                    } else {
                        setNonEmptyDonationAmount(false);
                    }
                }}/>
                &nbsp;
                &nbsp;
                { nonEmptyDonationAmount ? 
                <button type="button" className="btn btn-primary" onClick={donateToProject}>Donate</button>
                :
                <button type="button" className="btn btn-outline-light" disabled>Donate</button>
                }
            </div>
            )}
        </div>
    );
}