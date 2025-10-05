FROM node:22.10.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install --save-dev nodemon

COPY . .

EXPOSE 4000

CMD ["npx", "nodemon", "app.js"]
