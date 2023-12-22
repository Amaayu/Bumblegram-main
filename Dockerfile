# Step 1: Node.js image
FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8888

CMD [ "node", "app.js" ]

# Step 2: Nginx image
FROM nginx

COPY default.conf /etc/nginx/conf.d/
ENTRYPOINT ["nginx", "-g", "daemon off;"]