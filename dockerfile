FROM node:20.17.0

WORKDIR /backend

COPY package.json package-lock.json ./
RUN npm install

COPY . ./

CMD ["npm", "run", "start"]

