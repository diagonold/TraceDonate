import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCreateNewProjectModalClosed } from '../../../redux/reducers/createNewProjectModalReducer';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { newProjectSchema } from '../../../schema/NewProject';
import Modal from 'react-modal';

import BlockchainServices from '../../../services/Blockchain';
import LocalStorageUtil from '../../../utils/LocalStorage';

const customStyles = {
    content: {
      top: '40%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      width: "60%",
      transform: 'translate(-50%, -50%)',
      borderWidth: "5px",
      fontFamily: 'Lucida Grande'
    },
  };

Modal.setAppElement('#root');

export default function CreateNewProject() {

    const {
		register,
		formState: { 
			errors 
		}, handleSubmit
	} = useForm({resolver: yupResolver(newProjectSchema)});

    const history = useHistory();

    const [ successfullyCreatedNewProject, setSuccessfullyCreatedNewProject ] = useState(false);

    const onSubmitCreateNewProject = async (payload) => {
        const blockchainServices = new BlockchainServices(LocalStorageUtil.read("token"), history);
		try {
			const response = await blockchainServices.createNewProject(payload);
			if (response.status === 201) {
                setSuccessfullyCreatedNewProject(true);
			}
		} catch(err) {
			alert("Error creating new project");
		}
	}

    const dispatch = useDispatch();
    const modal = useSelector((state) => state.createNewProjectModal.value);
    
    const closeModal = () => {
      dispatch(setCreateNewProjectModalClosed());
      if (successfullyCreatedNewProject) {
          history.go(0);
      }
    }

    const NewCreateProjectForm = () => {
        return (
            <div className="my-3 d-flex justify-content-center">
            <form onSubmit={handleSubmit(onSubmitCreateNewProject)} className="container-fluid">
            <h4 className="text-center">New Project</h4>
            <hr/>
                <div className="mb-3 text-start">
                    <label className="text-dark form-label">Description: </label>
                    <textarea type="text" className="form-control" {...register("description")} />
                    <div className="error text-danger">{errors.description?.message}</div>
                </div>
                <br/>
                <div className="mb-3 text-start ">
                    <label className="text-dark form-label">Minimum Donation Amount: </label>
                    <input type="number" className="form-control" defaultValue={0} {...register("min_donation_amount")} />
                    <div className="error text-danger">{errors.min_donation_amount?.message}</div>
                </div>
                <div className="mb-3 text-start ">
                    <label className="text-dark form-label">Goal: </label>
                    <input type="number" className="form-control" defaultValue={0} {...register("goal")} />
                    <div className="error text-danger">{errors.goal?.message}</div>
                </div>
                <input className="btn btn-secondary" type="submit" value="Create" />
            </form>
            </div>
        );
    }

    return (
        <Modal
        isOpen={modal}
        onRequestClose={closeModal}
        style={customStyles}
      >
          { !successfullyCreatedNewProject 
            ?
            <NewCreateProjectForm />
            :
            <h3 className="text-center">Successfully Create New Project!</h3>
          }
      </Modal>
    );
}