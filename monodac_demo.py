from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

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


if __name__ == "__main__":
    app.run(host='0.0.0.0')
