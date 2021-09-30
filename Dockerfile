FROM node:16.9.1

# Install dependencies
WORKDIR /opt/app
COPY package*.json ./
RUN yarn install

# Bundle app source
COPY . .

EXPOSE 3000

CMD node ./bin/www
