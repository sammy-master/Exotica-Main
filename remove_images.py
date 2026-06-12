import re

with open('src/components/Products.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all image paths with empty string
new_content = re.sub(r"image: '/products/rack[12]_p[0-9]{3}\.jpg'", "image: ''", content)

with open('src/components/Products.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
