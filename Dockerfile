# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY nx.json ./
COPY apps/tms-frontend/package.json ./apps/tms-frontend/
COPY apps/tms-backend/package.json ./apps/tms-backend/

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN cd apps/tms-frontend && \
    npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist/apps/tms-frontend /usr/share/nginx/html

# Copy nginx configuration
COPY apps/tms-frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]