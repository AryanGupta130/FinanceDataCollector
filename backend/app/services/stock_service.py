import yfinance as yf
from typing import Dict, Any

class StockService:
    def __init__(self):
        # No SEC headers needed for now - we'll use yfinance only
        pass
    
    def get_stock_info(self, ticker: str) -> Dict[str, Any]:
        """Get company info using yfinance only"""
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            
            # Basic stock information
            stock_data = {
                'ticker': ticker,
                'name': info.get('longName', 'N/A'),
                'sector': info.get('sector', 'N/A'),
                'industry': info.get('industry', 'N/A'),
                'currentPrice': info.get('currentPrice', 'N/A'),
                'marketCap': self.format_market_cap(info.get('marketCap')),
                'peRatio': info.get('trailingPE', 'N/A'),
                'dividendYield': info.get('dividendYield', 'N/A'),
                'fiftyTwoWeekHigh': info.get('fiftyTwoWeekHigh', 'N/A'),
                'fiftyTwoWeekLow': info.get('fiftyTwoWeekLow', 'N/A'),
                'description': info.get('longBusinessSummary', 'N/A')[:500] + '...' if info.get('longBusinessSummary') else 'N/A',
            }
            
            return stock_data
            
        except Exception as e:
            return {'error': f'Failed to fetch data for {ticker}: {str(e)}'}
    
    def format_market_cap(self, market_cap):
        """Format market cap to readable format (B, M, etc.)"""
        if market_cap and market_cap != 'N/A':
            try:
                market_cap = float(market_cap)
                if market_cap >= 1e12:
                    return f"${market_cap/1e12:.2f}T"
                elif market_cap >= 1e9:
                    return f"${market_cap/1e9:.2f}B"
                elif market_cap >= 1e6:
                    return f"${market_cap/1e6:.2f}M"
                else:
                    return f"${market_cap:,.2f}"
            except (TypeError, ValueError):
                return market_cap
        return market_cap