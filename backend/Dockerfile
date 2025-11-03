FROM node:20
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
# Cache buster - force rebuild: password reset email fix v2 (2025-11-02)
RUN echo "Build timestamp: $(date)" > /tmp/build-info.txt
CMD ["npm", "start"]