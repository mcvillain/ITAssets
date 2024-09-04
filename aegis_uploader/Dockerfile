FROM node:lts
EXPOSE 3000
# Fix SSL
#RUN apk --no-cache add ca-certificates \
#  && update-ca-certificates
# Add SMB Client
#RUN apk add cifs-utils
RUN apt-get -qq update && apt-get install -y cifs-utils
RUN mkdir -p /mnt/uploads
# Build the frontend
COPY ./frontend /srv/frontend
WORKDIR /srv/frontend
RUN npm i
RUN npx vite build
# Move the compiled frontend into position and build the backend
COPY ./backend /srv/backend
RUN mv /srv/frontend/dist/ /srv/backend/public_html/
RUN rm -rf /srv/frontend
WORKDIR /srv/backend
# Set startup.sh as the entrypoint so the SMB share is mounted correctly at startup
COPY ./startup.sh /srv/backend/startup
RUN chmod +x /srv/backend/startup
RUN npm i
RUN npx tsc
CMD ["/srv/backend/startup"]