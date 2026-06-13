from PIL import Image
import sys

img_path = sys.argv[1]
out_path = sys.argv[2]

try:
    img = Image.open(img_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    # Make near-white pixels transparent
    threshold = 240
    for item in datas:
        if item[0] >= threshold and item[1] >= threshold and item[2] >= threshold:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(out_path, "PNG")
    print(f"Successfully processed {img_path} -> {out_path}")
except Exception as e:
    print(f"Error: {e}")
