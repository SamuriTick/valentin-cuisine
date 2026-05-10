#!/bin/bash

set -euo pipefail

PROJECT_DIR="/root/docker-images/valentin-cuisine"
IMAGE_FILE="$PROJECT_DIR/valentin-cuisine.tar.gz"
ENV_FILE="$PROJECT_DIR/.env.valentin-cuisine"
COMPOSE_FILE="$PROJECT_DIR/docker-compose.yml"

echo ">>> [VALENTIN-CUISINE] Starting deploy..."

# Step 1: Load Docker image
if [ -f "$IMAGE_FILE" ]; then
  echo ">>> Loading valentin-cuisine image from $IMAGE_FILE"
  gunzip -c "$IMAGE_FILE" | docker load
else
  echo ">>> ERROR: Docker image file $IMAGE_FILE not found!"
  exit 1
fi

# Step 2: Check env file
if [ ! -f "$ENV_FILE" ]; then
  echo ">>> ERROR: Environment file $ENV_FILE not found!"
  exit 1
fi

# Step 3: Navigate to project directory
cd "$PROJECT_DIR"

# Step 4: Stop old containers
echo ">>> Stopping old containers..."
docker compose -f "$COMPOSE_FILE" down || true

# Step 4.5: Force remove any existing containers with same names
echo ">>> Cleaning up any existing containers..."
docker stop valentin_cuisine_app valentin_cuisine_postgres || true
docker rm valentin_cuisine_app valentin_cuisine_postgres || true

# Step 5: Start DB first
echo ">>> Starting database..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d db

# Wait until Postgres is ready
echo ">>> Waiting for database to be ready..."
until docker exec valentin_cuisine_postgres pg_isready -U "${POSTGRES_USER:-valentin_user}" > /dev/null 2>&1; do
  sleep 2
done

# Step 6: Run migrations
echo ">>> Running migrations..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" run --rm app npx prisma migrate deploy

# Step 7: Start app
echo ">>> Starting valentin-cuisine app..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d app

# Step 8: Clean up
echo ">>> Cleaning up old images..."
rm -f "$IMAGE_FILE"
docker image prune -f

# Step 9: Show running containers
echo ">>> Deployment done! Current running containers:"
docker ps --filter "name=valentin"
