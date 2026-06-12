with open('src/components/Products.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find start/end of PRODUCTS array
start = content.find('const PRODUCTS: Product[] = [')
depth = 0
i = start + len('const PRODUCTS: Product[] = [')
while i < len(content):
    if content[i] == '[': depth += 1
    elif content[i] == ']':
        if depth == 0:
            end = i
            break
        depth -= 1
    i += 1

# Replace with empty array (products will be added later)
new_content = content[:start] + 'const PRODUCTS: Product[] = []' + content[end+1:]

with open('src/components/Products.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
print('Products array cleared successfully')
