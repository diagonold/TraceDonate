import React from 'react';
import '../../styles/blockchain/transaction.css';

import DateTimeUtil from '../../utils/DateTime';

export default function Transaction({ transaction }) {

    const { from, 
        to, 
        amount, 
        ts 
    } = transaction;

    let {
        year,
        month,
        day,
        hours,
        minutes,
        seconds
    } = new DateTimeUtil(ts).unixTimeStampParser();
    
    return (
        <div className="container-fluid my-3 p-4 border border-4 text-start transaction-card-text">
            <p>To: {to}</p>
            <hr/>
            <p>Amount: {amount}</p>
            <p>{year}-{month}-{day} {hours}:{minutes}:{seconds}</p>
        </div>
    );
}