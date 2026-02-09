import dotenv from 'dotenv';

dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    logLevel: string;
    also: {
        baseUrl: string;
        username: string;
        password: string;
    };
    tdsynnex: {
        baseUrl: string;
        refreshToken: string;
        accountId: string;
    };
    trend: {
        baseUrl: string;
        apiKey: string;
    };
}

const config: Config = {
    port: parseInt(process.env.PORT || '4000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
    also: {
        baseUrl: process.env.ALSO_API_BASE_URL || 'http://localhost:3001',
        username: process.env.ALSO_API_USERNAME || '',
        password: process.env.ALSO_API_PASSWORD || '',
    },
    tdsynnex: {
        baseUrl: process.env.TDSYNNEX_API_BASE_URL || 'http://localhost:3002',
        refreshToken: process.env.TDSYNNEX_REFRESH_TOKEN || '',
        accountId: process.env.TDSYNNEX_ACCOUNT_ID || '',
    },
    trend: {
        baseUrl: process.env.TREND_API_BASE_URL || 'http://localhost:3003',
        apiKey: process.env.TREND_API_KEY || '',
    },
};

export default config;
