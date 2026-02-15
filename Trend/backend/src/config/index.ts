import dotenv from 'dotenv';

dotenv.config();

interface Config {
    trendApiKey: string;
    trendBaseUrl: string;
    port: number;
}

function validateConfig(): Config {
    const apiKey = process.env.TREND_API_KEY;
    const baseUrl = process.env.TREND_BASE_URL || 'https://api.xdr.trendmicro.com';
    const port = parseInt(process.env.PORT || '3003', 10);

    if (!apiKey) {
        console.warn('⚠️  WARNING: TREND_API_KEY not set in .env file. Using placeholder value.');
        console.warn('⚠️  API calls will fail until you configure a valid API key.');
    }

    if (!process.env.TREND_BASE_URL) {
        console.warn(`⚠️  WARNING: TREND_BASE_URL not set. Using default: ${baseUrl}`);
    }

    return {
        trendApiKey: apiKey || 'demo_api_key_placeholder',
        trendBaseUrl: baseUrl,
        port,
    };
}

export const config = validateConfig();
