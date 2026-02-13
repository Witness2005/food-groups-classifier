# 🍎 Food AI Detector: Fruit, Grain & Dairy Classifier

![Project Status](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/)
[![Flask](https://img.shields.io/badge/Flask-Framework-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)

**Food AI Detector** es una aplicación web interactiva de **Visión por Computadora** diseñada para clasificar alimentos en tiempo real. El sistema utiliza una Red Neuronal Convolucional (CNN) para distinguir entre **Frutas, Granos y Lácteos**, ofreciendo una experiencia de usuario gamificada con retroalimentación visual y auditiva inmediata.

---

## 👥 Colaboradores y Desarrollo
Este proyecto es el resultado de un esfuerzo colaborativo enfocado en la integración de modelos de Deep Learning en entornos web productivos.

* **LuisMalte** - [Perfil de GitHub](https://github.com/LuisMalte) - 
* **Witness2005** - [Perfil de GitHub](https://github.com/Witness2005) - 

---

## 🧠 El "Cerebro" del Proyecto: Model.h5

El núcleo de inteligencia de esta aplicación reside en el archivo `model.h5`.

### ¿Qué es este archivo?
Es un contenedor en formato **HDF5** (Hierarchical Data Format) que almacena la arquitectura completa de nuestra Red Neuronal, sus capas, y lo más importante: **los pesos (weights) entrenados**. Esto permite que la aplicación realice inferencias (predicciones) instantáneas sin necesidad de volver a entrenar el sistema con cada uso.

### Origen del Modelo
El entrenamiento, preprocesamiento de datos y validación del modelo se realizaron en un entorno separado para garantizar la modularidad del proyecto. Puedes ver el código fuente del entrenamiento, las métricas de precisión y el dataset utilizado en el siguiente enlace:

🔗 **[Ver Repositorio de Entrenamiento y Data Science Aquí](https://github.com/LuisMalte/Modelo_Detector_Alimentos)**

---

## 📽️ Demostración del Sistema

La aplicación cuenta con dos modos principales de funcionamiento. A continuación, se demuestra la capacidad de respuesta del modelo en ambos escenarios:

### 1. Análisis mediante Subida de Archivo
*Procesamiento de imágenes estáticas (JPG, PNG, WebP) desde el almacenamiento local.*

https://youtu.be/f0RX_z_p7lI

### 2. Análisis en Tiempo Real (Cámara)
*Integración con la API del navegador para captura y predicción instantánea.*

https://youtu.be/fILP76t46Rg

---

## 🚀 Funcionalidades Clave

* **Detección Multi-clase:** Clasificación precisa entre tres categorías alimenticias distintas.
* **Integración de Hardware:** Uso de la API `navigator.mediaDevices` para acceso directo a la cámara del dispositivo (móvil o desktop).
* **Feedback Sensorial:**
    * **Visual:** Efectos de partículas (lluvia de emojis/imágenes) correspondientes a la clase detectada.
    * **Auditivo:** Reproducción de pistas de audio temáticas tras una predicción exitosa.
* **Interfaz Glassmorphism:** Diseño moderno utilizando transparencias y desenfoques (CSS backdrop-filter).
* **SPA Feel:** Navegación fluida entre pestañas de "Cámara" y "Subida" sin recargas de página, manipulando el DOM dinámicamente.

---

## 🛠️ Stack Tecnológico

### Backend (Python)
* **Flask:** Servidor web ligero para exponer la API REST `/predict`.
* **TensorFlow / Keras:** Carga del modelo `model.h5` y ejecución del grafo computacional.
* **Pillow (PIL):** Preprocesamiento de imágenes (redimensión a 128x128px y conversión de canales de color).
* **NumPy:** Manipulación de matrices para normalizar los inputs ($\frac{pixel}{255}$).

### Frontend (Web)
* **JavaScript (ES6):** Lógica asíncrona (`async/await`) para comunicación con el backend mediante `fetch`.
* **Bootstrap 5:** Sistema de grillas y componentes responsivos.
* **HTML5 Canvas:** Captura de frames de video para convertirlos en blobs de datos enviables.

---

## 📂 Estructura del Proyecto

```bash
├── api.py              # Aplicación Flask (Entry point y Rutas)
├── model.h5            # Modelo de IA (Pesos y Arquitectura - Importado)
├── labels.txt          # Clases legibles: [fruta, grano, lacteo]
├── requirements.txt    # Dependencias del entorno Python
├── wsgi.py             # Configuración para despliegue (Gunicorn/uWSGI)
├── static/             # Recursos del Frontend
│   ├── audio/          # Feedback sonoro
│   ├── img/            # Assets gráficos
│   ├── js/app.js       # Lógica del cliente (Cámara, AJAX, DOM)
│   └── css/style.css   # Estilos personalizados
└── templates/
    ├── index.html      # Interfaz principal
    └── ayuda.html      # Guía de usuario
