// src/component/Alerts.js
import React, { useEffect, useState } from 'react';
import './alert.css';

const Alerts = () => {
    const [alerts, setAlerts] = useState({
        'Flood detected! Water level': 0,
        'Rain detected! Rain value': 0
    });

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const floodResponse = await fetch('http://localhost:5000/measurements');
                const rainResponse = await fetch('http://localhost:5000/measurements');
                const floodData = await floodResponse.json();
                const rainData = await rainResponse.json();

                setAlerts({
                    'Flood detected! Water level': floodData['Flood detected! Water level'],  // Replace with actual value
                    'Rain detected! Rain value': rainData['Rain detected! Rain value'] // Replace with actual value
                });

            } catch (error) {
                console.error('Error fetching alerts:', error);
            }
        };

        fetchAlerts();
    }, []);

    return (
        <div className='cubg'>
            <div className='alert-box'>
            <h2 style={{color : 'black'}}>Alerts</h2>
            <ul>
                {Object.entries(alerts).map(([alertMessage, value], index) => (
                    <li key={index}>
                        {alertMessage}: {value}
                    </li>
                ))}
            </ul>
            </div>
        </div>
    );
    
};

export default Alerts;
