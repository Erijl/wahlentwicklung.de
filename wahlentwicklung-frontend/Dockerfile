FROM node:16 as nodeBuilder
LABEL authors="Erijl"

RUN mkdir /frontend
WORKDIR /frontend

RUN npm install -g @angular/cli

COPY package*.json ./

RUN npm ci
COPY . .

RUN npm run build --prod

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=nodeBuilder /frontend/dist/wahlentwicklung-frontend /usr/share/nginx/html

ENV PORT=443
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
