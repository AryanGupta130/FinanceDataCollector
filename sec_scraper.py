import requests
import json

def get_sec_companies():
    url = "https://www.sec.gov/files/company_tickers.json"
    
    headers = {
        'User-Agent': 'FinanceDataCollector 1.0 (aryanguptaswas@gmail.com)',
        'Accept': 'application/json'
    }
    
    try:
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            data = response.json()      
            print("Example data:")
            print(data["0"])
            print(f"Found data for {len(data)} companies")
            print("Top 10 Companies")
            
            for i in range(10):
                company = data[str(i)]  # Keys are strings like "0", "1", "2"
                print(f"{i+1:2d}. {company['ticker']:6} | {company['title']}")
            
            return data
        else:
            print(f"Error: Got status {response.status_code}")
            return None
            
    except Exception as e:
        print(f"Error: {e}")
        return None

companies_data = get_sec_companies()

if companies_data:
    print("\n" + "="*50)
    print("LET'S FIND SOME SPECIFIC COMPANIES")
    print("="*50)
    
    for key, company in companies_data.items():
        if company['ticker'] == 'AAPL':
            print(f"\n📱 Found Apple!")
            print(f"   CIK: {company['cik_str']}")
            print(f"   Ticker: {company['ticker']}")
            print(f"   Name: {company['title']}")
            break
    
    for key, company in companies_data.items():
        if company['ticker'] == 'MSFT':
            print(f"\n💻 Found Microsoft!")
            print(f"   CIK: {company['cik_str']}")
            print(f"   Ticker: {company['ticker']}") 
            print(f"   Name: {company['title']}")
            break