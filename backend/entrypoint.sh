#!/usr/bin/env bash
set -e

# Ensure required directories exist and are writable
mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache || true
chmod -R 777 storage bootstrap/cache || true

# Link storage if not already
php artisan storage:link || true

# Clear stale caches (in case built with placeholder .env)
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true

# Rebuild caches with runtime env
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# Run database migrations
php artisan migrate --force || true

# Start PHP built-in server
php -d variables_order=EGPCS -S 0.0.0.0:${PORT:-8080} -t public public/index.php
