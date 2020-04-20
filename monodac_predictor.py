import warnings
warnings.filterwarnings("ignore")
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
import logging
logging.getLogger('tensorflow').disabled = True # Disabling TensorFlow warnings

import numpy as np
from PIL import Image

from keras.models import load_model
from bicubic_upsampler import BicubicUpSampling2D

custom_obj = {'BicubicUpSampling2D': BicubicUpSampling2D, 'depth_loss_function': None }

model = None
try:
    model = load_model('./models/model.h5', custom_objects=custom_obj, compile=False)
except:
    print("Could not load model, make sure to add model.h5 to the /models/ folder")
    exit()


def normalise_depth(x, max_depth):
    return max_depth / x

# Supports multiple RGB images, one RGB image, or greyscale
def predict(model, images, min_depth=10, max_depth=1000, batch_size=2):

    # Incase images are greyscale    
    if len(images.shape) < 3: 
        images = np.stack((images,images,images), axis=2)

    # Reshaping according to model input layer
    if len(images.shape) < 4: 
        images = images.reshape((1, images.shape[0], images.shape[1], images.shape[2]))

    predictions = model.predict(images, batch_size=batch_size)

    # Normalising according to min and max depth
    return np.clip(normalise_depth(predictions, max_depth=max_depth), min_depth, max_depth) / max_depth


# Load and return input RGB image as np array
def load_image(image_file):
    x = np.clip(np.asarray(Image.open( image_file ), dtype=float) / 255, 0, 1)
    return np.stack([x], axis=0)


# Converting predicted depth intensity (single channel) to depth map (multichannel)
def to_multichannel(img):
    if img.shape[2] == 3: return img
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

