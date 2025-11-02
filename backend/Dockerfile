FROM node:20
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
# Build cache buster for password reset fix - force rebuild
CMD ["npm", "start"]