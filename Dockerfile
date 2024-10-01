# Use official Node.js image as a base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first for dependency installation
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Pass build-time environment variables
# Using NEXT_PUBLIC_MONGODB_URL directly from the .env file through docker-compose
# No need to use ARG here unless you specifically need it for build-time variables
# ENV NEXT_PUBLIC_MONGODB_URL=$NEXT_PUBLIC_MONGODB_URL

# Build the application
RUN npm run build

# Expose port 3000 (the default Next.js port)
EXPOSE 8080

# Start the application
CMD ["npm", "run", "start"]

