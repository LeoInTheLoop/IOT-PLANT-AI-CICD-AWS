# FROM node:18-alpine as build
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

RUN npm install

COPY . .

COPY .env.production .env

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]