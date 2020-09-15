# pull official base image
FROM node:12.18.1-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

ARG MONGODB_URL
ARG MONGODB_DATABASE
ARG HTTP_PORT
ARG ITEMS_PER_PAGE

ENV MONGODB_URL=$MONGODB_URL
ENV MONGODB_DATABASE=$MONGODB_DATABASE
ENV HTTP_PORT=$HTTP_PORT
ENV ITEMS_PER_PAGE=$ITEMS_PER_PAGE

# install app dependencies
COPY package.json ./
RUN yarn --silent
RUN npm install pm2 -g

# add app
COPY . ./
RUN yarn build

# start app
CMD ["pm2-runtime", "server.js"]
