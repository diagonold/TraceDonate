import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setProjectModalOpened, setProjectModalClosed } from '../../redux/reducers/projectModalReducer';
import Modal from 'react-modal';

import BlockchainServices from '../../services/Blockchain';
import LocalStorageUtil from '../../utils/LocalStorage';

const customStyles = {
    content: {
      top: '40%',
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
  
  const closeModal = () => {
    dispatch(setProjectModalClosed());
  }

  const voteForRequest = async (project_address, request_id) => {
    const blockchainServices = new BlockchainServices(LocalStorageUtil.read("token"), history);
    const response = await blockchainServices.vote({
      "project_address": project_address,
      "request_id": request_id
    });
    if (response.status === 201) {
      dispatch(setProjectModalOpened(details));
    }
  }

  const ProjectRequest = ({ request, project_address }) => {
      const {
        requestDescription,
        value,
        recipient,
        completed,
        request_id,
        voted
      } = request;
      return (
          <div className={`container-md my-3 p-3 border border-3 text-dark overflow-auto bg-light bg-gradient border border-5 ${completed ? "border-success" : "border-danger"}`}>
              <p>{requestDescription}</p>
              <p>{value}</p>
              <p>{recipient}</p>
              <div className="d-flex justify-content-center">
              { !voted ?
                <button type="button" className="btn btn-secondary text-light" onClick={async () => await voteForRequest(project_address, request_id)}>Vote</button>
                :
                <button type="button" className="btn btn-outline-secondary text-dark" disabled>You Voted For This Request</button>
              }
              </div>
          </div>
      );
  }
  
    return (
        <Modal
          isOpen={modal}
          onRequestClose={closeModal}
          style={customStyles}
        >
            {details.requests.map((request, key) => {
                return <ProjectRequest request={request} project_address={details.project_address} key={key} />
            })}
        </Modal>
    );
}