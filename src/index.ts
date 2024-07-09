import axios from 'axios';
import cheerio from 'cheerio';


export interface EarningsData {
    nextReportDate: string | null;
    reportPeriod: string | null;
    epsEstimate: string | null;
    revenueEstimate: string | null;
}

export interface KeyStats {
    marketCap: string | null;
    dividendYield: string | null;
    peRatio: string | null;
    basicEPS: string | null;
    netIncome: string | null;
    revenue: string | null;
    sharesFloat: string | null;
}

export interface About {
    sector: string | null;
    industry: string | null;
    ceo: string | null;
    website: string | null;
    headquarters: string | null;
    employees: string | null;
    founded: string | null;
    description: string | null;
}

export interface Price {
    currentPrice: string | null;
    perf1M: string | null;
    perf5D: string | null;
    perf5Y: string | null;
    perf6M: string | null;
    perfAll: string | null;
    perfY: string | null;
    perfYTD: string | null;
    change1D: string | null;
}

export interface StockData {
    UpcomingEarnings: EarningsData;
    KeyStats: KeyStats;
    About: About;
    Price: Price;
}

export async function getStockData(ticker: string): Promise<StockData> {
    
    const url = ('https://corsproxy.io/?' + encodeURIComponent(`https://tradingview.com/symbols/${ticker.toUpperCase()}`));

    console.log(url)

    try {
        const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = cheerio.load(data);

        const EarningsData: EarningsData = getEarningsData($);
        const KeyStats: KeyStats = getKeyStats($);
        const About: About = getCompanyInfo($);
        const Price: Price = getPricePerformance($);

        return { 
            UpcomingEarnings: EarningsData,
            KeyStats,
            About,
            Price
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return getDefaultStockData();
    }
}


function getEarningsData($: cheerio.Root): EarningsData {

    const jsonRegex = /"earnings_release_next_date_fq":(\d+\.?\d*),"earnings_publication_type_next_fq":(\d+),"next_earnings_fiscal_period_fq":"([\w-]+)","earnings_per_share_forecast_next_fq":(\d+\.?\d*),"revenue_forecast_next_fq":(\d+\.?\d*)/;
    const match = jsonRegex.exec($.html());

    const EarningsData: EarningsData = {
        nextReportDate: match ? new Date(parseFloat(match[1]) * 1000).toLocaleDateString() : null,
        reportPeriod: match ? match[3] : null,
        epsEstimate: match ? parseFloat(match[4]).toFixed(2) : null,
        revenueEstimate: match ? (parseFloat(match[5]) / 1e9).toFixed(2) + ' B' : null
    };

    return EarningsData;
}


function getKeyStats($: cheerio.Root): KeyStats {

    const keyStatsDiv = $('[data-container-name="key-stats-id"]');
    const KeyStats: KeyStats = {
        marketCap: null,
        dividendYield: null,
        peRatio: null,
        basicEPS: null,
        netIncome: null,
        revenue: null,
        sharesFloat: null
    };

    keyStatsDiv.find('.block-GgmpMpKr').each((i, el) => {
        const label = $(el).find('.label-GgmpMpKr').text().trim();
        const value = $(el).find('.value-GgmpMpKr').text().trim().replace(/\s*USD/g, '');

        switch (label) {
            case 'Market capitalization':
                KeyStats.marketCap = value;
                break;
            case 'Dividend yield (indicated)':
                KeyStats.dividendYield = value;
                break;
            case 'Price to earnings Ratio (TTM)':
                KeyStats.peRatio = value;
                break;
            case 'Basic EPS (TTM)':
                KeyStats.basicEPS = value;
                break;
            case 'Net income (FY)':
                KeyStats.netIncome = value;
                break;
            case 'Revenue (FY)':
                KeyStats.revenue = value;
                break;
            case 'Shares float':
                KeyStats.sharesFloat = value;
                break;
        }
    });

    return KeyStats;
}


function getCompanyInfo($: cheerio.Root): About {

    const companyInfoDiv = $('[data-container-name="company-info-id"]');
    const About: About = {
        sector: null,
        industry: null,
        ceo: null,
        website: null,
        headquarters: null,
        employees: null,
        founded: null,
        description: $('.container-OkHxJmnJ .content-OkHxJmnJ span').text().trim()
    };

    companyInfoDiv.find('.block-GgmpMpKr').each((i, el) => {
        const label = $(el).find('.label-GgmpMpKr').text().trim();
        const value = $(el).find('.value-GgmpMpKr').text().trim().replace(/\s*USD/g, '');

        switch (label) {
            case 'Sector':
                About.sector = value;
                break;
            case 'Industry':
                About.industry = value;
                break;
            case 'CEO':
                About.ceo = value;
                break;
            case 'Website':
                About.website = value;
                break;
            case 'Headquarters':
                About.headquarters = value;
                break;
            case 'Employees (FY)':
                About.employees = value;
                break;
            case 'Founded':
                About.founded = value;
                break;
        }
    });

    return About;
}


function getPricePerformance($: cheerio.Root): Price {

    const jsonRegex = /"symbol_screener_data":\{"Perf\.1M":(\d+\.?\d*),"Perf\.5D":(\d+\.?\d*),"Perf\.5Y":(\d+\.?\d*),"Perf\.6M":(\d+\.?\d*),"Perf\.All":(\d+\.?\d*),"Perf\.Y":(\d+\.?\d*),"Perf\.YTD":(\d+\.?\d*),"change":(\d+\.?\d*)/;
    const match = jsonRegex.exec($.html());

    const formatPercentage = (value: string | null): string | null => {
        if (value !== null) {
            return ( (parseFloat(value).toFixed(2)).toString() + '%' );
        }
        return null;
    };

    const jsonRegexCurrentPrice = /{"name":"daily_bar_close","source":"django_model","value":(\d+\.?\d*)}/;

    return {
        currentPrice: jsonRegexCurrentPrice.exec($.html()) ? jsonRegexCurrentPrice.exec($.html())![1] : null,
        perf1M: match ? formatPercentage(match[1]) : null,
        perf5D: match ? formatPercentage(match[2]) : null,
        perf5Y: match ? formatPercentage(match[3]) : null,
        perf6M: match ? formatPercentage(match[4]) : null,
        perfAll: match ? formatPercentage(match[5]) : null,
        perfY: match ? formatPercentage(match[6]) : null,
        perfYTD: match ? formatPercentage(match[7]) : null,
        change1D: match ? formatPercentage(match[8]) : null
    };
}


function getDefaultStockData(): StockData {

    return {
        Price: {
            currentPrice: null,
            perf1M: null,
            perf5D: null,
            perf5Y: null,
            perf6M: null,
            perfAll: null,
            perfY: null,
            perfYTD: null,
            change1D: null
        },
        UpcomingEarnings: {
            nextReportDate: null,
            reportPeriod: null,
            epsEstimate: null,
            revenueEstimate: null,
        },
        KeyStats: {
            marketCap: null,
            dividendYield: null,
            peRatio: null,
            basicEPS: null,
            netIncome: null,
            revenue: null,
            sharesFloat: null
        },
        About: {
            sector: null,
            industry: null,
            ceo: null,
            website: null,
            headquarters: null,
            employees: null,
            founded: null,
            description: null
        }
    };
}