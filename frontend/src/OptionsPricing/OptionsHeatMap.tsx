import React, { useEffect, useState } from 'react';
import './OptionsHeatMap.css';

interface HeatMapProps {
    stockPrice: number;
    strikePrice: number;
    timeToExpiry: number;
    riskFreeRate: number;
    baseVolatility: number;
}

interface HeatMapData {
    calls: number[][];
    puts: number[][];
    stockPrices: number[];
    volatilities: number[];
}

const OptionsHeatMap: React.FC<HeatMapProps> = ({
    stockPrice,
    strikePrice,
    timeToExpiry,
    riskFreeRate,
    baseVolatility
}) => {
    const [heatMapData, setHeatMapData] = useState<HeatMapData | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState<'call' | 'put'>('call');

    useEffect(() => {
        generateHeatMapData();
    }, [stockPrice, strikePrice, timeToExpiry, riskFreeRate, baseVolatility]);

    const generateHeatMapData = async () => {
        setLoading(true);
        const stockPrices = [];
        const volatilities = [];
        const calls = [];
        const puts = [];

        // Generate stock prices from -30% to +30% of current price
        for (let i = 0; i < 8; i++) {
            const price = stockPrice * (0.7 + i * 0.08); // 70% to 130% of current price
            stockPrices.push(Number(price.toFixed(0)));
            
            const vol = 0.1 + i * 0.06; // 10% to 52% volatility
            volatilities.push(Number(vol.toFixed(2)));
            
            const callRow = [];
            const putRow = [];
            
            for (let j = 0; j < 8; j++) {
                const currentVol = 0.1 + j * 0.06;
                try {
                    // Call option price
                    const callResponse = await fetch(
                        `http://localhost:5001/api/blackscholes/callprice?stock_price=${price}&strike_price=${strikePrice}&time_to_expiry=${timeToExpiry}&risk_free_rate=${riskFreeRate}&volatility=${currentVol}`
                    );
                    const callData = await callResponse.json();
                    callRow.push(Number(callData.call_price.toFixed(2)));
                    
                    // Put option price
                    const putResponse = await fetch(
                        `http://localhost:5001/api/blackscholes/putprice?stock_price=${price}&strike_price=${strikePrice}&time_to_expiry=${timeToExpiry}&risk_free_rate=${riskFreeRate}&volatility=${currentVol}`
                    );
                    const putData = await putResponse.json();
                    putRow.push(Number(putData.put_price.toFixed(2)));
                } catch (err) {
                    console.error('Error fetching option price:', err);
                    callRow.push(0);
                    putRow.push(0);
                }
            }
            
            calls.push(callRow);
            puts.push(putRow);
        }
        
        setHeatMapData({ calls, puts, stockPrices, volatilities });
        setLoading(false);
    };

    const getColorForPrice = (price: number, maxPrice: number) => {
        if (maxPrice === 0) return '#333333';
        
        const intensity = Math.min(price / maxPrice, 1);
        
        // Green to red gradient
        // At intensity 0: Dark green
        // At intensity 0.5: Yellow
        // At intensity 1: Dark red
        const red = Math.floor(255 * intensity);
        const green = Math.floor(255 * (1 - intensity));
        return `rgb(${red}, ${green}, 50)`;
    };

    if (loading) {
        return (
            <div className="heatmap-loading">
                <div>Generating Heat Map...</div>
                <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '10px' }}>
                    This may take a few seconds as we calculate 64 option prices...
                </div>
            </div>
        );
    }

    if (!heatMapData) {
        return (
            <div className="heatmap-error">
                Failed to generate heat map data. Please check your inputs and try again.
            </div>
        );
    }

    const currentData = selectedOption === 'call' ? heatMapData.calls : heatMapData.puts;
    const maxPrice = Math.max(...currentData.flat());

    return (
        <div className="options-heatmap">
            <div className="heatmap-header">
                <h3>Options Price Heat Map</h3>
                <div className="option-selector">
                    <button 
                        className={selectedOption === 'call' ? 'active' : ''}
                        onClick={() => setSelectedOption('call')}
                    >
                        Call Options
                    </button>
                    <button 
                        className={selectedOption === 'put' ? 'active' : ''}
                        onClick={() => setSelectedOption('put')}
                    >
                        Put Options
                    </button>
                </div>
            </div>
            
            <div className="heatmap-container">
                <div className="heatmap-axis">
                    <div className="y-axis-label">Volatility →</div>
                    <div className="heatmap-grid">
                        {heatMapData.volatilities.map((vol, rowIndex) => (
                            <div key={rowIndex} className="heatmap-row">
                                <div className="volatility-label">{(vol * 100).toFixed(0)}%</div>
                                {currentData[rowIndex]?.map((price, colIndex) => (
                                    <div
                                        key={colIndex}
                                        className="heatmap-cell"
                                        style={{ backgroundColor: getColorForPrice(price, maxPrice) }}
                                        title={`Stock: $${heatMapData.stockPrices[colIndex]}, Vol: ${(vol * 100).toFixed(0)}%, Price: $${price.toFixed(2)}`}
                                    >
                                        ${price.toFixed(1)}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="x-axis">
                    <div className="x-axis-spacer"></div>
                    <div className="stock-prices">
                        {heatMapData.stockPrices.map((price, index) => (
                            <div key={index} className="stock-price-label">${price}</div>
                        ))}
                    </div>
                </div>
                <div className="x-axis-label">Stock Price →</div>
            </div>
            
            <div className="heatmap-legend">
                <span>Cheap</span>
                <div className="color-gradient-green-red"></div>
                <span>Expensive</span>
            </div>

            <div className="heatmap-info">
                <p>Green = Lower prices, Red = Higher prices</p>
            </div>
        </div>
    );
};

export default OptionsHeatMap;