FROM node:14-alpine
# Set environment variables
# ENV DEBUG=moviebunkers:info \
#     DOMAIN_NAME=localhost \
#     MONGODB_SERVER_STRING=VALUE \
#     HTTPS=false \
#     COOKIE_SECRET=VALUE \
#     JWT_SECRET=VALUE \
#     CORS_ORIGINS=http://localhost:3080,http://yourapp.com,http://192.168.0.101:3080,http://localhost:3001,https://dev.local:3080,https://localhost:3080 \
#     PORT=3001\
#     NODE_ENV=production
WORKDIR /srv/moviebunkers
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]