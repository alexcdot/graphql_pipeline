FROM node:boron
WORKDIR /usr/src/app
COPY package.json package-lock.json ./

RUN npm install
# Bundle app source
COPY . .
# EXPOSE 4000
CMD ["npm", "start"]
