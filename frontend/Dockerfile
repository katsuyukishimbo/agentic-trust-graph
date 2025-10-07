FROM node:20-alpine

WORKDIR /app
COPY next-app/package*.json ./
RUN npm install

COPY next-app .
EXPOSE 3000
CMD ["npm", "run", "dev"]
