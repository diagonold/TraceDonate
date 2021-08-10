import React from 'react';
import LoadingOverlay from 'react-loading-overlay';
import { useSelector } from 'react-redux';

export default function LoadingSpinnerOverlay() {

    const isActive = useSelector((state) => state.loadingSpinnerOverlay.value);

    return (
            <LoadingOverlay
                className="mt-5"
                active={isActive}
                spinner
                text='Loading...'
            >
            </LoadingOverlay>
    );
}