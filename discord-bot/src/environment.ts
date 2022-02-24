export const environment = {
    discordToken: process.env.DC_TOKEN,
    discordClientID: process.env.DC_CLIENT_ID,
    redisHost: process.env.REDIS_HOST,
    redisPass: process.env.REDIS_PASS,
    redisPort: parseInt(process.env.REDIS_PORT),
    redirectURI: 'http://localhost'
}