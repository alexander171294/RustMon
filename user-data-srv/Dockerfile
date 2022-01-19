FROM node:14-alpine
WORKDIR /app
COPY . .
RUN npm i
RUn npm run build
# EXPOSE 8181
CMD ["npm", "run", "start:prod"]