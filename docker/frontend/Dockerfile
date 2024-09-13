FROM node:alpine

# Set working directory
WORKDIR /usr/app
COPY geoweb-client /usr/app


# Install PM2 globally
RUN npm install --global pm2
#RUN mkdir /usr/app/node_modules/.cache && chmod -R 777 /usr/app/node_modules/.cache

# Copy "package.json" and "package-lock.json" before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY ./package*.json ./

# Install dependencies
RUN npm install --production

# Copy all files
COPY ./ ./
RUN chown -R node /usr/app/node_modules
# Build app
RUN npm run build

# Expose the listening port
EXPOSE 3000

# Run container as non-root (unprivileged) user
# The "node" user is provided in the Node.js Alpine base image
USER node

# Launch app with PM2
CMD [ "pm2-runtime", "start", "npm", "--", "start" ]