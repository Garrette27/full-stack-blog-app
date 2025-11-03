FROM node:20 AS build
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
WORKDIR /build
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
# Verify Header.jsx contains Dashboard
RUN grep -q "Dashboard" src/components/Header.jsx || (echo "ERROR: Dashboard not found in Header.jsx" && exit 1)
RUN npm run build

FROM nginx AS final
WORKDIR /usr/share/nginx/html
COPY --from=build /build/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf