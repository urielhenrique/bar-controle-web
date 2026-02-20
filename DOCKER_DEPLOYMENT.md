# Docker Deployment

## Build and Run Locally

### Build image

```bash
docker build -t bar-controle-web:latest --build-arg VITE_API_URL=http://localhost:3000 .
```

### Run container

```bash
docker run -p 80:80 bar-controle-web:latest
```

Access at `http://localhost`

---

## Production Deployment

### Build for production

```bash
docker build \
  -t bar-controle-web:latest \
  --build-arg VITE_API_URL=https://api.yourdomain.com \
  .
```

### Push to registry

```bash
docker tag bar-controle-web:latest your-registry/bar-controle-web:latest
docker push your-registry/bar-controle-web:latest
```

### Run in production

```bash
docker run \
  -d \
  -p 80:80 \
  -p 443:443 \
  -e VIRTUAL_HOST=yourdomain.com \
  --restart unless-stopped \
  your-registry/bar-controle-web:latest
```

---

## Docker Compose (Optional)

Create `docker-compose.yml`:

```yaml
version: "3.8"

services:
  app:
    build:
      context: .
      args:
        VITE_API_URL: http://localhost:3000
    ports:
      - "80:80"
    restart: unless-stopped
    healthcheck:
      test:
        ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 5s
```

Run with:

```bash
docker-compose up -d
```

---

## Features

✅ **Multi-stage build** - Minimal final image size  
✅ **Alpine Linux** - Node 20 and Nginx on Alpine for smaller footprint  
✅ **Gzip compression** - Automatic compression of static assets  
✅ **Security headers** - X-Frame-Options, X-Content-Type-Options, etc.  
✅ **Cache optimization** - 1-year cache for static assets, no-cache for index.html  
✅ **React Router support** - All routes redirect to index.html  
✅ **Health checks** - Built-in health check endpoint  
✅ **Production optimized** - Small image, fast startup, efficient serving

---

## Image Size

Expected final image size: **~40-50MB** (compared to 600MB+ with single-stage builds)

---

## Environment Variables

Pass `VITE_API_URL` during build:

```bash
docker build --build-arg VITE_API_URL=https://api.example.com .
```

This will be baked into the bundle at build time.

---

## Nginx Configuration

The `nginx.conf` includes:

- Gzip compression
- Security headers
- Long-term caching for static files
- React Router fallback routing
- Hidden file protection

---

## Troubleshooting

### 404 on refresh

Already handled - all routes fallback to `index.html`

### API calls failing

Check that `VITE_API_URL` is set correctly at build time

### Large image size

Ensure you're using the Dockerfile (two-stage build), not single-stage

### Performance issues

Check Nginx gzip setting and cache headers are applied correctly
