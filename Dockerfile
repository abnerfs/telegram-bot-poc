FROM node:16

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

# ENV PORT 8092

# EXPOSE 8092

CMD ["npm", "start"]

