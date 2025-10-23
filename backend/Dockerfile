# Simple Laravel runtime using PHP 8.2 CLI on Render with Docker
# Build dependencies and extensions required by Laravel
FROM php:8.2-cli

# Install system deps and PHP extensions
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git curl unzip libzip-dev libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql zip \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /app

# Copy application code
COPY . /app

# Ensure storage and bootstrap cache are writable
RUN mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache \
    && chmod -R 777 storage bootstrap/cache

# Install PHP dependencies
RUN composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction --no-progress

# Cache Laravel config/routes/views; tolerate missing APP_KEY at build
RUN php -r "file_exists('.env') || copy('.env.example', '.env');" \
    && (php artisan config:cache || true) \
    && (php artisan route:cache || true) \
    && (php artisan view:cache || true) \
    && (php artisan storage:link || true)

# Expose port (Render will set $PORT)
EXPOSE 8080

# Start PHP built-in server; Laravel will read env from container env vars provided by Render
CMD ["bash", "-lc", "php -d variables_order=EGPCS -S 0.0.0.0:$PORT -t public public/index.php"]
