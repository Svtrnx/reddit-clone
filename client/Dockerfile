FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN yarn install

COPY . .

RUN yarn run build

EXPOSE 5173

CMD ["yarn", "run", "dev"]