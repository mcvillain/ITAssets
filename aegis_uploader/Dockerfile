FROM node:alpine
EXPOSE 3000
RUN apk add cifs-utils
RUN mkdir -p /mnt/uploads
COPY ./frontend /srv/frontend
WORKDIR /srv/frontend
RUN npm i
RUN npx vite build
COPY ./backend /srv/backend
RUN mv /srv/frontend/dist/ /srv/backend/public_html/
RUN rm -rf /srv/frontend
WORKDIR /srv/backend
COPY ./startup.sh /srv/backend/startup
RUN chmod +x /srv/backend/startup
RUN npm i
RUN npx tsc
CMD ["/srv/backend/startup"]