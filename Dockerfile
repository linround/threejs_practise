FROM node:18
COPY ./ /app
WORKDIR /app
RUN npm install
EXPOSE 4000

CMD ["npm","run","start"]
