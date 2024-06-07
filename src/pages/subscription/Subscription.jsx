import React from 'react';
import { useLocation } from 'react-router-dom';

const Subscription = () => {
    const location = useLocation()
    console.log(location)
    return (
        <div>
            This is subscription Page
        </div>
    );
};

export default Subscription;