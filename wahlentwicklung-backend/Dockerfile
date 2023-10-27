FROM node:16
LABEL authors="Erijl"

RUN mkdir /backend
WORKDIR /backend

COPY package*.json ./

RUN npm ci

COPY . .

ENV PORT=8082

EXPOSE 8082

CMD ["npm", "run", "start"]