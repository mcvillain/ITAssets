# Choose the Image which has Node installed already
FROM node:lts
EXPOSE 3000
# Fix SSL
#RUN apk --no-cache add ca-certificates \
#  && update-ca-certificates
# RUN apt-get -qq update && apt-get install sudo -y
# RUN sudo apt-get -q -y install git npm
WORKDIR /srv/
# ENV VERSION = RANDOM_NUM
# ENV FRONTEND_ORIGIN="https://itassets.aiscorp.com/"   
# RUN git clone https://github.com/mcvillain/ITAssets.git
COPY ./src /srv/upload_coordinator
WORKDIR /srv/upload_coordinator
COPY ./startup.sh /srv/backend/startup
RUN chmod +x /srv/backend/startup
RUN npm install
RUN npx tsc
CMD ["/srv/backend/startup"]
