import json
import os
import re

with open('parsed_products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# Format into TSX
tsx_lines = []
tsx_lines.append('const PRODUCTS: Product[] = [\n')
for p in products:
    name = p['name'].replace("'", "\\'")
    price = p['price']
    category = p['category']
    id = p['id']
    tsx_lines.append(f"  {{ id: '{id}', name: '{name}', price: {price}, image: '/products/placeholder.png', category: '{category}', country: '' }},\n")
tsx_lines.append(']\n')

tsx_lines.append('\n')
tsx_lines.append("const CATEGORIES = ['All', 'Rack 1 (Left)', 'Rack 2 (Right)']\n")

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
