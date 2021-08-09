import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setNotLoggedIn } from '../../redux/reducers/loggedInReducer';
import { useHistory } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import Transaction from './Transaction';

import BlockchainServices from '../../services/Blockchain';
import LocalStorageUtil from '../../utils/LocalStorage';

export default function Index() {

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        (async () => {
            const blockchainServices = new BlockchainServices(LocalStorageUtil.read("token"), history);
            const response = await blockchainServices.getTransactions();
            if (response && response.status === 200) {
                setTransactions(response.data.transactions);
            } else {
                dispatch(setNotLoggedIn());
                LocalStorageUtil.remove("token");
                LocalStorageUtil.remove("TraceDonateUsername");
                history.push("/login");
                history.go(0);
            }
        })();
    }, []);

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
            <div className="container-md">
            { allTransactions.map((transaction, key) => {
                return <Transaction transaction={transaction} key={key} />
            }) }
            </div>
        </>
    );
}