FROM httpd:latest
EXPOSE 80
RUN apt-get -qq update && apt-get install sudo -y
RUN sudo apt-get -q -y install git npm
RUN sed -i 's/\# Controls who can get stuff from this server./FallbackResource \/index.html/g' /usr/local/apache2/conf/httpd.conf
WORKDIR /srv/
ENV VERSION = RANDOM_NUM 
RUN git clone https://github.com/mcvillain/ITAssets.git
WORKDIR /srv/ITAssets/frontend/
RUN npm install && npm install axios && npm install vue-router@4 && npm install vue-router && npm run build
RUN mv /srv/ITAssets/frontend/dist/* /usr/local/apache2/htdocs/
WORKDIR /usr/local/apache2/htdocs/