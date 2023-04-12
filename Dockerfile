FROM node:14-alpine
# Set environment variables
<<<<<<< Updated upstream
# ENV DEBUG=moviebunkers:info \
#     DOMAIN_NAME=localhost \
#     MONGODB_SERVER_STRING=mongodb://127.0.0.1:27017/moviebunkers \
#     HTTPS=false \
#     COOKIE_SECRET= \
#     JWT_SECRET=value \
#     CORS_ORIGINS=origins seperated by comas \
#     PORT=port\
#     NODE_ENV=env
WORKDIR /srv/moviebunkersAPI
=======
ENV DEBUG=moviebunkers:info \
    DOMAIN_NAME=localhost \
    MongoDB_SERVER_STRING=mongodb+srv://charanteja379:swordFish%40379@cluster1.lwi7smq.mongodb.net/moviebunkers?retryWrites=true&w=majority \
    HTTPS=false \
    COOKIE_SECRET=boom*!%^boom&shakalak! \
    JWT_SECRET=attention~2`everyBody&%4@nenu^vasthuna!be+ready \
    CORS_ORIGINS=http://localhost:3080,http://yourapp.com,http://192.168.0.101:3080,http://localhost:3001,https://dev.local:3080,https://localhost:3080 \
    PORT=3001\
    NODE_ENV=production
WORKDIR /srv/moviebunkers2.0.5

>>>>>>> Stashed changes
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]