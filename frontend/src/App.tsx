import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavbarComponent from './StockAnalysis/components/NavBar';
import StockAnalysis from './StockAnalysis/SotckAnalysis';
import BlackScholes from './OptionsPricing/BlackScholes';

function App() {
    return (
        <div className="App">
            <NavbarComponent />
            <Routes>
                <Route path="/stock-analysis" element={<StockAnalysis />} />
                <Route path="/options-strategies" element={<BlackScholes />} />
            </Routes>
        </div>
    );
}

export default App;