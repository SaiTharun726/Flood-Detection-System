import React, { useEffect, useState } from 'react';
import './Measurement.css';

const Measurements = () => {
    const [measurements, setMeasurements] = useState({
        Humidity: 0,
    Temperature: 0,
        WaterLevel: 0,
        RainValue: 0,
    });

    useEffect(() => {
        const fetchMeasurements = async () => {
            try {
                const response = await fetch('http://localhost:5000/measurements');
                // console.log(response);
                if (response.ok) {
                    const data = await response.json();
                    // const parsedData = {
                    //     Humidity: parseInt(data.Humidity, 10) ,       // Parse as int or default to 'N/A'
                    //     Temperature: parseInt(data.Temperature, 10),
                    //     WaterLevel: parseInt(data.WaterLevel, 10) ,
                    //     RainValue: parseInt(data.RainValue, 10)
                    // };
                    // Update measurements with fetched data
                    setMeasurements(() => ({
                        ...data
                    }));
                } else {
                    console.error('Error fetching measurements:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching measurements:', error);
            }
        };

        // Fetch measurements initially and set up a periodic fetch interval
        fetchMeasurements();
        const interval = setInterval(fetchMeasurements, 5000); // Fetch every 5 seconds

        // Clean up interval on component unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <div className='container'>
            <div className='box'>
            <h1 style={{color : 'black'}}>Measurements</h1>
            <p>Humidity: {measurements.Humidity}</p>
            <p>Temperature: {measurements.Temperature}</p>
            <p>Water Level: {measurements.WaterLevel}</p>
            <p>Rain Value: {measurements.RainValue}</p>
            <button onClick={() => window.location.href = '/alerts'}>View Alerts</button>
            </div>
        </div>
    );
};

export default Measurements;
