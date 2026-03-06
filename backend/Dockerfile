# 1. Etapa de compilación
FROM node:20-alpine AS build
WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./
# Copiamos la carpeta prisma (necesaria para el comando generate)
COPY prisma ./prisma/ 

# Instalamos todas las dependencias (incluyendo devDependencies para compilar)
RUN npm install

# Copiamos el resto del código
COPY . .

# GENERAR EL CLIENTE
# Usamos una URL ficticia solo para que el generador no de error de entorno
RUN DATABASE_URL="postgresql://user:password@localhost:5432/db" npx prisma generate

# Compilamos el proyecto NestJS
RUN npm run build

# 2. Etapa de ejecución (Producción)
FROM node:20-alpine
WORKDIR /app

# Variable de entorno por defecto (será sobrescrita por Docker Compose)
ENV NODE_ENV=production

COPY package*.json ./
# Instalamos solo dependencias de producción para que la imagen sea ligera
RUN npm install --omit=dev

# TRUCO MAESTRO: Transferencia del cliente generado y el build
# Copiamos el motor de prisma y el cliente generado desde la etapa de 'build'
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 3000

# Comando optimizado para arrancar la aplicación
CMD ["sh", "-c", "node $(find dist -name main.js)"]