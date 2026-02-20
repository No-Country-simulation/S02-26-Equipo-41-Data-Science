# 1. Etapa de compilación
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Etapa de ejecución (Producción)
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
# Copiamos el dist desde la etapa anterior (build)
COPY --from=build /app/dist ./dist

EXPOSE 3000

# Este comando busca el main.js y lo ejecuta, no importa si está en dist/ o dist/src/
CMD ["sh", "-c", "node $(find dist -name main.js)"]