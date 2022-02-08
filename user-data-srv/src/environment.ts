export const environment = {
  steamApiKey: process.env.STEAM_API ? process.env.STEAM_API : 'FBE6A5C249453A8516A55AAD5F87973F', // https://steamcommunity.com/dev/apikey
  ipstackApiKey: '', // https://ipstack.com/signup/free
  redis: {
    host: process.env.CACHE_HOST ? process.env.CACHE_HOST : 'srv-captain--redistest',
    auth_pass: process.env.CACHE_AUTH ? process.env.CACHE_AUTH : '38674516',
    port: process.env.CACHE_PORT ? parseInt(process.env.CACHE_PORT) : 6379
  },
  secondsCacheUsers: process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL) : 604800, // 7 days of cache
}