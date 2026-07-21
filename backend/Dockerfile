FROM python:3.10-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema necesarias
RUN apt-get update && apt-get install -y libgl1-mesa-glx libglib2.0-0

# Copiar los requerimientos e instalarlos
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el backend
COPY . .

# Exponer el puerto que usa Hugging Face Spaces (7860)
EXPOSE 7860

# Comando para ejecutar el backend
CMD ["python", "app.py"]
