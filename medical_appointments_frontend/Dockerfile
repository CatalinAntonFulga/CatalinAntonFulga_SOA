FROM node:current-alpine3.19

WORKDIR /app/

COPY public/ /app/public
COPY src/ /app/src
COPY package.json /app/

RUN npm install

CMD ["npm", "start"]