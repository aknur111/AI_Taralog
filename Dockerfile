FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install --ignore-scripts

RUN cd client && npm install

RUN cd client && npm run build

EXPOSE 3000

CMD ["npm", "start"]
