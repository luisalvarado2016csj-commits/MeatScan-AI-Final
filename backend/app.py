from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import io

app = Flask(__name__)
CORS(app) 

# Carga del modelo
model = tf.keras.models.load_model('modelo_meatscan_final.h5')

# IMPORTANTE: Revisa que este orden sea EXACTAMENTE el mismo que usaste en el entrenamiento de Colab
class_names = ['0 min', '105 min', '120 min', '135 min', '15 min', '150 min', 
               '165 min', '30 min', '45 min', '60 min', '75 min', '90 min']

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No se subió ningún archivo'}), 400
    
    file = request.files['file']
    
    img_bytes = file.read()
    img = image.load_img(io.BytesIO(img_bytes), target_size=(224, 224))
    x = image.img_to_array(img) / 127.5 - 1.0  
    x = np.expand_dims(x, axis=0)

    # Predicción
    prediccion = model.predict(x)
    
    # --- LOGS PARA INGENIERÍA (Míralos en la terminal) ---
    print("\n--- NUEVA PREDICCIÓN ---")
    print(f"Probabilidades por clase: {prediccion[0]}") 
    
    indice = np.argmax(prediccion[0])
    resultado = class_names[indice]
    confianza_valor = float(np.max(prediccion[0]))
    
    print(f"Índice detectado: {indice}")
    print(f"Resultado final: {resultado}")
    print(f"Confianza: {confianza_valor * 100:.2f}%")
    print("------------------------\n")

    return jsonify({
        'tiempo': resultado,
        'confianza': f"{confianza_valor*100:.1f}%"
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)