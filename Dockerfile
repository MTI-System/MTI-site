FROM node:20 AS base
WORKDIR /app
RUN npm i -g pnpm
COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .
RUN pnpm build
EXPOSE 3000

CMD ["pnpm", "start"]