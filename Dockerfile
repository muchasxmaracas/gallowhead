FROM node:lts-alpine3.19 AS build

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install -g @angular/cli && npm install && ng build gallowhead && npm run build --prod

FROM nginx:1.25.4 AS runtime

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /usr/src/app/dist/gallowhead/ /usr/share/nginx/html/
COPY --from=build /usr/src/app/deploy/webserver/container/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 4200

USER web