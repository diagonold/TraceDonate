import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWalletModalClosed } from '../redux/reducers/walletModalReducer';
import Modal from 'react-modal';
import LocalStorage from '../utils/LocalStorage';

import BlockchainServices from '../services/Blockchain';

const blockchainServices = new BlockchainServices();

const customStyles = {
    content: {
      top: '30%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

Modal.setAppElement('#root');

export default function Wallet() {

  useEffect(() => {
    (async () => {
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
            <h2 className="text-center">Hello, {LocalStorage.read("TraceDonateUsername") ? LocalStorage.read("TraceDonateUsername") : "User"}</h2>
            <p>Address: {walletDetail.wallet}</p>
            <p>Balance: {walletDetail.balance}</p>
        </Modal>
    );
}