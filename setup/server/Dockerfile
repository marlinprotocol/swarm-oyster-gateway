# FROM node:lts-bullseye-slim as base

# WORKDIR /app

# COPY . .

# RUN npm ci

# RUN npm run build

# FROM node:lts-bullseye-slim

# WORKDIR /app
# COPY --from=base --chown=nobody:nogroup /app/dist dist
# COPY --from=base --chown=nobody:nogroup /app/public public
# COPY --from=base --chown=nobody:nogroup /app/node_modules node_modules
# USER nobody
# EXPOSE 3000

# ENTRYPOINT [ "node", "dist/app.js"]


# Use node:14-alpine as the base image
FROM node:14-alpine

# Install pkg and webpack globally
RUN npm install -g pkg webpack webpack-cli

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the rest of the application code
COPY . .

# Use webpack to bundle the app
RUN npx webpack --config webpack.config.js --mode production

# Package the app into a standalone executable using pkg
RUN pkg -t node14-alpine dist/bundle.js --output /usr/src/app/app-executable

# Expose the necessary port (8080 in this case)
EXPOSE 8080

# Run the generated executable directly
CMD ["/usr/src/app/app-executable"]