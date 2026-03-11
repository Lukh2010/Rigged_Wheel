# Use official Node.js runtime
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY rigged_wheel/package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY rigged_wheel/ ./

# Expose port
EXPOSE 8000

# Start the application
CMD ["npm", "start"]