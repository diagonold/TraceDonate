import React, { useState } from 'react';
import Pagination from 'react-js-pagination';
import Transaction from './Transaction';

export default function Index() {

    const [activePage, setActivePage] = useState(1);
    const [itemPerPage, setItemPerPage] = useState(3);

	const [ transactions, setTransactions ] = useState(new Array(3).fill(0));
    
    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
    }

    let end = itemPerPage * activePage;
    let start = end - (itemPerPage - 1);
    let allTransactions = [];
    if (end > transactions.length) {
        end = (end- itemPerPage) + (itemPerPage - (end - transactions.length));
    }
    for (let i = start - 1; i < end; i++) {
        allTransactions.push(transactions[i]);
    }
    
    return (
        <>
            <div className="d-flex justify-content-center mt-4">
                <Pagination
                    activePage={activePage}
                    itemsCountPerPage={itemPerPage}
                    totalItemsCount={transactions.length}
                    pageRangeDisplayed={5}
                    linkClass="page-link"
                    onChange={handlePageChange}     
                />
            </div>
            { allTransactions.map((transaction, key) => {
                return <Transaction key={key} />
            }) }
        </>
    );
}