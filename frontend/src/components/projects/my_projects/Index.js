import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNotLoggedIn } from '../../../redux/reducers/loggedInReducer';
import { setLoadingSpinnerOverlayShown, setLoadingSpinnerOverlayNotShown } from '../../../redux/reducers/loadingSpinnerOverlayReducer';
import { useHistory } from 'react-router-dom';
import { setCreateNewProjectModalOpened } from '../../../redux/reducers/createNewProjectModalReducer';
import { setCreateNewRequestModalOpened } from '../../../redux/reducers/createNewRequestModalReducer'; 
import Pagination from 'react-js-pagination';
import MyProject from './MyProject';

import BlockchainServices from '../../../services/Blockchain';
import LocalStorageUtil from '../../../utils/LocalStorage';

import '../../../styles/blockchain/project.css';
import LoadingSpinnerOverlay from '../../LoadingSpinnerOverlay';

export default function Index() {

    const dispatch = useDispatch();
    const history = useHistory();

    const loadingSpinnerOverlay = useSelector((state) => state.loadingSpinnerOverlay.value);

    useEffect(() => {
        (async () => {
            dispatch(setLoadingSpinnerOverlayShown());
            const blockchainServices = new BlockchainServices(LocalStorageUtil.read("token"), history);
            const response = await blockchainServices.getProjects();
            if (response && response.status === 200) {
                let myProjects = [];
                let unfilteredProjects = response.data.projects;
                for (let project of unfilteredProjects) {
                    if (project.owner === LocalStorageUtil.read("TraceDonateWallet")) {
                        myProjects.push(project);
                    }
                }
                setProjects(myProjects);
                setProjectsCopy(myProjects);
                dispatch(setLoadingSpinnerOverlayNotShown());
            } else {
                dispatch(setNotLoggedIn());
                LocalStorageUtil.remove("token");
                LocalStorageUtil.remove("TraceDonateUsername");
                LocalStorageUtil.remove("TraceDonateWallet");
                dispatch(setLoadingSpinnerOverlayNotShown());
                history.push("/login");
                history.go(0);
            }
        })();
    }, []);

    const [activePage, setActivePage] = useState(1);
    const [itemPerPage, setItemPerPage] = useState(2);

	const [ projects, setProjects ] = useState([]);
    const [ projectsCopy, setProjectsCopy ] = useState([]);

    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
    }

    let end = itemPerPage * activePage;
    let start = end - (itemPerPage - 1);
    let allProjects = [];
    if (end > projects.length) {
        end = (end- itemPerPage) + (itemPerPage - (end - projects.length));
    }
    for (let i = start - 1; i < end; i++) {
        allProjects.push(projects[i]);
    }
    
    return (
        <div className="container-fluid">  
            <div className="row">
            <div className="col-3 mt-5 border-end border-4">
            <div className="container-md my-4 py-3">
                <div className="mb-3">
                <button className="btn btn-primary" onClick={() => dispatch(setCreateNewProjectModalOpened())}>Create New Project</button>
                </div>
                <div className="mb-3">
                    <button className="btn btn-primary" onClick={() => dispatch(setCreateNewRequestModalOpened())}>Create New Request</button>
                </div>
            </div>
            </div>
            <div className="col">
            { !loadingSpinnerOverlay 
            ?
            <>
            { projectsCopy.length > 0 ?
                <div className="d-flex justify-content-center mt-4">
                    <Pagination
                        activePage={activePage}
                        itemsCountPerPage={itemPerPage}
                        totalItemsCount={projects.length}
                        pageRangeDisplayed={5}
                        linkClass="page-link"
                        onChange={handlePageChange}     
                    />
                </div>
                :
                <div className="my-5"></div>
            }
            </>
            :
            <LoadingSpinnerOverlay />
            }
            <div className="container-md">
                <p className="text-start">{projects.length} Projects Available</p>
            </div>
            <div className="container-md">
                { allProjects.map((project, key) => {
                    return <MyProject project={project} key={key} />
                }) }
            </div>
            </div>
            </div>
        </div>
    );
}