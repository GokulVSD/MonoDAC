import sys
import os
from PIL import Image

import numpy as np
from open3d import read_point_cloud, draw_geometries   

focalLength = 525.0
centerX = 319.5
centerY = 239.5
scalingFactor = 5000.0

def generate_point_cloud(rgb_file, depth_file):

    rgb = Image.open(rgb_file)
    depth = Image.open(depth_file)
    
    if rgb.size != depth.size:
        raise Exception("Color and depth image do not match in resolution")

    points = []    
    
    for v in range(rgb.size[1]):
        for u in range(rgb.size[0]):
            
            color = rgb.getpixel((u,v))
            
            Z = depth.getpixel((u,v)) / scalingFactor
            
            if Z == 0: 
                continue
            
            X = (u - centerX) * Z / focalLength
            Y = (v - centerY) * Z / focalLength
            
            points.append("%f %f %f %d %d %d 0\n"%(X, Y, Z, color[0], color[1], color[2]))

    file = open("./temp/pc.ply","w")
    
    file.write('''ply
format ascii 1.0
element vertex %d
property float x
property float y
property float z
property uchar red
property uchar green
property uchar blue
property uchar alpha
end_header
%s
'''%(len(points),"".join(points)))

    file.close()



def display_point_cloud():

    pcd = read_point_cloud("./temp/pc.ply")
    draw_geometries([pcd])



    