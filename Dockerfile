FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
RUN npm i -g sequelize-cli
COPY . .
EXPOSE 5003
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
