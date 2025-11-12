import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavbarComponent from './StockAnalysis/components/NavBar';
import StockAnalysis from './StockAnalysis/SotckAnalysis';

function App() {
    return (
        <div className="App">
            <NavbarComponent />
            <Routes>
                <Route path="/stock-analysis" element={<StockAnalysis />} />
            </Routes>
        </div>
    );
}

export default App;