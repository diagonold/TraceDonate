import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNotLoggedIn } from '../../redux/reducers/loggedInReducer';
import { setLoadingSpinnerOverlayShown, setLoadingSpinnerOverlayNotShown } from '../../redux/reducers/loadingSpinnerOverlayReducer';
import { useHistory } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import Transaction from './Transaction';

import BlockchainServices from '../../services/Blockchain';
import LocalStorageUtil from '../../utils/LocalStorage';
import LoadingSpinnerOverlay from '../LoadingSpinnerOverlay';

export default function Index() {

    const dispatch = useDispatch();
    const history = useHistory();

    const loadingSpinnerOverlay = useSelector((state) => state.loadingSpinnerOverlay.value);

    useEffect(() => {
        (async () => {
            dispatch(setLoadingSpinnerOverlayShown());
            const blockchainServices = new BlockchainServices(LocalStorageUtil.read("token"), history);
            const response = await blockchainServices.getTransactions();
            if (response && response.status === 200) {
                setTransactions(response.data.transactions);
                dispatch(setLoadingSpinnerOverlayNotShown());
            } else {
                dispatch(setNotLoggedIn());
                LocalStorageUtil.remove("token");
                LocalStorageUtil.remove("TraceDonateUsername");
                LocalStorageUtil.remove("TraceDonateWallet");
                dispatch(setLoadingSpinnerOverlayNotShown());
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
            { transactions.length > 0 ?
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
            :
            <div className="my-5">
                <p>No Transaction Recorded</p>
            </div>
            }
            <div className="container-md">
            { !loadingSpinnerOverlay
            ?
            <>
            { allTransactions.map((transaction, key) => {
                return <Transaction transaction={transaction} key={key} />
            }) }
            </>
            :
            <LoadingSpinnerOverlay />
            }
            </div>
        </>
    );
}