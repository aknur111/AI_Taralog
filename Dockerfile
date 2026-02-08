FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY client/package*.json ./client/

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
