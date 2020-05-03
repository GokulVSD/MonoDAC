import os
import math

from monodac_predictor import generate_depth_map_for_evaluation

from PIL import Image

TEST_DIR = "./data/nyu2_test/"
TEMP_DIR = "./data/temp/"

# Calculates Absolute Relative Difference, Squared Relative Difference, RMS Linear and RMS Log for 1 pair of images
def calculate_metrics(depth, pred):

    t = 0
    ard_acc = 0
    srd_acc = 0
    rms_linear_acc = 0
    rms_log_acc = 0

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

            # NYUv2 test has depth range from 0 to 10,000, while our model outputs 0 to 255, normalising NYUv2 test:
            z = (z*255) // 10000

            ard_acc += abs(z_pred - z)/z
            srd_acc += (abs(z_pred - z)**2)/z
            rms_linear_acc += abs(z_pred - z)**2
            rms_log_acc += abs(math.log10(z_pred) - math.log10(z))**2

    return ard_acc/t, srd_acc/t, math.sqrt(rms_linear_acc/t), math.sqrt(rms_log_acc/t)


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

ard_total = 0
srd_total = 0
rms_linear_total = 0
rms_log_total = 0

for i in range(total):
    print("Calculating metrics for: ",i+1," of ",total, end="\r")
    res = calculate_metrics(depth[i], pred[i])

    ard_total += res[0]
    srd_total += res[1]
    rms_linear_total += res[2]
    rms_log_total += res[3]

print("\n\nAverage Absolute Relative Difference (ARD): ", ard_total/total, "\n")
print("\nAverage Squared Relative Difference (SRD): ", srd_total/total, "\n")
print("\nAverage Root Mean Square Linear (RMS Linear): ", rms_linear_total/total, "\n")
print("\nAverage Root Mean Square Log (RMS Log): ", rms_log_total/total, "\n")

