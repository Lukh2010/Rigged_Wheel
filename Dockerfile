# Use official Node.js runtime (LTS version)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files from rigged_wheel folder
COPY rigged_wheel/package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY rigged_wheel/ ./

# Expose port
EXPOSE 8000

# Start the application
CMD ["npm", "start"]