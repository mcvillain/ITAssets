# Choose the Image which has Node installed already
FROM node:alpine
EXPOSE 3000
# RUN apt-get -qq update && apt-get install sudo -y
# RUN sudo apt-get -q -y install git npm
WORKDIR /srv/
# ENV VERSION = RANDOM_NUM
# ENV FRONTEND_ORIGIN="https://itassets.aiscorp.com/"   
# RUN git clone https://github.com/mcvillain/ITAssets.git
COPY ./src /srv/upload_coordinator
WORKDIR /srv/upload_coordinator
RUN npm install
RUN npx tsc
CMD ["node", "index.js"]

