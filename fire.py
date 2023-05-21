import cv2
import numpy as np
from PIL import Image

text = "Fire"
font = cv2.FONT_HERSHEY_SIMPLEX

video = cv2.VideoCapture("car_burn.mp4")

while True:
    ret, frame = video.read()
    frame = cv2.resize(frame, (1000, 600))
    blur = cv2.GaussianBlur(frame, (15, 15), 0)
    hsv = cv2.cvtColor(blur, cv2.COLOR_BGR2HSV)

    lower = [18, 50, 50]
    upper = [35, 255, 255]

    lower = np.array(lower, dtype='uint8')
    upper = np.array(upper, dtype='uint8')

    mask = cv2.inRange(hsv, lower, upper)
    mask_ = Image.fromarray(mask)

    boundary_box = mask_.getbbox()

    if boundary_box is not None:
        x1, y1, x2, y2 = boundary_box

        frame = cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 5) #BGR color
        cv2.putText(frame,text,((x1+x2)//2,(y1+y2)//2), font, 1,(0,0,0),2)

    print(boundary_box)

    output = cv2.bitwise_and(frame, hsv, mask=mask)

    sizeOfFile = cv2.countNonZero(mask)

    threshold_area = 15000
    if int(sizeOfFile) > threshold_area:
        pass

    if ret == False:
        break

    cv2.imshow("Output", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cv2.destroyAllWindows()
video.release()



