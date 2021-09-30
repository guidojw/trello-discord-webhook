FROM node:14.15.0

# Install dependencies
WORKDIR /opt/app
COPY package*.json ./
RUN yarn install

# Bundle app source
COPY . .

EXPOSE 3000

CMD node ./bin/www
