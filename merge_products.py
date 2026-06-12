import json
import re

with open('src/components/parsed_products.json', 'r') as f:
    products1 = json.load(f)

with open('src/components/parsed_products_rack2.json', 'r') as f:
    products2 = json.load(f)

all_products = products1 + products2

products_ts = 'const PRODUCTS: Product[] = [\n'
for p in all_products:
    name = p['name'].replace("'", "\\'")
    products_ts += f'''  {{ id: '{p['id']}', name: '{name}', price: {p['price']}, image: '{p['image']}', category: '{p['category']}', country: '{p['country']}' }},\n'''
products_ts += ']'

with open('src/components/Products.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_content = re.sub(r'const PRODUCTS: Product\[\] = \[.*?\]', products_ts, content, flags=re.DOTALL)

with open('src/components/Products.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
print(f'Successfully injected {len(all_products)} total products')
