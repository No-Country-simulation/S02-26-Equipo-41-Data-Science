# Imagen base de Python
FROM python:3.9-slim

# Directorio de trabajo
WORKDIR /app

# Dependencias del sistema (opcional pero recomendado)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copiar requerimientos e instalar
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del código
COPY . .

# Puerto (ajústalo si usas Flask/FastAPI en otro puerto)
EXPOSE 8000

# Comando para ejecutar la aplicación
CMD ["python", "main.py"]