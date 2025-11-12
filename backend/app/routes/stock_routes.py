from flask import Blueprint, jsonify, request
from app.services.stock_service import StockService
import math
from scipy.stats import norm

stock_bp = Blueprint('stock', __name__)
stock_service = StockService()

@stock_bp.route('/stock/<ticker>', methods=['GET'])
def get_stock_data(ticker):
    try:
        data = stock_service.get_stock_info(ticker.upper())
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@stock_bp.route('/stock/search', methods=['POST'])
def search_stock():
    try:
        data = request.get_json()
        ticker = data.get('ticker', '').upper()
        
        if not ticker:
            return jsonify({'error': 'Ticker is required'}), 400
            
        stock_data = stock_service.get_stock_info(ticker)
        return jsonify(stock_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
@stock_bp.route('/blackscholes/callprice', methods=['GET'])
def get_call_price():
    try:
        stock_price = float(request.args.get('stock_price'))
        strike_price = float(request.args.get('strike_price'))
        time_to_expiry = float(request.args.get('time_to_expiry'))  # in years
        risk_free_rate = float(request.args.get('risk_free_rate'))  # as decimal (0.05 for 5%)
        volatility = float(request.args.get('volatility'))  # as decimal (0.20 for 20%)
        
        d1 = (math.log(stock_price / strike_price) + 
              (risk_free_rate + 0.5 * volatility**2) * time_to_expiry) / \
             (volatility * math.sqrt(time_to_expiry))
        
        d2 = d1 - volatility * math.sqrt(time_to_expiry)
        
        call_price = (stock_price * norm.cdf(d1) - 
                     strike_price * math.exp(-risk_free_rate * time_to_expiry) * norm.cdf(d2))
        
        delta = norm.cdf(d1)
        gamma = norm.pdf(d1) / (stock_price * volatility * math.sqrt(time_to_expiry))
        theta = (-stock_price * norm.pdf(d1) * volatility / (2 * math.sqrt(time_to_expiry)) - 
                risk_free_rate * strike_price * math.exp(-risk_free_rate * time_to_expiry) * norm.cdf(d2)) / 365
        vega = stock_price * norm.pdf(d1) * math.sqrt(time_to_expiry) / 100
        rho = strike_price * time_to_expiry * math.exp(-risk_free_rate * time_to_expiry) * norm.cdf(d2) / 100
        
        return jsonify({
            'call_price': round(call_price, 2),
            'greeks': {
                'delta': round(delta, 4),
                'gamma': round(gamma, 4),
                'theta': round(theta, 4),
                'vega': round(vega, 4),
                'rho': round(rho, 4)
            },
            'probabilities': {
                'in_the_money': round(norm.cdf(d2), 4),  # Probability option expires ITM
                'delta_prob': round(norm.cdf(d1), 4)     # Risk-neutral probability
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@stock_bp.route('/blackscholes/putprice', methods=['GET'])
def get_put_price():
    try:
        stock_price = float(request.args.get('stock_price'))
        strike_price = float(request.args.get('strike_price'))
        time_to_expiry = float(request.args.get('time_to_expiry'))
        risk_free_rate = float(request.args.get('risk_free_rate'))
        volatility = float(request.args.get('volatility'))
        
        d1 = (math.log(stock_price / strike_price) + 
              (risk_free_rate + 0.5 * volatility**2) * time_to_expiry) / \
             (volatility * math.sqrt(time_to_expiry))
        d2 = d1 - volatility * math.sqrt(time_to_expiry)
        
        put_price = (strike_price * math.exp(-risk_free_rate * time_to_expiry) * norm.cdf(-d2) - 
                    stock_price * norm.cdf(-d1))
        
        delta = norm.cdf(d1) - 1 
        gamma = norm.pdf(d1) / (stock_price * volatility * math.sqrt(time_to_expiry))  
        theta = (-stock_price * norm.pdf(d1) * volatility / (2 * math.sqrt(time_to_expiry)) + 
                risk_free_rate * strike_price * math.exp(-risk_free_rate * time_to_expiry) * norm.cdf(-d2)) / 365
        vega = stock_price * norm.pdf(d1) * math.sqrt(time_to_expiry) / 100  
        rho = -strike_price * time_to_expiry * math.exp(-risk_free_rate * time_to_expiry) * norm.cdf(-d2) / 100
        
        return jsonify({
            'put_price': round(put_price, 2),
            'greeks': {
                'delta': round(delta, 4),
                'gamma': round(gamma, 4),
                'theta': round(theta, 4),
                'vega': round(vega, 4),
                'rho': round(rho, 4)
            },
            'probabilities': {
                'in_the_money': round(norm.cdf(-d2), 4), 
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400