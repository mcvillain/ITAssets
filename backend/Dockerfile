# Choose the Image which has Node installed already
FROM node:alpine
EXPOSE 3000
# RUN apt-get -qq update && apt-get install sudo -y
# RUN sudo apt-get -q -y install git npm
RUN apk add curl
WORKDIR /srv/
# ENV VERSION = RANDOM_NUM
# ENV FRONTEND_ORIGIN="https://itassets.aiscorp.com/"   
# RUN git clone https://github.com/mcvillain/ITAssets.git
COPY ./src /srv/ITAssets
WORKDIR /srv/ITAssets
RUN npm install
RUN npm install -D typescript
RUN npx tsc
CMD ["node", "index.js"]

