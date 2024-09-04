# Choose the Image which has Node installed already
FROM node:lts
EXPOSE 3000
# Fix SSL
#RUN apk --no-cache add ca-certificates \
#  && update-ca-certificates
# RUN apt-get -qq update && apt-get install sudo -y
# RUN sudo apt-get -q -y install git npm
#RUN apk add curl
RUN sudo apt-get -qq update && apt-get install -y curl
WORKDIR /srv/
# ENV VERSION = RANDOM_NUM
# ENV FRONTEND_ORIGIN="https://itassets.aiscorp.com/"   
# RUN git clone https://github.com/mcvillain/ITAssets.git
COPY ./src /srv/ITAssets
WORKDIR /srv/ITAssets
COPY ./startup.sh /srv/backend/startup
RUN chmod +x /srv/backend/startup
RUN npm install
RUN npm install -D typescript
RUN npx tsc
CMD ["/srv/backend/startup"]
