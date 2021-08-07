import React from 'react';

export default function Transaction({ transaction }) {

    const { from, 
        to, 
        amount, 
        ts 
    } = transaction;
    
    return (
        <div className="container-md border-1 text-start">
            <p>From: {from}</p>
            <p>To: {to}</p>
            <p>Amount: {amount}</p>
            <p>{ts}</p>
        </div>
    );
}