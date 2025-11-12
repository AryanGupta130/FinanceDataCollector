import React from 'react';
import './StockInfoTable.css';

interface StockData {
    ticker: string;
    name: string;
    currentPrice: number;
    sector: string;
    industry: string;
    marketCap: string;
    peRatio: number;
    dividendYield: number;
    fiftyTwoWeekHigh: number;
    fiftyTwoWeekLow: number;
    description: string;
    message?: string;
}

interface StockInfoTableProps {
    stockData: StockData;
}

const StockInfoTable: React.FC<StockInfoTableProps> = ({ stockData }) => {
    return (
        <div className="stock-info-table">
            <div className="stock-header">
                <h2>{stockData.name} ({stockData.ticker})</h2>
                <div className="current-price">${stockData.currentPrice}</div>
            </div>
            
            <div className="table-container">
                <table className="info-table">
                    <tbody>
                        <tr>
                            <td className="label">Sector</td>
                            <td className="value">{stockData.sector}</td>
                        </tr>
                        <tr>
                            <td className="label">Industry</td>
                            <td className="value">{stockData.industry}</td>
                        </tr>
                        <tr>
                            <td className="label">Market Cap</td>
                            <td className="value">{stockData.marketCap}</td>
                        </tr>
                        <tr>
                            <td className="label">P/E Ratio</td>
                            <td className="value">{stockData.peRatio}</td>
                        </tr>
                        <tr>
                            <td className="label">Dividend Yield</td>
                            <td className="value">{(stockData.dividendYield * 100).toFixed(2)}%</td>
                        </tr>
                        <tr>
                            <td className="label">52 Week Range</td>
                            <td className="value">
                                ${stockData.fiftyTwoWeekLow} - ${stockData.fiftyTwoWeekHigh}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            {stockData.description && (
                <div className="description-section">
                    <h3>Company Description</h3>
                    <p className="description">{stockData.description}</p>
                </div>
            )}
            
            {stockData.message && (
                <div className="message">
                    {stockData.message}
                </div>
            )}
        </div>
    );
};

export default StockInfoTable;