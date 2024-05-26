# RustMon 1.5.9

Rust game admin tool for servers (RustMonitor) 

## Screenshots:

### Login

![Login](https://i.imgur.com/1mitLwe.png)

### Dashboard

![dashboard](https://i.imgur.com/d0u2uOa.png)

### Server configurations

![config server](https://i.imgur.com/4eBmGje.png)

![config map](https://i.imgur.com/sH392gF.png)

### Player details and search

![player details](https://i.imgur.com/8oUQXug.png)

### Player tools

![player tools](https://i.imgur.com/nptYGlO.png)

### Plugin manager

![plugin manager](https://i.imgur.com/8qNMET3.png)

### Permissions manager
![permissions manager](https://i.imgur.com/bo3G41h.png)

## Run and build

Install dependencies:

`npm i`

Run local dev mode:

`ng serve`

Build redist package:

`ng build --prod`

or if you don't have angular installed

`npm run buildprod`

# run with docker in server:

## Dashboard:

```
docker run -p 80:80 -itd alexander171294/rustmon:latest
```

Or see live instance in:

[rustmon.tercerpiso.net](https://rustmon.tercerpiso.net)

## Backend Service:

Api for get steam-profile, api-geolocalization, rustmap info:

First, in order to use your custom served api, you need to edit environment.prod.ts and change `http://rustmon-udata.tercerpiso.tech/` for your endpoint and rebuild docker image, or run ng build again with your changes.

Second, you need to start a redis service (it is used for cache user data).

Third, you need to run our docker image of rustmon-service with your api key and environments and expose in your endpoint:

```
docker run -p 80:3000 -e STEAM_API="YOUR-STEAM-API-KEY" -e CACHE_HOST="YOUR-REDIS-HOST" -e CACHE_AUTH="YOUR-REDIS-PASSWORD" -e CACHE_PORT="YOUR-REDIS-PORT" -itd alexander171294/rustmon-service:latest
```

### How to get my steam api key?

[See steam api key documentation](https://steamcommunity.com/dev/apikey)
