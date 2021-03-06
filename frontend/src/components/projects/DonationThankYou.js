import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setDonationThankYouModalClosed } from '../../redux/reducers/donationThankYouModalReducer';
import Modal from 'react-modal';

const customStyles = {
    content: {
      top: '23%',
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

export default function DonationThankYou() {

  const dispatch = useDispatch();
  const modal = useSelector((state) => state.donationThankYouModal.opened);
  const details = useSelector((state) => state.donationThankYouModal.data);

  const history = useHistory();
  
  const closeModal = () => {
    dispatch(setDonationThankYouModalClosed());
    history.go(0);
  }
  
    return (
        <Modal
          isOpen={modal}
          onRequestClose={closeModal}
          style={customStyles}
        >
          <div className="container-md">
            <h3 className="text-center">Thank You For Your Donation!</h3>
            <hr/>
            <p>You donated {details.amount} ETH to {details.receiver}</p>
          </div>
        </Modal>
    );
}