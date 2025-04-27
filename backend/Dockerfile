# Use the official Node.js 22 image as the base image
FROM node:22

# Set the working directory inside the container
WORKDIR /backend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies (including devDependencies if needed)
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the backend port (adjust if different)
EXPOSE 5000

# Start the application (e.g. with nodemon in dev mode)
CMD ["npm", "start"]
