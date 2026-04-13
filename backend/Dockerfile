FROM php:8.1-apache

# Install PDO MySQL extension
RUN docker-php-ext-install pdo pdo_mysql

# Enable Apache mod_rewrite (optional but often useful for PHP apps)
RUN a2enmod rewrite

# Set the working directory
WORKDIR /var/www/html

# Copy backend files to the container
COPY . /var/www/html/backend/

# Set permissions for Apache
RUN chown -R www-data:www-data /var/www/html/backend

# Expose port 80
EXPOSE 80
