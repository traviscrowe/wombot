# Usage:
# docker build . --network=host -t some-useful-tag
# docker run --network=host some-useful-tag
#
FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
#COPY package.json .
# For npm@5 or later, copy package-lock.json as well
COPY package.json package-lock.json ./

RUN npm install

# Bundle app source
COPY . .

CMD [ "npm", "start" ]
