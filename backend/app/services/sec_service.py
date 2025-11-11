import requests
from typing import Dict, List, Optional

class SECService:
    def __init__(self):
        self.headers = {'User-Agent': 'FinanceDataCollector 1.0'}
        self.base_url = "https://www.sec.gov/files/company_tickers.json"
    
    def get_company_data(self, ticker: str) -> Dict:
        """Get company info and recent filings"""
        companies = self._get_companies()
        
        for company in companies.values():
            if company['ticker'] == ticker:
                filings = self.get_company_filings(ticker)
                return {
                    'company': company,
                    'filings': filings
                }
        
        raise ValueError(f"Company {ticker} not found")
    
    def get_company_filings(self, ticker: str) -> List[Dict]:
        """Get recent filings for a company"""
        companies = self._get_companies()
        
        for company in companies.values():
            if company['ticker'] == ticker:
                cik = company['cik_str']
                filings_url = f"https://data.sec.gov/submissions/CIK{cik:010d}.json"
                
                response = requests.get(filings_url, headers=self.headers)
                if response.status_code == 200:
                    data = response.json()
                    recent = data['filings']['recent']
                    
                    filings = []
                    for i in range(min(10, len(recent['form']))):
                        filings.append({
                            'form': recent['form'][i],
                            'filingDate': recent['filingDate'][i],
                            'accessionNumber': recent['accessionNumber'][i]
                        })
                    return filings
        
        return []
    
    def _get_companies(self) -> Dict:
        response = requests.get(self.base_url, headers=self.headers)
        response.raise_for_status()
        return response.json()