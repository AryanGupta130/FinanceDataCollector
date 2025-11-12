import React, { useState } from 'react';
import './HomePage.css';
import StockInfoTable from './components/StockInfoTable';

const HomePage: React.FC = () => {
    const [ticker, setTicker] = useState('');
    const [loading, setLoading] = useState(false);
    const [stockData, setStockData] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (ticker.trim()) {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5001/api/stock/${ticker}`);
                const data = await response.json();
                setStockData(data);
                console.log('Stock data:', data);
            } catch (error) {
                console.error('Error fetching stock data:', error);
                setStockData({ error: 'Failed to fetch stock data' });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="home-page">
            <header className="home-header">
                <h1>Finance Data Collector</h1>
                <p>Enter a stock ticker to get SEC filings and financial data</p>
            </header>
            
            <main className="home-main">
                <section className="search-section">
                    <form onSubmit={handleSubmit} className="ticker-form">
                        <input
                            type="text"
                            value={ticker}
                            onChange={(e) => setTicker(e.target.value.toUpperCase())}
                            placeholder="Enter stock ticker (e.g., AAPL, TSLA, MSFT)"
                            className="ticker-input"
                            maxLength={10}
                        />
                        <button 
                            type="submit" 
                            className="search-button"
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Get Data'}
                        </button>
                    </form>
                    
                    {stockData && (
                        stockData.error ? (
                            <div className="error-message">
                                Error: {stockData.error}
                            </div>
                        ) : (
                            <StockInfoTable stockData={stockData} />
                        )
                    )}
                </section>
            </main>
        </div>
    );
};

export default HomePage;