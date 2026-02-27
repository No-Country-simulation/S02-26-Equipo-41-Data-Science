FROM jenkins/jenkins:lts

USER root

# Node
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs \
    && apt-get clean

# Docker CLI
RUN apt-get update \
    && apt-get install -y docker.io \
    && apt-get clean

EXPOSE 8080 50000