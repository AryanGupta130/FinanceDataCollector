import React, { useState } from 'react';

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

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setCallPrice(null);
        setPutPrice(null);

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

    return (
        <div className="black-scholes-calculator">
            <h2>Black-Scholes Option Pricing Calculator</h2>
            <form onSubmit={handleCalculate} className="calculator-form">
                <input
                    type="number"
                    step="any"
                    value={stockPrice}
                    onChange={(e) => setStockPrice(e.target.value)}
                    placeholder="Stock Price"
                    required
                />
                <input
                    type="number"
                    step="any"
                    value={strikePrice}
                    onChange={(e) => setStrikePrice(e.target.value)}
                    placeholder="Strike Price"
                    required
                />
                <input
                    type="number"
                    step="any"
                    value={timeToExpiry}
                    onChange={(e) => setTimeToExpiry(e.target.value)}
                    placeholder="Time to Expiry (years)"
                    required
                />
                <input
                    type="number"
                    step="any"
                    value={riskFreeRate}
                    onChange={(e) => setRiskFreeRate(e.target.value)}
                    placeholder="Risk-Free Rate (decimal)"
                    required
                />
                <input
                    type="number"
                    step="any"
                    value={volatility}
                    onChange={(e) => setVolatility(e.target.value)}
                    placeholder="Volatility (decimal)"
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Calculating...' : 'Calculate'}
                </button>
            </form>

            {error && <div className="error-message">{error}</div>}

            {callPrice !== null && (
                <div className="result">
                    <h3>Option Prices:</h3>
                    <p>Call Price: ${callPrice.toFixed(2)}</p>
                    <p>Put Price: ${putPrice?.toFixed(2)}</p>
                </div>
            )}
        </div>
    );
};

export default BlackScholes;