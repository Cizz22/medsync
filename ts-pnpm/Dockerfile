# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port that your Next.js app runs on
EXPOSE 3000

# Command to run the Next.js application
CMD ["npm", "start"]
