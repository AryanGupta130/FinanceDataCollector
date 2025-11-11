from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for frontend
    
    # Register blueprints
    from app.routes.sec_routes import sec_bp
    app.register_blueprint(sec_bp, url_prefix='/api')
    
    return app