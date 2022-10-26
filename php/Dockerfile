FROM php:8.1-fpm

RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    git

RUN docker-php-ext-install -j$(nproc) zip
RUN pecl install redis \
    docker-php-ext-install redis
RUN pecl install xdebug
RUN docker-php-ext-enable xdebug

RUN curl -sS https://getcomposer.org/installer | php -- --version=1.10.16 && mv composer.phar /usr/local/bin/composer
