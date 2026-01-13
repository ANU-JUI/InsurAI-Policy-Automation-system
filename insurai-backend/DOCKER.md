# Docker Setup for InsurAI Backend

## Quick Start

### Option 1: Using docker-compose (Recommended)
Builds and runs the container with all environment variables pre-configured:

```bash
docker-compose up --build
```

The app will be available at `http://localhost:8080`.

To stop:
```bash
docker-compose down
```

---

### Option 2: Manual Docker Build & Run

#### Build the image:
```bash
DOCKER_BUILDKIT=1 docker build -t insurai-backend:latest -f dockerfile .
```

#### Run the container:
```bash
docker run --rm \
  -p 9000:9000 \
  -e SPRING_DATASOURCE_URL="jdbc:postgresql://db.txkgemcpojqaqzjyrfrr.supabase.co:5432/postgres?sslmode=require" \
  -e SPRING_DATASOURCE_USERNAME="postgres" \
  -e SPRING_DATASOURCE_PASSWORD="root@insurai" \
  -e SPRING_JPA_HIBERNATE_DDL_AUTO="validate" \
  -e SUPABASE_URL="https://txkgemcpojqaqzjyrfrr.supabase.co" \
  -e SUPABASE_ACCESS_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4a2dlbWNwb2pxYXF6anlyZnJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTgwMzg5OSwiZXhwIjoyMDgxMzc5ODk5fQ.tFBwL6Iobnw8Cl6MtFYNocPz0j6pXu9sMTQfPv1JoTY" \
  insurai-backend:latest
```

---

## Configuration

### Database Settings
- **URL**: `jdbc:postgresql://db.txkgemcpojqaqzjyrfrr.supabase.co:5432/postgres?sslmode=require`
- **Username**: `postgres`
- **Password**: `root@insurai`
- **Driver**: PostgreSQL (included in `pom.xml`)

### JPA/Hibernate
- `ddl-auto=validate` — validates schema without modifying it (safe for production)
- `defer-datasource-initialization=true` — defers database init until endpoints are accessed
- `show-sql=false` — disables verbose SQL logging (enable with `true` for debugging)

### Environment Variables
All `application.properties` settings can be overridden via environment variables using the Spring convention:
- Replace dots with underscores: `spring.datasource.url` → `SPRING_DATASOURCE_URL`
- Replace nested separators: `spring.datasource.driver-class-name` → `SPRING_DATASOURCE_DRIVER_CLASS_NAME`

---

## Troubleshooting

### Network Unreachable
If the container can't reach Supabase:
1. Verify Supabase server is online: `ping db.txkgemcpojqaqzjyrfrr.supabase.co`
2. Check your internet connection
3. Ensure Docker has network access (`docker network ls` should show bridges)

### SSL Certificate Error
Add `?sslmode=require` to the JDBC URL (already included by default).

### BuildKit Not Available
If `DOCKER_BUILDKIT=1 docker build` fails, build without BuildKit:
```bash
docker build -t insurai-backend:latest -f dockerfile .
```
(Builds will be slower without cache mounts.)

---

## Production Deployment

For production, use `docker-compose.yml` with environment-specific overrides:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Or pass secrets via Docker Secrets / environment files instead of hardcoding credentials.
