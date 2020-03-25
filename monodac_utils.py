import warnings
warnings.filterwarnings("ignore")
import logging
logging.getLogger('tensorflow').disabled = True # Disabling TensorFlow warnings

import numpy as np
from PIL import Image

from keras.models import load_model

custom_obj = {'BilinearUpSampling2D': BilinearUpSampling2D, 'depth_loss_function': None }

model = None

try:
    model = load_model('./models/nyu.h5', custom_objects=custom_obj, compile=False)
except:
    print("Could not load model, make sure to add .h5 model to the /models/ folder")
    exit()


# Load and return input RGB image as np array
def load_image(image_file):
    x = np.clip(np.asarray(Image.open( image_file ), dtype=float) / 255, 0, 1)
    return np.stack([x], axis=0)


# Converting predicted depth intensity (single channel) to depth map (multichannel)
def to_multichannel(img):
    if img.shape[2] == 3: return i
    img = img[:,:,0]
    return np.stack((img,img,img), axis=2)


# Creating and saving depth map from predicted depth intensity
def save_images(filename, outputs):
    rescaled = to_multichannel(outputs[0])
    im = Image.fromarray(np.uint8(rescaled*255))
    im = im.resize((640,480), 1)
    im.save(filename, "PNG")


# Generate and save depth map for input
def generate_depth_map():
    inputs = load_image('./static/temp/c.png')
    outputs = predict(model, inputs)
    save_images('./static/temp/d.png', outputs.copy())

