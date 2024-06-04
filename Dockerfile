# Stage 1: Build the Angular application
FROM node:lts-alpine3.19 AS build

# Debug
RUN echo "Destroying Docker layers to check for caching bug"

WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies
RUN npm install -g npm@10.8.0 @angular/cli

# Copy all files
COPY . .

# Build the Angular app
RUN npm install && ng build gallowhead

# Stage 2: Serve the application with nginx
FROM nginx:1.25.4-alpine

RUN rm -rf /usr/share/nginx/html/*

# Copy the build output to the nginx html directory
COPY --from=build /usr/src/app/dist/gallowhead /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html/ && chmod -R 755 /usr/share/nginx/html/

# Copy custom nginx configuration if needed
COPY --from=build /usr/src/app/deploy/webserver/container/default.conf /etc/nginx/conf.d/default.conf