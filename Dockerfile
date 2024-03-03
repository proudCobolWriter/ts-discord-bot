FROM node:17 as base

# Working directory
WORKDIR /usr/src/ts-discord-bot

# Copy package json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Run prettier
RUN npm run prettify:fix

# Copy src files
COPY . .

# Env variables
ENV NODE_OPTIONS=--no-warnings
ENV DOCKER_RUNNING=true

FROM base as production

# Env variables
ENV NODE_PATH=./dist
ENV NODE_ENV=production

# Build the bot
RUN npx tsc --build