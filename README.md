<p align="center">
<a href="https://imgur.com/rGc3CYt"><img src="https://i.imgur.com/rGc3CYt.png" title="source: imgur.com" width="60%" /></a></p>
<p align="center">
 <h3 align="center">
  Monocular Depth Estimation via a Fully Convolutional Deep Neural Network, utilising Atrous Convolutions, with 3D Point Cloud Visualisation.
  <br> </h3>
  
##
  
  <h5 align="center">Final Year Project</h5>
<h6 align="center">Developed during our 7th and 8th semesters as a part of our undergraduate degree course work.</h6>

## 

<p align="center">
Generating depth maps, colloquially known as depth estimation, from a single monocular RGB image has long been known to be an ill-posed problem. Traditional depth estimation techniques involve inference from stereo RGB pairs, via depth cues, or through the use of laser based LIDAR sensors, which produce sparse or dense point clouds depending on the size or cost of the sensor. Most modern smartphones contain more than one image sensor; however, utilising these sensors for depth estimation is infeasible as smartphone vendors restrict access to one image sensor at a time. In other cases, the sensors are of varying quality and focal lengths, rendering them inadequate for the purpose of depth inference. Producing depth maps for monocular RGB images is a crucial task due to their use in Depth-of-Field (DoF) image processing, Augmented Reality (AR), and Simultaneous Localisation and Mapping (SLAM).
</p>
<p align="center">
To tackle the above problem, we propose a fully convolutional DCNN approach to learning and generating depth maps from single RGB images, utilising Atrous Convolution layers and ASPP for semantic segmentation and feature pooling & extraction in a convolutional neural network, employing an encoder-decoder architecture. We also apply Bicubic upsampling convolutions to further boost depth estimation accuracy, while simplifying previously proposed architectures so as to improve on performance, taking into consideration the computational and accuracy constraints that plague prior efforts.
</p>
<p align="center">
We are showcasing the results of our model using a 3D point cloud view, and have trained our model using a subset of NYUv2 dataset that contains RGB and depth map pairs, which were constructed using Kinect sensors in an unsupervised manner.
</p>

## 

<img src="/art/1.gif?raw=true"/>
<img src="/art/2.gif?raw=true"/>
<img src="/art/3.gif?raw=true"/>

## Documentation

 ####  [Project report and manual](https://docs.google.com/document/d/1HzVa71MSoma5qDWAhfoBUjLNk3_nhAhYE8KtYTGTPmY/edit?usp=sharing)

<br />

## Data-Flow Diagram Level 2
 <p align="center">
<a href="https://imgur.com/3TXty2i"><img src="https://i.imgur.com/3TXty2i.png" title="source: imgur.com" width="60%" /></a></p>
 
<br />

## Network Architecture
<p align="center">
<a href="https://imgur.com/MOS7a9t"><img src="https://i.imgur.com/MOS7a9t.png" title="source: imgur.com" width="80%" /></a></p>

## Screenshots
<a href="https://imgur.com/ANoHdzu"><img src="https://i.imgur.com/ANoHdzu.png" title="source: imgur.com" /></a>

<br />

## Dependencies
 <p> <strong>TensorFlow</strong> dataflow and differentiable programming library</p>
 <p> <strong>Keras</strong> neural-network library</p>
 <p> <strong>NumPy</strong> multi-dimensional arrays and matrices</p>
 <p> <strong>PIL</strong> python imaging library</p>
 <p> <strong>Pillow</strong> a fork of PIL</p>
 <p> <strong>Scikit-learn</strong> various classification, regression and clustering algorithms</p>
 <p> <strong>Scikit-image</strong> segmentation, transformations, color manipulation, filtering, morphology, feature detection</p>
 <p> <strong>Open3D</strong> 3D rendering</p>
 <p> <strong>OpenCV2</strong> real-time computer vision library</p>
 <p> <strong>Flask</strong> web server</p>
 <br />
 
 ## Other Requirements
 <p> <strong>OpenGL 3.5.5</strong> or newer</p>
 <p> <strong>IP Camera</strong> and a network connection</p>
 
 <br />

##
*Training code and model withheld due to academic constraints.*
