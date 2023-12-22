# Step 1: Node.js image
FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8888

ENTRYPOINT [ "node", "app.js" ]

