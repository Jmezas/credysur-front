FROM node:18-alpine as build-sep

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build --prod

#segunda

FROM nginx:1.17.1-alpine

COPY --from=build-sep /app/dist/credysur-front /usr/share/nginx/html

# Configurar Nginx para servir archivos estáticos
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d