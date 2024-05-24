export const environment = {
  steamApiKey: process.env.STEAM_API ? process.env.STEAM_API : 'FBE6A5C249453A8516A55AAD5F87973F', // https://steamcommunity.com/dev/apikey
  ipstackApiKey: '', // https://ipstack.com/signup/free
  redis: {
    host: process.env.CACHE_HOST ? process.env.CACHE_HOST : 'localhost',
    auth_pass: process.env.CACHE_AUTH ? process.env.CACHE_AUTH : '38674516',
    port: process.env.CACHE_PORT ? parseInt(process.env.CACHE_PORT) : 6379
  },
  APM: {
    enabled: process.env.APM_ENABLED ? process.env.APM_ENABLED.toLocaleLowerCase() == 'yes' : true,
    SERVICE_NAME: process.env.APM_SERVICE_NAME ? process.env.APM_SERVICE_NAME : 'api-hub-dev',
    SERVER_URL: process.env.APM_SERVER_URL
      ? process.env.APM_SERVER_URL
      : 'http://192.168.0.11:8200',
    API_KEY: process.env.APM_API_KEY
      ? process.env.APM_API_KEY
      : '',
    LOGGING: process.env.APM_LOGGING ? process.env.APM_LOGGING as LogLevel : 'off',
  },
  secondsCacheUsers: process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL) : 604800, // 7 days of cache
}