FROM node:10

WORKDIR /keeper

COPY package.json /keeper
COPY yarn.lock /keeper
RUN yarn install 

COPY . /keeper

CMD yarn start

EXPOSE 8888