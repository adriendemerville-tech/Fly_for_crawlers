FROM mcr.microsoft.com/playwright:v1.52.0-noble
WORKDIR /app
RUN npm init -y && npm i playwright-core express
COPY server.js .
EXPOSE 3000
CMD ["node", "server.js"]
