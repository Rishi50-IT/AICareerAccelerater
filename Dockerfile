# Stage 1: Build Frontend React SPA
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Production Application Container
FROM node:20-alpine
WORKDIR /usr/src/app

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ ./src/

# Copy built frontend assets to be served by Express / static fallback
COPY --from=frontend-builder /app/frontend/dist ./public

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "src/server.js"]
