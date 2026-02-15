FROM node:18-slim

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer puerto por defecto de Vue CLI
EXPOSE 8080

CMD ["npm", "run", "dev"]