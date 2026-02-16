FROM jenkins/jenkins:lts

USER root

# Instalar Node y npm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs \
    && apt-get clean

# Instalar cliente de Docker
RUN apt-get update \
    && apt-get install -y docker.io \
    && apt-get clean

USER jenkins

EXPOSE 8080 50000
