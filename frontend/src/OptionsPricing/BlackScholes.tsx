import React, { useState } from 'react';
import './BlackScholes.css';
import OptionsHeatMap from './OptionsHeatMap'; // Import the heat map component

const BlackScholes: React.FC = () => {
    const [stockPrice, setStockPrice] = useState('');
    const [strikePrice, setStrikePrice] = useState('');
    const [timeToExpiry, setTimeToExpiry] = useState('');
    const [riskFreeRate, setRiskFreeRate] = useState('');
    const [volatility, setVolatility] = useState('');
    const [callPrice, setCallPrice] = useState<number | null>(null);
    const [putPrice, setPutPrice] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showHeatMap, setShowHeatMap] = useState(false); // New state for heat map visibility

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setCallPrice(null);
        setPutPrice(null);
        setShowHeatMap(false); // Hide heat map when recalculating

        try {
            const response = await fetch(`http://localhost:5001/api/blackscholes/callprice?stock_price=${stockPrice}&strike_price=${strikePrice}&time_to_expiry=${timeToExpiry}&risk_free_rate=${riskFreeRate}&volatility=${volatility}`);
            const data = await response.json();
            setCallPrice(data.call_price);

            const putResponse = await fetch(`http://localhost:5001/api/blackscholes/putprice?stock_price=${stockPrice}&strike_price=${strikePrice}&time_to_expiry=${timeToExpiry}&risk_free_rate=${riskFreeRate}&volatility=${volatility}`);
            const putData = await putResponse.json();
            setPutPrice(putData.put_price);
        } catch (err) {
            setError('Failed to calculate option prices. Please check your inputs.');
        } finally {
            setLoading(false);
        }
    };

    const toggleHeatMap = () => {
        setShowHeatMap(!showHeatMap);
    };

    return (
        <div className="black-scholes-page">
            <header className="black-scholes-header">
                <h1>Black-Scholes Option Pricing</h1>
                <p>Calculate fair prices for call and put options using the Black-Scholes model</p>
            </header>
            
            <main className="black-scholes-main">
                <section className="calculator-section">
                    <form onSubmit={handleCalculate} className="calculator-form">
                        <input
                            type="number"
                            step="any"
                            value={stockPrice}
                            onChange={(e) => setStockPrice(e.target.value)}
                            placeholder="Stock Price"
                            className="calculator-input"
                            required
                        />
                        <input
                            type="number"
                            step="any"
                            value={strikePrice}
                            onChange={(e) => setStrikePrice(e.target.value)}
                            placeholder="Strike Price"
                            className="calculator-input"
                            required
                        />
                        <input
                            type="number"
                            step="any"
                            value={timeToExpiry}
                            onChange={(e) => setTimeToExpiry(e.target.value)}
                            placeholder="Time to Expiry (years)"
                            className="calculator-input"
                            required
                        />
                        <input
                            type="number"
                            step="any"
                            value={riskFreeRate}
                            onChange={(e) => setRiskFreeRate(e.target.value)}
                            placeholder="Risk-Free Rate (e.g., 0.05 for 5%)"
                            className="calculator-input"
                            required
                        />
                        <input
                            type="number"
                            step="any"
                            value={volatility}
                            onChange={(e) => setVolatility(e.target.value)}
                            placeholder="Volatility (e.g., 0.20 for 20%)"
                            className="calculator-input"
                            required
                        />
                        
                        <div className="button-group">
                            <button 
                                type="submit" 
                                className="calculate-button"
                                disabled={loading}
                            >
                                {loading ? 'Calculating...' : 'Calculate Option Prices'}
                            </button>
                            
                            {callPrice !== null && (
                                <button 
                                    type="button" 
                                    className="heatmap-toggle-button"
                                    onClick={toggleHeatMap}
                                >
                                    {showHeatMap ? 'Hide Heat Map' : 'Show Heat Map'}
                                </button>
                            )}
                        </div>
                    </form>
                    
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {callPrice !== null && (
                        <div className="pricing-results">
                            <h3>Option Prices</h3>
                            <div className="price-cards">
                                <div className="price-card call-price">
                                    <h4>Call Option</h4>
                                    <div className="price">${callPrice.toFixed(2)}</div>
                                </div>
                                <div className="price-card put-price">
                                    <h4>Put Option</h4>
                                    <div className="price">${putPrice?.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Heat Map Section */}
                    {showHeatMap && callPrice !== null && (
                        <OptionsHeatMap
                            stockPrice={Number(stockPrice)}
                            strikePrice={Number(strikePrice)}
                            timeToExpiry={Number(timeToExpiry)}
                            riskFreeRate={Number(riskFreeRate)}
                            baseVolatility={Number(volatility)}
                        />
                    )}
                </section>
            </main>
        </div>
    );
};

export default BlackScholes;