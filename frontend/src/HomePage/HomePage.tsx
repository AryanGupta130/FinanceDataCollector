import React from 'react';
import './HomePage.css';

const HomePage: React.FC = () => {
    return (
        <div className="home-page">
            <header className="home-header">
                <h1>Finance Data Collector</h1>
                <p>Your gateway to financial data analysis</p>
            </header>
            
            <main className="home-main">
                <section className="features">
                    <h2>Features</h2>
                    <div className="feature-cards">
                        <div className="feature-card">
                            <h3>Data Collection</h3>
                            <p>Collect financial data from various sources</p>
                        </div>
                        <div className="feature-card">
                            <h3>Analysis</h3>
                            <p>Analyze and visualize financial metrics</p>
                        </div>
                        <div className="feature-card">
                            <h3>Reports</h3>
                            <p>Generate comprehensive financial reports</p>
                        </div>
                    </div>
                </section>
                
                <section className="actions">
                    <h2>Get Started</h2>
                    <button className="primary-button">
                        Start Collecting Data
                    </button>
                </section>
            </main>
        </div>
    );
};

export default HomePage;

