FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start:prod"]