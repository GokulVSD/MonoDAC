from flask import Flask, request, jsonify, render_template
import os

app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = "./temp" 


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
    print("test")
    file = request.files['file[]']
    if file:
        file.save(os.path.join(app.config['UPLOAD_FOLDER'],"upload_test.png"))
    
    return render_template('landing.html')


if __name__ == "__main__":
    app.run(host='0.0.0.0')
