FROM node:14-alpine
RUN apk add tzdata
ENV TZ=Asia/Bangkok
WORKDIR /app
COPY . ./
COPY .env ./.env
RUN npm install
EXPOSE 8080
CMD npm start
