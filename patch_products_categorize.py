import json
import os
import re

with open('parsed_products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

categories_keywords = {
    'Chocolates': ['choco', 'ferrero', 'lindt', 'toblerone', 'nutella', 'kisses', 'milka', 'hershey', 'snickers', 'twix', 'bounty', 'mars', 'galaxy', 'kinder', 'bites', 'truffle', 'cacao', 'cocoa', 'alpenliebe', 'dairy milk'],
    'Drinks': ['juice', 'monster', 'red bull', 'prime', 'drink', 'water', 'soda', 'cola', 'fanta', 'sprite', 'coffee', 'nescafe', 'tea', 'milk'],
    'Snacks': ['pringles', 'chips', 'doritos', 'lays', 'cheetos', 'popcorn', 'snack', 'mix'],
    'Candy': ['haribo', 'skittles', 'mentos', 'jelly', 'gummy', 'pops', 'candy', 'mints', 'gum', 'lollipop', 'sweet', 'fruit-tella', 'hubba bubba', 'smarties', 'ice breakers'],
    'Biscuits': ['oreo', 'biscoff', 'cookie', 'biscuit', 'wafer', 'crackers', 'lipo']
}

image_mapping = {
    'ferrero': '/products/ferrero_premium.png',
    'lindt': '/products/lindt_premium.png',
    'toblerone': '/products/toblerone_premium.png',
    'monster': '/products/monster_premium.png',
    'red bull': '/products/redbull_premium.png',
    'pringles': '/products/pringles_premium.png',
    'haribo': '/products/haribo_premium.png',
    'skittles': '/products/skittles_premium.png',
    'oreo': '/products/oreo_premium.png',
    'kitkat': '/products/kitkat_premium.png',
}

# Format into TSX
tsx_lines = []
tsx_lines.append('const PRODUCTS: Product[] = [\n')

for p in products:
    name = p['name'].replace("'", "\\'")
    name_lower = p['name'].lower()
    price = p['price']
    
    # Ignore invalid products (like the category header)
    if 'EXOTICA' in name and 'COLLECTION' in name:
        continue
        
    category = 'Other'
    for cat, keywords in categories_keywords.items():
        if any(kw in name_lower for kw in keywords):
            category = cat
            break
            
    # Assign image based on keyword, fallback to placeholder
    image = '/products/placeholder.png'
    for kw, img_path in image_mapping.items():
        if kw in name_lower:
            image = img_path
            break
            
    id = p['id']
    tsx_lines.append(f"  {{ id: '{id}', name: '{name}', price: {price}, image: '{image}', category: '{category}', country: '' }},\n")
tsx_lines.append(']\n')

tsx_lines.append('\n')
tsx_lines.append("const CATEGORIES = ['All', 'Chocolates', 'Drinks', 'Snacks', 'Candy', 'Biscuits', 'Other']\n")

# Read the file
with open('src/components/Products.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find where to replace
start_idx = -1
end_idx = -1
cat_idx = -1

for i, line in enumerate(lines):
    if line.startswith('const PRODUCTS: Product[] = ['):
        start_idx = i
    elif line.startswith(']') and start_idx != -1 and end_idx == -1:
        end_idx = i
    elif line.startswith('const CATEGORIES = '):
        cat_idx = i

if start_idx != -1 and end_idx != -1 and cat_idx != -1:
    new_lines = lines[:start_idx] + tsx_lines + lines[cat_idx+1:]
    with open('src/components/Products.tsx', 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print('Successfully patched Products.tsx')
else:
    print('Failed to find indices', start_idx, end_idx, cat_idx)
