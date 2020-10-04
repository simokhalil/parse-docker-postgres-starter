FROM node:12
RUN npm install -g nodemon
RUN mkdir -p /usr/src/parse
COPY . /usr/src/parse
WORKDIR /usr/src/parse
RUN npm install
EXPOSE 1337
CMD [ "npm", "start" ]
