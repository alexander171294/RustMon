FROM node:14-alpine
WORKDIR /app
COPY . .
RUN npm i
RUn npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]