import React from 'react';
import { useDispatch } from 'react-redux';
import { setNotLoggedIn } from '../../redux/reducers/loggedInReducer';
import { changeToPage1, changeToPage2, changeToPage3 } from '../../redux/reducers/pageReducer';
import { setWalletModalOpened } from '../../redux/reducers/walletModalReducer';
import { useHistory } from 'react-router-dom';

import AuthServices from '../../services/Auth';
import LocalStorageUtil from '../../utils/LocalStorage';

const authServices = new AuthServices();

export default function NavBar() {

    const dispatch = useDispatch();

    const history = useHistory();

    return (
        <div className="navbar navbar-expand-lg navbar-light bg-dark bg-gradient">
            <div className="container-md">
            <a class="navbar-brand fs-2 text-light" href="#" onClick={() => history.go(0)}>TraceDonate</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse d-flex justify-content-end" id="navbarSupportedContent">
                <ul class="navbar-nav mb-2 mb-lg-0 d-flex justify-content-end">
                    <li class="nav-item">
                        <a class="nav-link text-light" aria-current="page" href="#" onClick={() => dispatch(changeToPage1())}>Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-light" aria-current="page" href="#" onClick={() => dispatch(changeToPage3())}>My Projects</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-light" href="#" onClick={() => dispatch(changeToPage2())}>My Transactions</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-light" href="#" onClick={() => dispatch(setWalletModalOpened())}>{LocalStorageUtil.read("TraceDonateUsername")}'s Wallet</a>
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