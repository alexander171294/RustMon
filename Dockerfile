### STAGE 1: Build ###
FROM node:12.7-alpine AS build
WORKDIR /usr/src/app
COPY ./rustmon/package.json package-lock.json ./
RUN npm install
COPY ./rustmon/. .
RUN npm run buildprod

### STAGE 2: Run ###
FROM nginx
COPY --from=build /usr/src/app/dist/rustmon /usr/share/nginx/html
COPY --from=build /usr/src/app/nginx.default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
