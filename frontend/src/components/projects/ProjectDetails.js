import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProjectModalClosed } from '../../redux/reducers/projectModalReducer';
import Modal from 'react-modal';

const customStyles = {
    content: {
      top: '35%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxHeight: "50%",
      fontFamily: 'Lucida Grande',
      borderWidth: "5px"
    },
  };

Modal.setAppElement('#root');

export default function ProjectDetails() {

  const dispatch = useDispatch();
  const modal = useSelector((state) => state.projectModal.opened);

  const details = useSelector((state) => state.projectModal.data);
  
  const closeModal = () => {
    dispatch(setProjectModalClosed());
  }

  const ProjectRequest = ({ request }) => {
      const {
        requestDescription,
        value,
        recipient,
        completed,
        index
      } = request;
      return (
          <div className={`container-md my-3 p-3 border border-3 text-light overflow-auto bg-gradient ${completed ? "bg-success" : "bg-danger"}`}>
              <p>{requestDescription}</p>
              <p>{value}</p>
              <p>{recipient}</p>
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
                return <ProjectRequest request={request} key={key} />
            })}
        </Modal>
    );
}