# Stage 1: Build the Node.js application
FROM node:16 as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Create a lightweight image with Nginx to serve the built app
FROM nginx:latest

WORKDIR /usr/share/nginx/html

# Copy the built app from the previous stage
COPY --from=builder /app/dist .

# Expose the port Nginx will run on
EXPOSE 80

# Command to start Nginx
ENTRYPOINT  ["nginx", "-g", "daemon off;"]
