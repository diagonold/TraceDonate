import React from 'react';

export default function Project({ project }) {

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

    return (
        <div className="container-md my-3 p-4 border border-1 text-start">
            <h1>Organization</h1>
            <p>xxx</p>
            <p>xxx</p>
        </div>
    );
}