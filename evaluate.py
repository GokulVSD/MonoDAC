import os

from monodac_predictor import generate_depth_map_for_evaluation

from PIL import Image

TEST_DIR = "./data/nyu2_test/"
TEMP_DIR = "./data/temp/"


def ard(rgb, depth, total):
    pass

def srd(rgb, depth, total):
    pass

def rms_linear(rgb, depth, total):
    pass

def rms_log(rgb, depth, total):
    pass



rgb_names = []
depth_names = []
prediction_names = []

total = 0
for fname in os.listdir(TEST_DIR):
    if total % 2 == 0:
        rgb_names.append(TEST_DIR + fname)
    else:
        depth_names.append(TEST_DIR + fname)
    total += 1

total = total // 2

if not os.path.exists(TEMP_DIR):
    os.makedirs(TEMP_DIR)
    for i in range(total):
        print("Predicting depth map for test image ", i+1, " of ", total, end="\r")
        prediction_names.append(TEMP_DIR + str(i) + ".png")
        generate_depth_map_for_evaluation(rgb_names[i], prediction_names[i])

    print("\n\n Done. \n\n")
else:
    print("Using predicted depth maps from previous run. \n\n")
    for i in range(total):
        prediction_names.append(TEMP_DIR + str(i) + ".png")

rgb = []
depth = []
pred = []

for i in range(total):
    print("Loading RGB images into memory: ",i+1," of ",total, end="\r")
    rgb.append(Image.open(rgb_names[i]))

print("\n")

for i in range(total):
    print("Loading depth maps into memory: ",i+1," of ",total, end="\r")
    depth.append(Image.open(depth_names[i]))

print("\n")

for i in range(total):
    print("Loading predicted depth maps into memory: ",i+1," of ",total, end="\r")
    pred.append(Image.open(prediction_names[i]))

print("\n\n Done. \n\n")



