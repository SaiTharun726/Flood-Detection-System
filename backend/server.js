const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mqtt = require('mqtt');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MQTT Connection
const mqttClient = mqtt.connect('mqtt://broker.emqx.io');

let latestMeasurements = {}; // In-memory storage for the latest sensor data

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    
    // Subscribe to relevant topics
    mqttClient.subscribe('floodDetection/sensorData', (err) => {
        if (err) console.error('Subscription error:', err);
    });
    mqttClient.subscribe('floodDetection/alertrainData');
    mqttClient.subscribe('floodDetection/alertfloodData');
});

mqttClient.on('message', (topic, message) => {
    const dataString = message.toString();
    const dataParts = dataString.split(',');

    // Parse data from MQTT message
    const measurements = {};
    dataParts.forEach(part => {
        const [key, value] = part.split(':');
        measurements[key.trim()] = parseFloat(value);
    });

    // Store latest measurements
    latestMeasurements = { ...latestMeasurements, ...measurements };
    console.log('Updated measurements:', latestMeasurements);
});

// API Endpoint to get the latest sensor data
app.get('/measurements', (req, res) => {
    res.json(latestMeasurements);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
