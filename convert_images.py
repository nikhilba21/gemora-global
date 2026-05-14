import os
from PIL import Image

folder_path = r'd:\web_code\gemora-global\src\frontend\public\assets\generated'

for filename in os.listdir(folder_path):
    if filename.lower().endswith(('.jpg', '.png')):
        file_path = os.path.join(folder_path, filename)
        name, ext = os.path.splitext(filename)
        output_path = os.path.join(folder_path, name + '.webp')
        
        try:
            with Image.open(file_path) as img:
                # Convert RGBA to RGB for JPEG-like WebP, but WebP supports transparency.
                # Just save it directly as WebP
                img.save(output_path, 'webp', quality=80)
            print(f"Converted: {filename} -> {name}.webp")
            
            # Optional: os.remove(file_path)
        except Exception as e:
            print(f"Error converting {filename}: {e}")

print("All done!")
