from flask import Flask, request
import cv2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

cap = None

@app.route('/start_camera', methods=['GET'])
def start_camera():
    global cap
    start_camera = request.args.get('start_camera', default = 'false', type = str)
    if start_camera.lower() == 'true':
        if cap is None:
            cap = cv2.VideoCapture(0) 
            while True:
                ret, frame = cap.read() 
                if not ret:
                    break

                cv2.imshow('Video', frame)

                if cv2.waitKey(1) & 0xFF == ord('q'): 
                    break
        return 'Camera started.'
    else:
        if cap is not None:
            cap.release() 
            cv2.destroyAllWindows() 
            cap = None
        return 'Camera stopped.'
 
if __name__ == '__main__':
    app.run(debug=True)