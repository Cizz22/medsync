# Use an official Node.js runtime as a parent image
FROM oven/bun:1

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package.json bun.lockb ./

# Install the dependencies
RUN bun install

# Copy the rest of the application files to the container
COPY . .

# Expose the port that your Next.js app runs on
EXPOSE 3000


