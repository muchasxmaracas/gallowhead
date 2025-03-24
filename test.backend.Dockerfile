FROM node:18-alpine

ARG GOOGLE_SHEETS_API_KEY
ARG PORT="3000"
ARG FRONTEND_URL="http://test.gallowhead.com"

WORKDIR /app

# Copy only package.json and install dependencies first
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm install --only=production

# Copy backend source code (Make sure it includes server.ts or server.js)
COPY backend ./backend

RUN cd backend && npm ci && npm run build

# Set working directory
WORKDIR /app/backend

# Expose the API port
EXPOSE 3000

# Start the backend server
CMD ["node", "dist/server.js"]

HEALTHCHECK --interval=5m --timeout=3s \
  CMD curl -f http://test.api.gallowhead.com/api/health || exit 1