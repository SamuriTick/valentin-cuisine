#!/bin/bash

# Kill anything on port 3000
lsof -ti :3000 | xargs kill -9 2>/dev/null && echo "Cleared port 3000." || true

# Start Next.js dev in background
echo "Starting Next.js on port 3000..."
npm run dev &
DEV_PID=$!

# Wait for it to be ready
echo "Waiting for server..."
until curl -s http://localhost:3000 > /dev/null 2>&1; do
  sleep 1
done

# SSH reverse tunnel — exposes localhost:3000 as server:8080
echo "Opening SSH tunnel (http://143.110.167.193:8080)..."
ssh -R 8080:localhost:3000 root@143.110.167.193 -N

# When ngrok exits, kill the dev server
kill $DEV_PID 2>/dev/null
