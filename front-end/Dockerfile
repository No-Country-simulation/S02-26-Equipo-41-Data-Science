# Etapa 1: Construcción (Build)
FROM node:20-alpine AS build-stage
WORKDIR /app
# Copiamos archivos de dependencias
COPY package*.json ./
RUN npm install
# Copiamos el resto del código y compilamos
COPY . .
RUN npm run build

# Etapa 2: Producción (Servidor Nginx)
FROM nginx:stable-alpine AS production-stage
# Copiamos solo los archivos compilados de la etapa anterior a la carpeta de Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Exponemos el puerto 80 del contenedor
EXPOSE 80
# Arrancamos Nginx
CMD ["nginx", "-g", "daemon off;"]