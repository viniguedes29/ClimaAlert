// List of required environment variables
const requiredEnvs = ['OPEN_WEATHER_API_KEY', 'CLIMAALERT_APP_PORT'];

const config = {};

requiredEnvs.forEach((env) => {
    if (!process.env[env]) {
        console.error(`Environment variable ${env} is missing`);
        process.exit(1);
    }
    const key = env.startsWith('CLIMAALERT_') ? env.replace('CLIMAALERT_', '') : env;
    config[key] = process.env[env];
});

module.exports = config;

