# build environment (pin to current LTS to avoid breaking CLI deps)
FROM node:24-slim AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run-script build

# production environment
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html