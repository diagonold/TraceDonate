import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setProjectModalOpened, setProjectModalClosed } from '../../redux/reducers/projectModalReducer';
import Modal from 'react-modal';

import BlockchainServices from '../../services/Blockchain';
import LocalStorageUtil from '../../utils/LocalStorage';

const customStylesNormal = {
    content: {
      top: '45%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxHeight: "70%",
      width: "50%",
      fontFamily: 'Lucida Grande',
      borderWidth: "5px"
    },
  };

  const customStylesVoted = {
    content: {
      top: '22%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxHeight: "70%",
      width: "50%",
      fontFamily: 'Lucida Grande',
      borderWidth: "5px"
    },
  };

Modal.setAppElement('#root');

export default function ProjectDetails() {

  const history = useHistory();

  const dispatch = useDispatch();
  const modal = useSelector((state) => state.projectModal.opened);

  const details = useSelector((state) => state.projectModal.data);

  const [ justVoted, setJustVoted ] = useState(false);

  const [ justPaid, setJustPaid ] = useState(false);
  
  const closeModal = () => {
    dispatch(setProjectModalClosed());
    if (justVoted || justPaid) {
      history.go(0);
    }
  }

  const voteForRequest = async (project_address, request_id) => {
    const blockchainServices = new BlockchainServices(LocalStorageUtil.read("token"), history);
    const response = await blockchainServices.vote({
      "project_addy": project_address,
      "request_id": parseInt(request_id)
    });
    if (response.status === 201) {
      setJustVoted(true);
    }
  }

  const payForRequest = async (project_address, request_id) => {
    const blockchainServices = new BlockchainServices(LocalStorageUtil.read("token"), history);
    const response = await blockchainServices.makePayment({
      "project_addy": project_address,
      "request_index": parseInt(request_id)
    });
    if (response.status === 201) {
      console.log("ok");
      setJustPaid(true);
    }   
  }

  const ProjectRequest = ({ 
    request, 
    project_address, 
    owner, 
    raisedDonation,  
    participated
  }) => {
      const {
        requestDescription,
        value,
        recipient,
        completed,
        request_id,
        voted,
        ready_payment,
        num_of_vote
      } = request;

      return (
        <>
          <div className={"container-md my-3 p-3 border border-3 text-dark overflow-auto bg-white bg-gradient"}>
              <div className="d-flex flex-row mb-3">
              <div className={`p-2 w-25 text-light text-center bg-gradient ${completed ? "bg-success" : "bg-danger"}`}>
                { completed ? "Completed" : "Uncompleted" }
              </div>
              {/*
              { completed && project_address !== LocalStorageUtil.read("TraceDonateWallet") && (
                <div className="p-2 w-25 text-dark text-center bg-warning bg-gradient">Votable</div>
              )}
              */}
              </div>
              <p>Description: {requestDescription}</p>
              <p>Requested Amount: {value} ETH</p>
              <p>Recipient Address: {recipient}</p>
              <p>Current Vote Count: {num_of_vote}</p>
              {/* <p>{recipient}</p> */}
              <div className="d-flex justify-content-center mt-4">
              { participated && (
                <>
                { owner !== LocalStorageUtil.read("TraceDonateWallet") && !voted && (
                  <button type="button" className="btn btn-primary text-light" onClick={async () => await voteForRequest(project_address, request_id)}>Vote</button>
                )}
                { owner !== LocalStorageUtil.read("TraceDonateWallet") && voted && (
                  <button type="button" className="btn btn-outline-secondary text-secondary" disabled>You Voted For This Request</button>
                )}
              </>
              )}
              { !completed 
              && ready_payment 
              && owner === LocalStorageUtil.read("TraceDonateWallet") 
              && 
              value <= raisedDonation
              && (
                <button type="button" className="btn btn-primary text-light" onClick={async () => await payForRequest(project_address, request_id)}>Make Payment</button>
              )}
              </div>
          </div>
          </>
      );
  }
  
    return (
        <Modal
          isOpen={modal}
          onRequestClose={closeModal}
          style={justVoted ? customStylesVoted : customStylesNormal}
        >
          { !justVoted && !justPaid && (
            <>
            <h4 className="text-center">Request(s)</h4>
            <hr/>
            {details.requests.map((request, key) => {
                return <ProjectRequest 
                request={request} 
                project_address={details.project_address} 
                owner={details.owner} 
                raisedDonation={details.raisedDonation} 
                participated={details.participated}
                key={key} />
            })}
            </>
          )}
          { justVoted && !justPaid && (
            <h4 className="text-center">You just voted request for {details.project_address}!</h4>
          )}
          { justPaid && !justVoted && (
            <h4 className="text-center">You just paid a request </h4>
          )}
        </Modal>
    );
}