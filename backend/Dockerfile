# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Build stage for TypeScript
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Runtime image
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copy node_modules from base and compiled dist from build
COPY --from=base /app/node_modules ./node_modules
COPY package*.json ./
COPY --from=build /app/dist ./dist

# Ensure uploads directory exists (mounted as volume at runtime)
RUN mkdir -p uploads

EXPOSE 5000
CMD ["node", "dist/server.js"]