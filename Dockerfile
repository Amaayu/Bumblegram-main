# Stage 1: Build the Node.js application
FROM node:16 as builder

WORKDIR /usr/src/app

COPY ./package*.json ./
RUN npm install

COPY ./ ./
EXPOSE 8888
CMD ["node", "app.js"]

# Stage 2: Create a lightweight image with Nginx and copy configuration
FROM nginx

COPY ./default.conf /etc/nginx/conf.d/

# Expose port 80 from the Nginx stage (optional, depends on your requirements)
EXPOSE 2023

# Set the entry point to start Nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]
