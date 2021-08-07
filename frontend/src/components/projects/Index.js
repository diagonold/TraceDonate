import React, { useState, useEffect } from 'react';
import Pagination from 'react-js-pagination';
import Project from './Project';

import BlockchainServices from '../../services/Blockchain';

const blockchainServices = new BlockchainServices();

export default function Index() {

    useEffect(() => {
        (async () => {
            const response = await blockchainServices.getProjects();
            if (response.status === 200) {
                setProjects(response.data.projects);
            }
        })();
    }, []);

    const [activePage, setActivePage] = useState(1);
    const [itemPerPage, setItemPerPage] = useState(3);

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
            { allProjects.map((project, key) => {
                return <Project project={project} key={key} />
            }) }
        </>
    );
}