FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 3000

# Run the server
CMD ["yarn", "run", "dev"]
