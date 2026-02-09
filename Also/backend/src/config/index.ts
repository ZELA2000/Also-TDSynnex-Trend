import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    alsoApi: {
        baseUrl: process.env.ALSO_API_BASE_URL || 'https://marketplacetest.ccpaas.net/SimpleAPI/SimpleAPIService.svc/rest',
        username: process.env.ALSO_API_USERNAME || '',
        password: process.env.ALSO_API_PASSWORD || '',
    },
    session: {
        timeoutMs: parseInt(process.env.SESSION_TIMEOUT_MS || '3600000', 10),
    },
};

export default config;
