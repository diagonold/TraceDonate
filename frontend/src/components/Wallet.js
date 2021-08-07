import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWalletModalClosed } from '../redux/reducers/walletModalReducer';
import Modal from 'react-modal';
import LocalStorage from '../utils/LocalStorage';

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

    const dispatch = useDispatch();
    const modal = useSelector((state) => state.walletModal.value);
  
    function closeModal() {
      dispatch(setWalletModalClosed());
    }
  
    return (
        <Modal
          isOpen={modal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="My Wallet"
        >
            <h2>Hello, {LocalStorage.read("TraceDonateUsername") ? LocalStorage.read("TraceDonateUsername") : "User"}</h2>
            <p>Address</p>
            <p>amount</p>
        </Modal>
    );
}