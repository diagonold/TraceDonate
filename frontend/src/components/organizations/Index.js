import React, { useState } from 'react';
import Pagination from 'react-js-pagination';
import Organization from './Organization';

export default function Index() {

    const [activePage, setActivePage] = useState(1);
    const [itemPerPage, setItemPerPage] = useState(3);

	const [ organizations, setOrganizations ] = useState(new Array(3).fill(0));

    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
    }

    let end = itemPerPage * activePage;
    let start = end - (itemPerPage - 1);
    let allOrganizations = [];
    if (end > organizations.length) {
        end = (end- itemPerPage) + (itemPerPage - (end - organizations.length));
    }
    for (let i = start - 1; i < end; i++) {
        allOrganizations.push(organizations[i]);
    }
    
    return (
        <>
            <div className="d-flex justify-content-center mt-4">
                <Pagination
                    activePage={activePage}
                    itemsCountPerPage={itemPerPage}
                    totalItemsCount={organizations.length}
                    pageRangeDisplayed={5}
                    linkClass="page-link"
                    onChange={handlePageChange}     
                />
            </div>
            { allOrganizations.map((organization, key) => {
                return <Organization key={key} />
            }) }
        </>
    );
}