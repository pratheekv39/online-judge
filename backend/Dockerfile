FROM node:18

# Install g++ compiler for C++ code execution
RUN apt-get update && apt-get install -y \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create a non-root user for security (use different UID if 1000 exists)
RUN useradd -m -u 1001 appuser || useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"] 