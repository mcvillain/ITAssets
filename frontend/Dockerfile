FROM httpd:alpine
EXPOSE 80
EXPOSE 443
# RUN apt-get -qq update && apt-get install sudo -y
# RUN sudo apt-get -q -y install git npm
RUN apk add curl
RUN apk add npm
# RUN sed -i 's/\# Controls who can get stuff from this server./FallbackResource \/index.html/g' /usr/local/apache2/conf/httpd.conf
COPY ./httpd.conf /usr/local/apache2/conf/httpd.conf
WORKDIR /srv/
# ENV VERSION = RANDOM_NUM 
# RUN git clone https://github.com/mcvillain/ITAssets.git
COPY ./webapp /srv/ITAssets
WORKDIR /srv/ITAssets/
COPY .env.production* /srv/ITAssets/
RUN printf "\nVITE_APP_VERSION='$(npm version patch)'" >> /srv/ITAssets/.env.production
# COPY .env.production.local /srv/ITAssets/frontend/.env.production.local
RUN npm install && npm install axios && npm install vue-router@4 && npm install vue-router && npm run build
RUN mv /srv/ITAssets/dist/* /usr/local/apache2/htdocs/
RUN rm -Rf /srv/ITAssets
VOLUME [ "/srv/ssl/fullchain.pem", "/srv/ssl/privkey.pem" ]
WORKDIR /usr/local/apache2/htdocs/