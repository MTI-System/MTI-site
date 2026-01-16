FROM node:20 AS base
WORKDIR /app
RUN npm i -g pnpm
COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

ARG NEXT_PUBLIC_IS_ON_DEV
ENV NEXT_PUBLIC_IS_ON_DEV=$NEXT_PUBLIC_IS_ON_DEV

RUN pnpm build
EXPOSE 3000

CMD ["pnpm", "start"]