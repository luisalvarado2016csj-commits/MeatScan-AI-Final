# Documentación del Proyecto MeatScan-AI (Proyecto Carne)

Este documento describe la estructura y el propósito de cada una de las carpetas y archivos principales dentro de este proyecto. El proyecto es una aplicación web impulsada por Inteligencia Artificial para el análisis de carne (MeatScan).

## Estructura Principal

### `/backend`
Esta carpeta contiene toda la lógica del servidor (API) y el modelo de Inteligencia Artificial.
- **`app.py`**: El script principal del servidor backend (probablemente Flask o FastAPI). Se encarga de recibir las peticiones del frontend y procesarlas.
- **`modelo_meatscan_final.pth`**: Archivo que contiene los pesos del modelo de IA preentrenado (PyTorch) utilizado para el análisis y escaneo de la carne.
- **`requirements.txt`**: Lista de dependencias y librerías de Python necesarias para que el backend funcione (ej. torch, flask, etc.).
- **`venv/`**: Entorno virtual de Python aislado donde se instalan las dependencias del backend.
- **`test.png`**: Imagen de prueba utilizada para validar que el modelo de IA y el backend funcionen correctamente.

### `/frontend`
Esta carpeta contiene la aplicación web del lado del cliente, construida con el framework **Angular**.
- **`src/`**: Carpeta principal donde reside todo el código fuente de Angular (componentes, servicios, estilos, etc.).
  - **`src/app/`**: Contiene los componentes principales y la lógica de la interfaz de usuario.
  - **`src/environments/`**: Archivos de configuración para distintos entornos (desarrollo, producción).
- **`angular.json`**: Archivo principal de configuración del proyecto Angular.
- **`package.json` y `package-lock.json`**: Definen las dependencias de Node.js necesarias para el frontend y los scripts de ejecución.
- **`node_modules/`**: Carpeta donde se instalan todas las librerías de Node.js para el frontend.
- **`tsconfig.json`**: Configuración del compilador de TypeScript.
- **`public/`** (o `assets`): Archivos estáticos públicos que consume la aplicación web.

### Archivos en la Raíz
- **`requirements.txt`**: Archivo de dependencias general de Python (suele ser el mismo o similar al del backend).
- **`.git/` y `.gitignore`**: Archivos de control de versiones Git. `.gitignore` especifica qué archivos (como `node_modules` o `venv`) no deben subirse al repositorio.
