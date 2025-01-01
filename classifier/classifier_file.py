import sys
import base64
import io
import numpy as np
from PIL import Image
from tf_keras.models import load_model
import os

def decode_base64_image(base64_string):
    img_data = base64.b64decode(base64_string)
    image = Image.open(io.BytesIO(img_data))
    return image

def load_trained_model():
    base_dir = os.path.dirname(__file__)
    model_path = os.path.join(base_dir, 'my_flower_transfer_model')
    model = load_model(model_path)
    return model

def preprocess_image(image):
    image = image.convert("RGB")
    image = image.resize((224, 224))
    image_array = np.array(image)
    image_array = image_array / 255.0
    image_array = np.expand_dims(image_array, axis=0)
    return image_array

def predict(image_array, model):
    predictions = model.predict(image_array)
    predicted_class = np.argmax(predictions, axis=1)[0]
    return predicted_class

def main():
    base64_string = sys.stdin.read().strip()

    image = decode_base64_image(base64_string)
    model = load_trained_model()
    image_array = preprocess_image(image)

    predicted_class = predict(image_array, model)

    flowers_label_dict = {
        0: 'roses',
        1: 'daisy',
        2: 'dandelion',
        3: 'sunflowers',
        4: 'tulips'
    }

    print(flowers_label_dict[predicted_class])

if __name__ == "__main__":
    main()
