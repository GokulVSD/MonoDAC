import os

from monodac_predictor import generate_depth_map_for_evaluation

from PIL import Image

TEST_DIR = "./data/nyu2_test/"
TEMP_DIR = "./data/temp/"

# Calculates Absolute Relative Difference, Squared Relative Difference, RMS Linear and RMS Log for 1 pair of images
def calculate_metrics(depth, pred):
    t = 0
    ard_acc = 0
    srd_acc = 0
    for x in range(depth.size[0]):
        for y in range(depth.size[1]):

            t += 1
            z, z_pred = None, None

            if type(depth.getpixel((x,y))) == tuple:
                z = depth.getpixel((x,y))[0]
            else:
                z = depth.getpixel((x,y))

            if type(pred.getpixel((x,y))) == tuple:
                z_pred = pred.getpixel((x,y))[0]
            else:
                z_pred = pred.getpixel((x,y))

            acc += abs(z_pred - z)/z

    return acc/t


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

    print("\n\nDone. \n\n")
else:
    print("Using predicted depth maps from previous run. \n\n")
    for i in range(total):
        prediction_names.append(TEMP_DIR + str(i) + ".png")


depth = []
pred = []


for i in range(total):
    print("Loading depth maps into memory: ",i+1," of ",total, end="\r")
    depth.append(Image.open(depth_names[i]))

print("\n")

for i in range(total):
    print("Loading predicted depth maps into memory: ",i+1," of ",total, end="\r")
    pred.append(Image.open(prediction_names[i]))

print("\n\nDone. \n\n")

ard_acc = 0
srd_acc = 0
rms_linear_acc = 0
rms_log_acc = 0

for i in range(total):
    print("Calculating metrics for: ",i+1," of ",total, end="\r")
    res = ard(depth[i], pred[i])

print("\nAverage Absolute Relative Difference (ARD): ", cumulative/total, "\n\n")


