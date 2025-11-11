import requests
import json
import time
import pandas as pd

class SECDataCollector:
    def __init__(self):
        self.headers = {
            'User-Agent': 'FinanceDataCollector 1.0 (aryanguptaswas@gmail.com)',
            'Accept': 'application/json'
        }
        self.companies_data = None
    
    def get_company_directory(self):
        """Step 1: Get all companies from SEC"""
        url = "https://www.sec.gov/files/company_tickers.json"
        response = requests.get(url, headers=self.headers)
        
        if response.status_code == 200:
            self.companies_data = response.json()
            print(f"Loaded {len(self.companies_data)} companies")
            return True
        return False
    
    def find_companies(self, tickers):
        """Step 2: Find specific companies by ticker"""
        target_companies = {}
        
        for ticker in tickers:
            for key, company in self.companies_data.items():
                if company['ticker'] == ticker:
                    target_companies[ticker] = {
                        'cik': company['cik_str'],
                        'name': company['title']
                    }
                    print(f"Found {ticker}: {company['title']} (CIK: {company['cik_str']})")
                    break
            else:
                print(f"Could not find {ticker}")
                
        return target_companies
    
    def get_company_filings(self, cik):
        """Step 3: Get recent filings for a company"""
        url = f"https://data.sec.gov/submissions/CIK{cik:010d}.json"
        response = requests.get(url, headers=self.headers)
        
        if response.status_code == 200:
            return response.json()
        return None
    
    def analyze_filings(self, filings_data, company_name):
        """Step 4: Analyze and categorize filings"""
        if not filings_data:
            return []
        
        recent = filings_data['filings']['recent']
        analysis = []
        
        # Look at last 20 filings
        for i in range(min(20, len(recent['form']))):
            form_type = recent['form'][i]
            filing_date = recent['filingDate'][i]
            
            # Categorize important filings
            if form_type in ['10-K', '10-Q']:
                category = "Financial Report"
                importance = "HIGH"
            elif form_type == '8-K':
                category = "Current Report"
                importance = "HIGH" 
            elif form_type == '4':
                category = "Insider Trading"
                importance = "MEDIUM"
            else:
                category = "Other Filing"
                importance = "LOW"
            
            analysis.append({
                'form': form_type,
                'date': filing_date,
                'category': category,
                'importance': importance
            })
        
        return analysis

def main():
    collector = SECDataCollector()

    if not collector.get_company_directory():
        return
    
    target_tickers = ['AAPL', 'MSFT', 'TSLA', 'JPM', 'AMZN']
    target_companies = collector.find_companies(target_tickers)
        
    for ticker, company_info in target_companies.items():
        print(f"\n--- Analyzing {ticker} ({company_info['name']}) ---")
        
        time.sleep(0.5)
        
        filings_data = collector.get_company_filings(company_info['cik'])
        if filings_data:
            analysis = collector.analyze_filings(filings_data, company_info['name'])
            
            high_importance = [f for f in analysis if f['importance'] in ['HIGH', 'MEDIUM']][:5]
            for filing in high_importance:
                print(f"  {filing['category']}: {filing['form']} on {filing['date']}")
        else:
            return print(f"Failed to retrieve filings for {ticker}")
        
if __name__ == "__main__":
    main()