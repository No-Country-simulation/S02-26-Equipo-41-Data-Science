FROM node:20-alpine
WORKDIR /app

# Solo copiamos lo que ya está listo
COPY package*.json ./
# Instalamos solo dependencias de producción para que sea liviano
RUN npm install --omit=dev

# Copiamos la carpeta dist que Jenkins acaba de crear
COPY dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]