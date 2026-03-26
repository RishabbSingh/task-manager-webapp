# Stage 1 — Build React app
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install && chmod -R 755 node_modules/.bin

COPY . .
RUN node node_modules/vite/bin/vite.js build

# Stage 2 — Serve with Nginx
FROM nginx:alpine

# Copy built React files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]