FROM node:20
ARG BUILD_TIMESTAMP
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
# Cache buster - force rebuild: password reset email fix v2 (2025-11-02)
# BUILD_TIMESTAMP: ${BUILD_TIMESTAMP}
RUN echo "Build timestamp: ${BUILD_TIMESTAMP}" > /tmp/build-info.txt
CMD ["npm", "start"]