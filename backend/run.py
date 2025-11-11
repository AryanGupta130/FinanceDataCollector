from flask import Flask
from flask_cors import CORS
from app.routes.stock_routes import stock_bp

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for frontend-backend communication
    
    # Register blueprints
    app.register_blueprint(stock_bp, url_prefix='/api')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5001)