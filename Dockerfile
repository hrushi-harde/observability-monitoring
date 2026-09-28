FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY --chown=node:node index.html style.css script.js server.js ./

USER node
EXPOSE 8080

CMD ["node", "server.js"]