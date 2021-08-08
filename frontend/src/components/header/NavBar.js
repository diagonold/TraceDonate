import React from 'react';
import { useDispatch } from 'react-redux';
import { setNotLoggedIn } from '../../redux/reducers/loggedInReducer';
import { changeToPage1, changeToPage2 } from '../../redux/reducers/pageReducer';
import { setWalletModalOpened } from '../../redux/reducers/walletModalReducer';
import { useHistory } from 'react-router-dom';

import AuthServices from '../../services/Auth';

const authServices = new AuthServices();

export default function NavBar() {

    const dispatch = useDispatch();

    const history = useHistory();

    return (
        <div className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
            <a class="navbar-brand" href="#" onClick={() => history.go(0)}>TraceDonate</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mb-2 mb-lg-0 d-flex justify-content-end">
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="#" onClick={() => dispatch(changeToPage1())}>Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" onClick={() => dispatch(changeToPage2())}>My Transactions</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" onClick={() => dispatch(setWalletModalOpened())}>My Wallet</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-danger" href="#" onClick={() => { 
                            dispatch(setNotLoggedIn()); 
                            if (authServices.logout()) { 
                                history.push("/login"); 
                                history.go(0) } 
                            }}
                        >
                            Sign Out
                        </a>
                    </li>
                </ul>
            </div>
            </div>
        </div>
    );
}