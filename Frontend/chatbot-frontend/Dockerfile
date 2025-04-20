# Use Node to build the React app
FROM node:18 as build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Use Nginx to serve the static files
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

