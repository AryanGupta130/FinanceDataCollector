from flask import Blueprint, jsonify, request
from app.services.sec_service import SECService

sec_bp = Blueprint('sec', __name__)
sec_service = SECService()

@sec_bp.route('/test')
def test_route():
    return jsonify({"message": "Backend is working!", "status": "success"})

@sec_bp.route('/company/<ticker>')
def get_company_data(ticker):
    try:
        data = sec_service.get_company_data(ticker.upper())
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@sec_bp.route('/company/<ticker>/filings')
def get_company_filings(ticker):
    try:
        filings = sec_service.get_company_filings(ticker.upper())
        return jsonify(filings)
    except Exception as e:
        return jsonify({'error': str(e)}), 500