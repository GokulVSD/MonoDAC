from flask import Flask, request, jsonify, render_template
import os

from point_cloud import generate_point_cloud, display_point_cloud
from monodac_predictor import generate_depth_map

import urllib.request


app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = "./static/temp" 


@app.route('/')
def renderLandingPage():
    return render_template('landing.html')


@app.route('/localstorage', methods = ['GET'])
def renderLocalStoragePage():
    return render_template('local.html')


@app.route('/ipcamera', methods = ['GET'])
def renderIPCameraPage():
    return render_template('ip.html')


@app.route('/about', methods = ['GET'])
def renderAboutPage():
    return render_template('about.html')


@app.route('/localupload', methods = ['POST'])
def uploadFileLocally():

    file = request.files['file[]']
    if file:
        file.save(os.path.join(app.config['UPLOAD_FOLDER'],"c.png"))
        file.close()
        generate_depth_map()
        print("Finished depth generation")

    return "Finished"


@app.route('/capturefromcamera', methods = ['POST'])
def captureFromCamera():

    camera_ip = request.form['ip']

    urllib.request.urlretrieve("http://" + camera_ip + "/shot.jpg", os.path.join(app.config['UPLOAD_FOLDER'],"c.png"))

    generate_depth_map()
    print("Finished depth generation")

    return "Finished"



@app.route('/loadpointcloud', methods = ['GET'])
def loadPointCloud():

    generate_point_cloud("./static/temp/c.png", "./static/temp/d.png")
    display_point_cloud()
    
    return "Success"


if __name__ == "__main__":
    app.run(debug = False, threaded = False)
