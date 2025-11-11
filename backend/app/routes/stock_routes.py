from flask import Blueprint, jsonify, request
from app.services.stock_service import StockService

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