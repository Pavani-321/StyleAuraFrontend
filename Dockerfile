# Use an official Node.js runtime as a parent image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json .

# Install all dependencies (including devDependencies)
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port Vite preview runs on
EXPOSE 5173

# Start the app using Vite preview
CMD ["npm", "run", "dev"]
