# 🥩 Plan de Proyecto y Documentación Técnica: MeatScan-AI (Proyecto Carne)

**Objetivo de este documento:** Servir como guía definitiva y "guion" para entender a fondo la arquitectura, el funcionamiento interno y la justificación técnica del proyecto. Ideal para estudiar y presentar el sistema ante docentes o evaluadores.

---

## 1. 🚀 Visión General (¿Cómo explicárselo al docente?)

**El Pitch (Resumen Ejecutivo):**
"Profesor/a, MeatScan-AI es una aplicación web full-stack que utiliza Inteligencia Artificial (Visión Computacional) para analizar el estado y el tiempo de exposición de una muestra de carne. El sistema permite al usuario subir una fotografía de la carne y, mediante un modelo de redes neuronales convolucionales (EfficientNet), determina automáticamente cuánto tiempo ha estado expuesta a la intemperie (en intervalos, desde 0 hasta 165 minutos) junto con un porcentaje de precisión o confianza."

**¿Cómo funciona a grandes rasgos?**
El sistema está dividido en dos grandes bloques (Arquitectura Cliente-Servidor):
1. **Frontend (El Cliente):** Desarrollado en Angular. Es la interfaz gráfica intuitiva donde el usuario interactúa, selecciona y sube la foto.
2. **Backend (El Servidor/Cerebro):** Desarrollado en Python con Flask y PyTorch. Recibe la foto enviada por el frontend, la procesa matemáticamente, la pasa por el modelo de IA y devuelve el diagnóstico calculado.

---

## 2. 📂 Estructura Detallada del Proyecto

A continuación, desglosamos cada archivo y carpeta principal, explicando **qué es** y **para qué sirve**.

### 🖥️ `/backend` (Lógica y Servidor de Inteligencia Artificial)

Esta carpeta es el motor de inferencia del proyecto. Aquí vive la Inteligencia Artificial y la API que le permite comunicarse con el mundo exterior.

*   **`app.py`**: El corazón del servidor backend.
    *   *¿Qué es?* Un script de Python que levanta una API REST usando el micro-framework **Flask**.
    *   *¿Qué hace y cómo lo explico?* 
        1. **Inicialización:** Al iniciar, carga en memoria la arquitectura de nuestra red neuronal **EfficientNet-B0**.
        2. **Adaptación:** Adapta la última capa de la red para que, en lugar de predecir objetos aleatorios (como perros o coches), prediga exactamente nuestras **12 categorías de tiempo** específicas (0 min, 15 min, 30 min, etc.).
        3. **Recepción (Endpoint `/predict`):** Está a la escucha de peticiones `POST`. Cuando recibe una foto, le aplica **transformaciones matemáticas estrictas** (la redimensiona, la recorta a 224x224 píxeles y normaliza sus valores de color RGB). Esto es vital porque la IA exige que la imagen nueva entre exactamente en el mismo formato con el que fue entrenada originalmente.
        4. **Cálculo (Inferencia):** Pasa la matriz de la imagen por la red (usando CPU, para garantizar compatibilidad en servidores gratuitos sin tarjeta gráfica) y obtiene un resultado.
        5. **Respuesta:** Devuelve al frontend una respuesta estructurada en formato JSON, por ejemplo: `{"tiempo": "15 MIN", "confianza": 95.8}`.
*   **`modelo_meatscan_final.pth`**: El "Cerebro" de la aplicación.
    *   *¿Qué es?* Es un archivo binario pesado de PyTorch.
    *   *¿Para qué sirve?* Contiene todos los **pesos sinápticos y matemáticos** de la red neuronal ya entrenada. Al cargar este archivo, evitamos tener que entrenar al modelo desde cero (lo cual tardaría horas y requeriría miles de imágenes). Simplemente "enchufamos" el conocimiento aprendido.
*   **`Dockerfile`**: La receta de despliegue.
    *   *¿Qué es?* Un archivo de instrucciones de infraestructura para **Docker**.
    *   *¿Para qué sirve?* Si un evaluador pregunta cómo se asegura que el backend corra en la nube (como en Hugging Face Spaces o Render), la respuesta es el `Dockerfile`. Define un contenedor basado en Linux (`python:3.10-slim`), instala librerías de sistema operativo requeridas para procesar imágenes (`libgl1-mesa-glx`), instala las librerías de Python y finalmente ejecuta `app.py` en el puerto `7860`.
*   **`requirements.txt`**: Las dependencias del servidor.
    *   *¿Para qué sirve?* Lista exacta de librerías externas (como `torch`, `torchvision`, `Flask`, `Pillow`, `flask-cors`) necesarias para que todo el backend funcione.
*   **`venv/`**: (Entorno Virtual). Carpeta aislada donde se guardan localmente las librerías de Python para no ensuciar el sistema principal. (Ignorado por Git).

---

### 🎨 `/frontend` (Interfaz de Usuario)

Esta carpeta contiene la SPA (Single Page Application) que consume nuestro backend. Desarrollada en **Angular**.

*   **`src/`**: Carpeta donde ocurre la magia del desarrollo visual.
    *   **`app/`**: Contiene la lógica visual. Aquí es donde se programan los componentes (los archivos `.ts` para la lógica TypeScript, los `.html` para el diseño y `.css`/`.scss` para los estilos).
    *   **`environments/`**: Guarda variables de entorno, como por ejemplo, la dirección URL hacia donde Angular debe enviar las fotos (nuestro backend).
*   **`angular.json`**: El archivo de configuración principal de la herramienta Angular CLI (define cómo compilar, empaquetar y construir la web).
*   **`package.json` y `package-lock.json`**: El equivalente a `requirements.txt` pero del lado del frontend (ecosistema NodeJS/NPM). Define qué versión de Angular, qué librerías visuales y scripts se usan.
*   **`node_modules/`**: Directorio masivo donde NPM guarda las dependencias descargadas. (Ignorado por Git).
*   **`tsconfig.json`**: Configuraciones estrictas para el compilador de TypeScript.

---

## 3. 🔄 Flujo de Ejecución (Paso a Paso)

Si en la defensa te piden: *"Muéstrame el ciclo de vida de los datos, desde el clic hasta el resultado"*, debes guiarte con estos 5 pasos técnicos:

1.  **Input del Usuario:** En Angular (Frontend), el usuario carga una imagen (JPG/PNG) a través de un elemento `<input type="file">`.
2.  **Petición HTTP:** Angular encapsula esa imagen en un objeto `FormData` y dispara una petición asíncrona `POST` hacia la ruta `/predict` del Backend, gestionando posibles bloqueos de CORS (permitidos gracias a `flask_cors` en el backend).
3.  **Preparación de los Datos:** Flask recibe el archivo en bytes. Utiliza `Pillow` (librería de imágenes) para abrirlo. Se corrige automáticamente la rotación si fue tomada en vertical (EXIF metadata) y pasa por la tubería de transformaciones (`Compose`): Resize, Crop y Normalización de tensores a 3 canales (RGB).
4.  **Inferencia Pura:** El tensor ingresa al modelo `modelo_meatscan_final.pth`. Como solo estamos "adivinando" y no entrenando, el código apaga el cálculo de derivadas (`torch.no_grad()`) para ahorrar muchísima memoria. La red lanza un arreglo de 12 probabilidades usando una función `Softmax`.
5.  **Output y Visualización:** El backend detecta qué clase obtuvo la mayor probabilidad (ej: "45 minutos"), formatea el texto, lo empaqueta en JSON y lo devuelve con código HTTP 200. Angular lo recibe casi al instante y cambia el estado de la interfaz para revelar el tiempo al usuario.

---

## 4. 🧠 Defensa Técnica (Posibles Preguntas y Respuestas)

*   **¿Por qué Python en el Backend y no otro lenguaje?**
    *   *R:* Porque es el estándar indiscutible de la Inteligencia Artificial. Escribir el backend en Python con Flask nos permite integrar directamente las librerías de PyTorch (que es donde se construyó el modelo de IA), haciendo que la conexión entre servidor e inteligencia artificial sea directa y sin puentes intermediarios engorrosos.
*   **¿Por qué elegir Flask y no un framework gigante como Django?**
    *   *R:* Flask es un "micro-framework". Necesitábamos un servidor rápido, ligero y eficiente cuyo único propósito es exponer un endpoint para predecir imágenes. Django incluye bases de datos, autenticaciones y módulos pesados que solo harían lento el contenedor. Flask nos da flexibilidad y máxima velocidad.
*   **¿Por qué usar el modelo EfficientNet (B0)?**
    *   *R:* En Visión Computacional existen muchas arquitecturas (ResNet, VGG, etc.). Elegimos EfficientNet porque, como su nombre lo indica, es altísimamente *eficiente*. Su versión "B0" es liviana (pesa muy pocos megabytes en disco) y requiere bajos recursos de cómputo, lo que permite que el sistema analice las carnes en la CPU de un servidor económico y rápido, manteniendo una alta precisión.
*   **¿Por qué usar Angular para la vista?**
    *   *R:* Angular provee una arquitectura robusta orientada a componentes y usa TypeScript (tipado fuerte). Esto garantiza que el código sea limpio, predecible y fácilmente escalable si en el futuro queremos agregar paneles de estadísticas, inicio de sesión para laboratorios, historiales de escaneos, etc.
*   **¿Qué función cumple Docker en el despliegue?**
    *   *R:* Elimina el problema de "funciona en mi computadora pero en el servidor no". Docker crea un paquete estándar con el sistema operativo exacto y las librerías exactas, asegurando que cuando desplegamos la IA en un servicio Cloud (como Hugging Face o AWS), su comportamiento sea un clon perfecto del entorno donde se desarrolló.
