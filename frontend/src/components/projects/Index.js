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
                setProjectsCopy(response.data.projects);
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
    const [itemPerPage, setItemPerPage] = useState(2);

	const [ projects, setProjects ] = useState([]);
    const [ projectsCopy, setProjectsCopy ] = useState([]);

    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
    }

    const filterProjectByDonation = () => {
        let filteredProject = [];
        const min = parseInt(document.getElementById("minDonation").value);
        const max = parseInt(document.getElementById("maxDonation").value);

        if (isNaN(min) || isNaN(max)) {
            return;
        }

        for (let project of projectsCopy) {
            if (project.goal >= min && project.goal <= max) {
                filteredProject.push(project);
            }
        }
        setProjects(filteredProject);
    }

    const resetProjects = () => {
        setProjects(projectsCopy);
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
                <h4>Donation Goal Range: </h4>
                <br/>
                <input type="text" id="minDonation" />
                <p className="my-3">To</p>
                <input type="text" id="maxDonation" />
                <div className="mt-3">
                <button type="button" className="btn btn-primary" onClick={filterProjectByDonation}>Filter</button>
                &nbsp;
                <button type="button" className="btn btn-light border border-4" onClick={resetProjects}>Reset Filter</button>
                </div>
            </div>
            <div className="col">
            { projectsCopy.length > 0 && (
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
            )}
            <div className="container-md">
                <p className="text-start">{projects.length} Projects Available</p>
            </div>
            <div className="container-md">
                { allProjects.map((project, key) => {
                    return <Project project={project} key={key} />
                }) }
            </div>
            </div>
            </div>
        </div>
    );
}