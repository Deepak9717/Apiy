# Use Node.js 22
FROM node:22

# Create working directory inside container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy entire project
COPY . .

# Next.js runs on port 3000
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]