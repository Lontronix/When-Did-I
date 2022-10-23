FROM docker.io/node:18-bullseye

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# Now, we have an `out` folder! Let's tell the image what to run
# when we start the container
CMD ["node", "out/index.js"]