# Use Node.js 22 Alpine for better compatibility
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including devDependencies for tsx)
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 5173

# Start the application in development mode
CMD ["npm", "run", "dev"]
