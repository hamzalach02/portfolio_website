# Stage 1: Build the Next.js app
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .
COPY .env .env

# Build the Next.js app
RUN npm run build

# Stage 2: Run the Next.js app
FROM node:18-alpine AS runner

WORKDIR /app

# Install only production dependencies
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# Copy built assets and public directory from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Ensure directories for images exist
RUN mkdir -p /app/public/projectImages /app/public/uploads

# Expose the port the Next.js app runs on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "run", "start"]
