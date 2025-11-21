import os
from flask import Flask, request, jsonify, render_template
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import io

# --- Configuración Inicial ---
# Le decimos a Flask donde están los templates y los static files explícitamente por si acaso
app = Flask(__name__, template_folder='templates', static_folder='static')

# Cargar el modelo y las etiquetas
try:
    model = load_model('model.h5')
    with open('labels.txt', 'r') as f:
        class_labels = [line.strip() for line in f.readlines()]
    MODEL_VERSION = "v1.0"
except Exception as e:
    print(f"Error al cargar el modelo o las etiquetas: {e}")
    model = None
    class_labels = []

# --- Funciones de Ayuda ---
def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes))
    if img.mode == 'RGBA':
        img = img.convert('RGB')
    img = img.resize((128, 128)) # Ajusta esto al tamaño de tu modelo
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0 
    return img_array

# --- Endpoints de la API ---

# 1. RUTA PRINCIPAL (ESTA FALTABA)
@app.route('/')
def home():
    # Esto busca 'index.html' dentro de la carpeta 'templates'
    return render_template('index.html')

@app.route('/ayuda')
def ayuda():
    return render_template('ayuda.html')

# 2. Endpoint de Salud
@app.route('/health', methods=['GET'])
def health_check():
    if model and class_labels:
        return jsonify({"status": "ok", "model_version": MODEL_VERSION}), 200
    else:
        return jsonify({"status": "error", "message": "Modelo no cargado"}), 500

# 3. Endpoint de Predicción
@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Modelo no disponible"}), 500

    if 'image' not in request.files:
        return jsonify({"error": "No se encontró el archivo de imagen"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No se seleccionó ningún archivo"}), 400

    try:
        image_bytes = file.read()
        processed_image = preprocess_image(image_bytes)
        prediction = model.predict(processed_image)
        
        confidence = float(np.max(prediction))
        label_index = int(np.argmax(prediction))
        label = class_labels[label_index]

        return jsonify({
            "label": label,
            "confidence": confidence,
            "model_version": MODEL_VERSION
        })

    except Exception as e:
        print(f"Error en predicción: {e}")
        return jsonify({"error": f"Error al procesar la imagen: {e}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
