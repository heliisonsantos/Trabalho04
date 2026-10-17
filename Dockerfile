
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY src ./src
COPY public ./public
COPY docker ./docker

RUN npx prisma generate

ENV NODE_ENV=production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

USER appuser

EXPOSE 3000

CMD ["sh", "./docker/iniciar.sh"]
