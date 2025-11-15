const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
    humidity: Number,
    temperature: Number,
    waterLevel: Number,
    rainValue: Number,
    alert: String,
}, { timestamps: true }); // Optional: adds createdAt and updatedAt timestamps

const SensorData = mongoose.model('SensorData', sensorDataSchema);

module.exports = SensorData;
