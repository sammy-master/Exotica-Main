import json
import re

with open('src/components/exotica_products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

with open('src/components/Products.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Build the PRODUCTS array string
lines = ['const PRODUCTS: Product[] = [']
for p in products:
    name = p['name'].replace("'", "\\'")
    country = p['country'].replace("'", "\\'")
    lines.append(f"  {{ id: '{p['id']}', name: '{name}', price: {p['price']}, image: '{p['image']}', category: '{p['category']}', country: '{country}' }},")
lines.append(']')
new_array = '\n'.join(lines)

# Robustly find and replace the products array
start_str = 'const PRODUCTS: Product[] = ['
start_idx = content.find(start_str)

if start_idx != -1:
    # Find the closing bracket ']' on its own line after the start
    end_idx = content.find('\n]', start_idx)
    if end_idx != -1:
        # Include the '\n]' in the replaced text
        end_idx += 2
        content = content[:start_idx] + new_array + content[end_idx:]
        with open('src/components/Products.tsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Successfully injected {len(products)} products into Products.tsx")
    else:
        print("Error: Found starting point but could not find the closing bracket of the PRODUCTS array.")
else:
    # Fallback to the original replace if it was empty
    if 'const PRODUCTS: Product[] = []' in content:
        content = content.replace('const PRODUCTS: Product[] = []', new_array)
        with open('src/components/Products.tsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Successfully injected {len(products)} products into Products.tsx (empty array)")
    else:
        print("Error: Could not find 'const PRODUCTS: Product[]' in Products.tsx")

