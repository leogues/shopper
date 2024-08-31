FROM node:20.17.0 as builder

WORKDIR /backend

COPY package.json package-lock.json ./
RUN npm install

COPY . ./

RUN npm install -g typescript

CMD ["npm", "run", "start"]

