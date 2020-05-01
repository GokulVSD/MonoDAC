import sys
import os
from PIL import Image

import numpy as np
from open3d import read_point_cloud, draw_geometries

# Instructions on how to control the view:
# http://www.open3d.org/docs/release/tutorial/Basic/visualization.html

"""

-- Mouse view control --
  Left button + drag         : Rotate.
  Ctrl + left button + drag  : Translate.
  Wheel button + drag        : Translate.
  Shift + left button + drag : Roll.
  Wheel                      : Zoom in/out.

-- Keyboard view control --
  [/]          : Increase/decrease field of view.
  R            : Reset view point.
  Ctrl/Cmd + C : Copy current view status into the clipboard.
  Ctrl/Cmd + V : Paste view status from clipboard.

-- General control --
  Q, Esc       : Exit window.
  H            : Print help message.
  P, PrtScn    : Take a screen capture.
  D            : Take a depth capture.
  O            : Take a capture of current rendering settings.

  Ctrl + c     : Save view point as JSON to clipboard
  Ctrl + v     : Load view point from clipboard

"""

focalLength = 525.0
centerX = 319.5
centerY = 239.5
scalingFactor = 5000.0

# Creates the PLY file
def generate_point_cloud(rgb_file, depth_file):

    rgb = Image.open(rgb_file)
    depth = Image.open(depth_file)
    
    if rgb.size != depth.size:
        raise Exception("Color and depth image do not match in resolution")

    points = []    
    
    for v in range(rgb.size[1]):
        for u in range(rgb.size[0]):
            
            color = rgb.getpixel((u,v))

            Z = None

            if type(depth.getpixel((u,v))) == tuple:
                Z = depth.getpixel((u,v))[0] / scalingFactor
            else:
                Z = depth.getpixel((u,v)) / scalingFactor
            
            if Z == 0: 
                continue
            
            X = (u - centerX) * Z / focalLength
            Y = (v - centerY) * Z / focalLength
            
            points.append("%f %f %f %d %d %d 0\n"%(X, Y, Z, color[0], color[1], color[2]))

    file = open("./temp/pc.ply","w")
    
    # PLY file header
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


# Opens 3D point cloud viewing window on host machine
def display_point_cloud():

    pcd = read_point_cloud("./temp/pc.ply")
    draw_geometries([pcd])



    
