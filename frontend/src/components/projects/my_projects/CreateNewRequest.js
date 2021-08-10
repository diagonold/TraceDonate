import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCreateNewRequestModalClosed } from '../../../redux/reducers/createNewRequestModalReducer';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { newRequestSchema } from '../../../schema/NewRequest';
import Modal from 'react-modal';

import BlockchainServices from '../../../services/Blockchain';
import LocalStorageUtil from '../../../utils/LocalStorage';

const customStylesNormal = {
    content: {
      top: '48%',
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

  const customStylesSuccess = {
    content: {
      top: '20%',
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

export default function CreateNewRequest() {

    const {
		register,
		formState: { 
			errors 
		}, handleSubmit
	} = useForm({resolver: yupResolver(newRequestSchema)});

    const history = useHistory();

    const [ successfullyCreatedNewRequest, setSuccessfullyCreatedNewRequest ] = useState(false);

    const [ projects, setProjects ] = useState([]);

    useEffect(() => {
        (async () => {
            const blockchainServices = new BlockchainServices(LocalStorageUtil.read("token"), history);
            const response = await blockchainServices.getProjects();
            if (response.status === 200) {
                setProjects(response.data.projects);
            }
        })()
    }, []);

    const onSubmitCreateNewRequest = async (payload) => {
        const blockchainServices = new BlockchainServices(LocalStorageUtil.read("token"), history);
		try {
			const response = await blockchainServices.createNewRequest(payload);
			if (response.status === 201) {
                setSuccessfullyCreatedNewRequest(true);
			}
		} catch(err) {
			alert("Error creating new request");
		}
	}

    const dispatch = useDispatch();
    const modal = useSelector((state) => state.createNewRequestModal.value);
    
    const closeModal = () => {
      dispatch(setCreateNewRequestModalClosed());
      if (successfullyCreatedNewRequest) {
          history.go(0);
      }
    }

    const NewCreateRequestForm = () => {
        return (
            <div className="my-3 d-flex justify-content-center">
            <form onSubmit={handleSubmit(onSubmitCreateNewRequest)} className="container-fluid">
            <h4 className="text-center">New Request</h4>
            <hr/>
                <div className="mb-3 text-start">
                    <label className="text-dark form-label">Project Address: </label>
                    <select className="form-select" {...register("project_addy")}>
                        <option value="" disabled selected>Select your option</option>
                        { projects.map((project, key) => {
                            if (project.owner !== LocalStorageUtil.read("TraceDonateWallet")) {
                                return <option value={project.owner} key={key}>{project.owner}</option>
                            }
                        }) }
                    </select>
                    <div className="error text-danger">{errors.project_addy?.message}</div>
                </div>
                <br/>
                <div className="mb-3 text-start ">
                    <label className="text-dark form-label">Description: </label>
                    <textarea type="text" className="form-control" {...register("description")} />
                    <div className="error text-danger">{errors.description?.message}</div>
                </div>
                <br/>
                <div className="mb-3 text-start">
                    <label className="text-dark form-label">Receiver Address: </label>
                    <select className="form-select" {...register("receiver_addy")}>
                        <option value="" disabled selected>Select your option</option>
                        { projects.map((project, key) => {
                            if (project.owner !== LocalStorageUtil.read("TraceDonateWallet")) {
                                return <option value={project.owner} key={key}>{project.owner}</option>
                            }
                        }) }
                    </select>
                    <div className="error text-danger">{errors.receiver_addy?.message}</div>
                </div>
                <br/>
                <div className="mb-3 text-start ">
                    <label className="text-dark form-label">Amount: </label>
                    <input type="number" className="form-control" defaultValue={0} {...register("amount")} />
                    <div className="error text-danger">{errors.amount?.message}</div>
                </div>
                <br/>
                <input className="btn btn-secondary" type="submit" value="Create" />
            </form>
            </div>
        );
    }

    return (
        <Modal
        isOpen={modal}
        onRequestClose={closeModal}
        style={successfullyCreatedNewRequest ? customStylesSuccess : customStylesNormal}
      >
          { !successfullyCreatedNewRequest 
            ?
            <NewCreateRequestForm />
            :
            <h3 className="text-center">Successfully Create New Request!</h3>
          }
      </Modal>
    );
}