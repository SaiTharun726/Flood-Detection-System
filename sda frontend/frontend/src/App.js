// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './component/Login';
import Measurements from './component/Measurements';
import Alerts from './component/Alerts';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/measurements" element={<Measurements />} />
                <Route path="/alerts" element={<Alerts />} />
            </Routes>
        </Router>
    );
};

export default App;
