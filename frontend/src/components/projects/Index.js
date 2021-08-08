import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setNotLoggedIn } from '../../redux/reducers/loggedInReducer';
import { useHistory } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import Project from './Project';

import BlockchainServices from '../../services/Blockchain';
import LocalStorageUtil from '../../utils/LocalStorage';

import '../../styles/blockchain/project.css';

export default function Index() {

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        (async () => {
            const blockchainServices = new BlockchainServices(LocalStorageUtil.read("token"), history);
            const response = await blockchainServices.getProjects();
            if (response && response.status === 200) {
                setProjects(response.data.projects);
            } else {
                dispatch(setNotLoggedIn());
                LocalStorageUtil.remove("token");
                LocalStorageUtil.remove("TraceDonateUsername");
                history.push("/login");
                history.go(0);
            }
        })();
    }, []);

    const [activePage, setActivePage] = useState(1);
    const [itemPerPage, setItemPerPage] = useState(4);

	const [ projects, setProjects ] = useState([]);

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
        <>
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
            <div className="project-layout">
                { allProjects.map((project, key) => {
                    return <Project project={project} key={key} />
                }) }
            </div>
        </>
    );
}