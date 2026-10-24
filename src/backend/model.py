import tensorflow as tf
import numpy as np
import json
import os
from PIL import Image

MODEL_PATH = "src/backend/best_plant_mobilenet.keras"
CLASS_PATH = "src/backend/class_names.json"

# تحميل الفئات (Class names) الأساسية
with open(CLASS_PATH, "r") as f:
    class_names = json.load(f)

# التحقق من وجود ملف الموديل لتجنب توقف السيرفر لو مش موجود
if os.path.exists(MODEL_PATH):
    model = tf.keras.models.load_model(MODEL_PATH)
else:
    model = None
    print("⚠️ تحذير: ملف الموديل غير موجود، مسار التنبؤ (/predict) لن يعمل حتى يتوفر الملف.")

def predict_plant(image: Image.Image):
    if model is None:
        raise RuntimeError("نموذج الذكاء الاصطناعي غير متوفر حالياً.")

    image = image.convert("RGB")
    image = image.resize((224, 224))
    image_array = np.array(image, dtype=np.float32)
    image_array = np.expand_dims(image_array, axis=0)

    predictions = model.predict(image_array, verbose=0)[0]
    predicted_index = int(np.argmax(predictions))
    confidence = float(predictions[predicted_index])
    predicted_class = class_names[predicted_index]

    return predicted_class, confidence