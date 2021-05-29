from flask import *
import time

app=Flask(__name__)


@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

@app.route('/imageUpload', methods=['POST'])
def image_upload():
    print(request.files)
    f = request.files['image']
    f.save('./image/image.png')  
    return 'Image uploaded to server'

@app.route('/get_model/<file>')
def get_model(file):
    print(file)
    filename = './model/'+ file
    return send_file(filename, mimetype='application/*', cache_timeout=0)

@app.route('/modelReady', methods=['GET'])
def model_download():
    time.sleep(2)
    return 'Model is ready'

if __name__ == "__main__":
    app.run(debug=True)

