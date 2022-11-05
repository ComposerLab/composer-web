FROM node:16.14.2-alpine

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn set version berry

RUN yarn

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]