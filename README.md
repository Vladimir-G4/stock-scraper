# Stock-Scraper
<img class="giphy-gif-img giphy-img-loaded" src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXFub2JzZThzbW1pZGpiajk3aGs4OTdseGZsbnJpMGE0c3R2dDJxeSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WDE4UjuhQSWh0GiHQZ/giphy.gif" width="30%" height="30%">

## Overview
`stock-scraper` is a Node.js (TS) npm package that provides an API to fetch comprehensive stock data by scraping information from TradingView. It offers a straightforward way to retrieve essential financial metrics, upcoming earnings details, company information, and price performance for any publicly traded company.

## Installation

Install my-project with npm

```bash
npm install stock-scraper
```
    
## API


#### Get Stock Data

```typescript
getStockData(ticker: string): Promise<StockData>
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `ticker` | `string` | **Required**. Stock Ticker |

Fetches stock data including upcoming earnings, key statistics, company information, and price performance for the given ticker.


## Usage/Examples

```typescript
import { getStockData } from 'stock-scraper';

getStockData('AAPL').then(data => 
    console.log(data)
) 

//Prints the following:

{
    "UpcomingEarnings": {
        "nextReportDate": "07/15/2024",
        "reportPeriod": "Q2 2024",
        "epsEstimate": "2.45",
        "revenueEstimate": "5.60 B"
    },
    "KeyStats": {
        "marketCap": "2.5T",
        "dividendYield": "1.23%",
        "peRatio": "28.45",
        "basicEPS": "7.25",
        "netIncome": "63.90 B",
        "revenue": "320.58 B",
        "sharesFloat": "4.31 B"
    },
    "About": {
        "sector": "Technology",
        "industry": "Consumer Electronics",
        "ceo": "Tim Cook",
        "website": "https://www.apple.com",
        "headquarters": "Cupertino, CA",
        "employees": "154,000",
        "founded": "April 1, 1976",
        "description": "Apple Inc. designs, manufactures, and markets smartphones, personal computers, and other consumer electronics."
    },
    "Price": {
        "currentPrice": "1450.25",
        "perf1M": "+5.32%",
        "perf5D": "-1.20%",
        "perf5Y": "+213.45%",
        "perf6M": "+15.70%",
        "perfAll": "+512.80%",
        "perfY": "+38.90%",
        "perfYTD": "+12.60%",
        "change1D": "-0.50%"
    }
}


```

