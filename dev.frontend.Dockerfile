# Stage 1: Build Angular App
FROM node:18 AS build

WORKDIR /app

# Copy Angular dependencies and install
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN cd frontend && npm install

# Copy Angular code and build
COPY frontend ./frontend
RUN cd frontend && npm run build --prod

# Stage 2: Serve Angular with Nginx
FROM nginx:alpine

# Copy built Angular files to Nginx web root
COPY --from=build /app/frontend/dist/gallowhead /usr/share/nginx/html

# Copy custom Nginx config
COPY deploy/webserver/default-dev.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
