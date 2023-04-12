FROM node:latest
# Set environment variables
ENV DEBUG=moviebunkers:info \
    DOMAIN_NAME=localhost \
    MongoDB_SERVER_STRING=mongodb://127.0.0.1:27017/moviebunkers \
    HTTPS=false \
    COOKIE_value \
    JWT_SECRET=value \
    CORS_ORIGINS=origins seperated by comas \
    PORT=port\
    NODE_ENV=env
WORKDIR /srv/moviebunkersAPI
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
RUN npm start