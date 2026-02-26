# 1. Etapa de compilación
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
# Necesitamos la carpeta prisma para generar el cliente
COPY prisma ./prisma/ 
RUN npm install
COPY . .
# GENERAR EL CLIENTE ES VITAL AQUÍ
RUN npx prisma generate
RUN npm run build

# 2. Etapa de ejecución (Producción)
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# Instalamos solo producción
RUN npm install --omit=dev

# TRUCO MAESTRO: Copiamos el cliente ya generado desde la etapa de build
# Esto incluye los motores (engines) necesarios para que Prisma funcione
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 3000

CMD ["sh", "-c", "node $(find dist -name main.js)"]