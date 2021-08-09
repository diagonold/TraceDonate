import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setNotLoggedIn } from '../redux/reducers/loggedInReducer';
import { setWalletModalClosed } from '../redux/reducers/walletModalReducer';
import Modal from 'react-modal';
import LocalStorageUtil from '../utils/LocalStorage';

import BlockchainServices from '../services/Blockchain';

const customStyles = {
    content: {
      top: '25%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderWidth: "5px",
      fontFamily: 'Lucida Grande'
    },
  };

Modal.setAppElement('#root');

export default function Wallet() {

  const history = useHistory();

  useEffect(() => {
    (async () => {
      const blockchainServices = new BlockchainServices(LocalStorageUtil.read("token"), history);
      const response = await blockchainServices.getWallet();
      if (response.status === 200) {
        setWalletDetail({
          wallet: response.data.wallet,
          balance: response.data.balance 
        });
      }
    })();
  }, []);

  const [ walletDetail, setWalletDetail ] = useState({
    "wallet": "",
    "balance": 0
  });

  const dispatch = useDispatch();
  const modal = useSelector((state) => state.walletModal.value);
  
  const closeModal = () => {
    dispatch(setWalletModalClosed());
  }
  
    return (
        <Modal
          isOpen={modal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="My Wallet"
        >
          <div className="container-md">
            <h3 className="text-center">Hello, {LocalStorageUtil.read("TraceDonateUsername") ? LocalStorageUtil.read("TraceDonateUsername") : "User"}</h3>
            <hr/>
            <p>Address: {walletDetail.wallet}</p>
            <p>Balance: {walletDetail.balance}</p>
          </div>
        </Modal>
    );
}