# Use the official Node.js 20 image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy shared dependencies if they exist
COPY shared/ ./shared/

# Copy TypeScript configuration
COPY tsconfig.json ./

# Copy source code
COPY src/ ./src/

# Install dev dependencies for build
RUN npm ci

# Build the application
RUN npm run build

# Remove dev dependencies after build to reduce image size
RUN npm prune --production

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S botuser -u 1001

# Change ownership of the app directory
RUN chown -R botuser:nodejs /app
USER botuser

# Railway will handle health checks via HTTP requests to the /health endpoint
# No Docker HEALTHCHECK needed

# Start the application
CMD ["npm", "start"]
