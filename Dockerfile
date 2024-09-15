FROM node:18-alpine AS builder

WORKDIR /app


COPY . .


RUN npm ci


# Build the Next.js app
RUN npm run build

# Expose the port that the Next.js app runs on
EXPOSE 3000

# Run Prisma migrations before starting the app
CMD ["npm", "run", "start"]

