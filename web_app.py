from flask import Flask, render_template_string, request, jsonify
import requests
import json

app = Flask(__name__)

# Simple HTML template
HTML_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head>
    <title>Financial Research Platform</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .container { max-width: 800px; margin: 0 auto; }
        .search-box { margin: 20px 0; padding: 10px; width: 200px; }
        .result { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .filing { border-left: 4px solid #007cba; padding-left: 10px; margin: 5px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Financial Research Platform</h1>
        
        <form method="POST">
            <input type="text" name="ticker" class="search-box" placeholder="Enter ticker (e.g., AAPL)" value="{{ ticker }}">
            <button type="submit">Analyze</button>
        </form>
        
        {% if ticker %}
        <div class="result">
            <h2>Results for {{ ticker }}</h2>
            {% if filings %}
                <h3>Recent SEC Filings:</h3>
                {% for filing in filings %}
                <div class="filing">
                    <strong>{{ filing.form }}</strong> - {{ filing.date }}<br>
                    <small>{{ filing.description }}</small>
                </div>
                {% endfor %}
            {% else %}
                <p>No filings found or error retrieving data.</p>
            {% endif %}
        </div>
        {% endif %}
    </div>
</body>
</html>
'''

def get_sec_data(ticker):
    """Get SEC data for a ticker"""
    try:
        # Get company directory
        url = "https://www.sec.gov/files/company_tickers.json"
        headers = {'User-Agent': 'FinanceApp 1.0'}
        
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            companies = response.json()
            
            # Find the company
            for key, company in companies.items():
                if company['ticker'] == ticker.upper():
                    cik = company['cik_str']
                    
                    # Get recent filings
                    filings_url = f"https://data.sec.gov/submissions/CIK{cik:010d}.json"
                    filings_response = requests.get(filings_url, headers=headers)
                    
                    if filings_response.status_code == 200:
                        filings_data = filings_response.json()
                        recent = filings_data['filings']['recent']
                        
                        # Return last 5 filings
                        filings = []
                        for i in range(min(5, len(recent['form']))):
                            filings.append({
                                'form': recent['form'][i],
                                'date': recent['filingDate'][i],
                                'description': f"Accession: {recent['accessionNumber'][i]}"
                            })
                        return filings
        return []
    except Exception as e:
        print(f"Error: {e}")
        return []

@app.route('/', methods=['GET', 'POST'])
def index():
    ticker = ""
    filings = []
    
    if request.method == 'POST':
        ticker = request.form['ticker']
        filings = get_sec_data(ticker)
    
    return render_template_string(HTML_TEMPLATE, ticker=ticker, filings=filings)

if __name__ == '__main__':
    app.run(debug=True, port=5000)