FROM node:18-alpine

WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy rest of the code
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]