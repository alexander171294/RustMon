### STAGE 1: Build ###
FROM node:16.10-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run buildprod

### STAGE 2: Run ###
FROM nginx
COPY --from=build /usr/src/app/dist/rustmon /usr/share/nginx/html
COPY --from=build /usr/src/app/nginx.default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
