# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use npm ci when lockfile exists)
RUN if [ -f package-lock.json ]; then \
            npm ci --prefer-offline --no-audit; \
        else \
            npm install --prefer-offline --no-audit; \
        fi

# Copy source code
COPY . .

# Build with Vite (VITE_API_URL injected at build time)
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

# Remove default config and write custom nginx config
RUN rm /etc/nginx/conf.d/default.conf && \
  cat <<'EOF' > /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name _;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;
    gzip_proxied any;
    gzip_vary on;

    root /usr/share/nginx/html;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Cache static assets (js, css, images) for 1 year
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Don't cache index.html
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    # Route all requests to index.html for React Router
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
EOF

# Create entrypoint script for runtime environment variable substitution
RUN printf '#!/bin/ash\n# Substitute environment variables at runtime\nfind /usr/share/nginx/html -type f \\( -name "*.js" -o -name "*.html" \\) -exec sed -i "s|http://localhost:3000|${VITE_API_URL:-http://localhost:3000}|g" {} +\nexec "$@"\n' > /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start with entrypoint for env substitution
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
