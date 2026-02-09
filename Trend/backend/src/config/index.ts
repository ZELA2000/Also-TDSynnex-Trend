import dotenv from 'dotenv';

dotenv.config();

interface Config {
    trendApiKey: string;
    trendBaseUrl: string;
    port: number;
}

function validateConfig(): Config {
    const apiKey = process.env.TREND_API_KEY;
    const baseUrl = process.env.TREND_BASE_URL;
    const port = parseInt(process.env.PORT || '3000', 10);

    if (!apiKey) {
        throw new Error('TREND_API_KEY is required in .env file');
    }

    if (!baseUrl) {
        throw new Error('TREND_BASE_URL is required in .env file');
    }

    return {
        trendApiKey: apiKey,
        trendBaseUrl: baseUrl,
        port,
    };
}

export const config = validateConfig();
