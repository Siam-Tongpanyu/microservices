FROM node:8

RUN mkdir -p /opt/app

# copy in our source code last, as it changes the most
WORKDIR /opt/app
COPY . /opt/app

# install dependencies first, in a different location for easier app bind mounting for local development
RUN npm install && npm cache clean --force

CMD npm run dev