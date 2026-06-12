import fitz
import re
import json

# Extract all text from both PDFs
def extract_pdf_text(path):
    doc = fitz.open(path)
    all_text = []
    for page in doc:
        text = page.get_text('text').strip()
        if text:
            all_text.append(text)
    return all_text

rack1_pages = extract_pdf_text(r'C:\Users\admin\Downloads\EXOTICA RACK 1 LEFT (1).pdf')
rack2_pages = extract_pdf_text(r'C:\Users\admin\Downloads\EXOTICA RACK 2  RIGHT-1.pdf')

# Build a price lookup: product keyword -> price
price_lookup = {}

for page_text in rack1_pages + rack2_pages:
    # Extract price from page (usually last number on the page)
    lines = [l.strip() for l in page_text.splitlines() if l.strip()]
    # Find lines with price pattern
    price_match = re.search(r'(\d{2,4})\s*(?:RS|EACH|RS EACH|/-|₹)?$', page_text, re.IGNORECASE)
    if price_match:
        price = int(price_match.group(1))
        # Store keyword from first meaningful line
        for line in lines:
            if len(line) > 3 and not re.match(r'^\d+$', line):
                key = line.upper().strip()
                price_lookup[key] = price
                break

print(f"Extracted {len(price_lookup)} price entries from PDFs")

# The filename-to-image mapping (sorted order = alphabetical sort of original filenames)
# Mapping: original filename -> exotica_XXX.jpg
filename_map = {
    "WhatsApp Image 2026-06-12 at 2.25.07 PM (1).jpeg": "exotica_001.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.07 PM (2).jpeg": "exotica_002.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.07 PM.jpeg": "exotica_003.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.09 PM.jpeg": "exotica_004.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.10 PM (1).jpeg": "exotica_005.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.10 PM (10).jpeg": "exotica_006.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.10 PM (11).jpeg": "exotica_007.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.10 PM (12).jpeg": "exotica_008.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.10 PM (13).jpeg": "exotica_009.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.10 PM (14).jpeg": "exotica_010.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.10 PM (2).jpeg": "exotica_011.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.10 PM (3).jpeg": "exotica_012.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.10 PM (4).jpeg": "exotica_013.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.10 PM (5).jpeg": "exotica_014.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.10 PM (6).jpeg": "exotica_015.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.10 PM (7).jpeg": "exotica_016.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.10 PM (8).jpeg": "exotica_017.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.10 PM (9).jpeg": "exotica_018.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.10 PM.jpeg": "exotica_019.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.11 PM (1).jpeg": "exotica_020.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.11 PM (10).jpeg": "exotica_021.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.11 PM (11).jpeg": "exotica_022.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.11 PM (12).jpeg": "exotica_023.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.11 PM (13).jpeg": "exotica_024.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.11 PM (14).jpeg": "exotica_025.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.11 PM (15).jpeg": "exotica_026.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.11 PM (16).jpeg": "exotica_027.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.11 PM (2).jpeg": "exotica_028.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.11 PM (3).jpeg": "exotica_029.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.11 PM (4).jpeg": "exotica_030.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.11 PM (5).jpeg": "exotica_031.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.11 PM (6).jpeg": "exotica_032.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.11 PM (7).jpeg": "exotica_033.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.11 PM (8).jpeg": "exotica_034.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.11 PM (9).jpeg": "exotica_035.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.11 PM.jpeg": "exotica_036.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.12 PM (1).jpeg": "exotica_037.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.12 PM (10).jpeg": "exotica_038.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.12 PM (11).jpeg": "exotica_039.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.12 PM (12).jpeg": "exotica_040.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.12 PM (13).jpeg": "exotica_041.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.12 PM (14).jpeg": "exotica_042.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.12 PM (15).jpeg": "exotica_043.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.12 PM (16).jpeg": "exotica_044.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.12 PM (17).jpeg": "exotica_045.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.12 PM (18).jpeg": "exotica_046.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.12 PM (19).jpeg": "exotica_047.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.12 PM (2).jpeg": "exotica_048.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.12 PM (20).jpeg": "exotica_049.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.12 PM (21).jpeg": "exotica_050.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.12 PM (3).jpeg": "exotica_051.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.12 PM (4).jpeg": "exotica_052.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.12 PM (5).jpeg": "exotica_053.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.12 PM (6).jpeg": "exotica_054.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.12 PM (7).jpeg": "exotica_055.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.12 PM (8).jpeg": "exotica_056.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.12 PM (9).jpeg": "exotica_057.jpg",
    "WhatsApp Image 2026-06-12 at 2.25.12 PM.jpeg": "exotica_058.jpg",
    "WhatsApp Image 2026-06-12 at 3.43.46 PM (1).jpeg": "exotica_059.jpg",
    "WhatsApp Image 2026-06-12 at 3.43.46 PM (2).jpeg": "exotica_060.jpg",
    "WhatsApp Image 2026-06-12 at 3.43.46 PM.jpeg": "exotica_061.jpg",
    "WhatsApp Image 2026-06-12 at 3.43.47 PM (1).jpeg": "exotica_062.jpg",
    "WhatsApp Image 2026-06-12 at 3.43.47 PM (10).jpeg": "exotica_063.jpg",
    "WhatsApp Image 2026-06-12 at 3.43.47 PM (11).jpeg": "exotica_064.jpg",
    "WhatsApp Image 2026-06-12 at 3.43.47 PM (2).jpeg": "exotica_065.jpg",
    "WhatsApp Image 2026-06-12 at 3.43.47 PM (3).jpeg": "exotica_066.jpg",
    "WhatsApp Image 2026-06-12 at 3.43.47 PM (4).jpeg": "exotica_067.jpg",
    "WhatsApp Image 2026-06-12 at 3.43.47 PM (5).jpeg": "exotica_068.jpg",
    "WhatsApp Image 2026-06-12 at 3.43.47 PM (6).jpeg": "exotica_069.jpg",
    "WhatsApp Image 2026-06-12 at 3.43.47 PM (7).jpeg": "exotica_070.jpg",
    "WhatsApp Image 2026-06-12 at 3.43.47 PM (8).jpeg": "exotica_071.jpg",
    "WhatsApp Image 2026-06-12 at 3.43.47 PM (9).jpeg": "exotica_072.jpg",
    "WhatsApp Image 2026-06-12 at 3.43.47 PM.jpeg": "exotica_073.jpg",
    "WhatsApp Image 2026-06-12 at 3.43.49 PM (1).jpeg": "exotica_074.jpg",
    "WhatsApp Image 2026-06-12 at 3.43.49 PM.jpeg": "exotica_075.jpg",
}

# Product data from subagent with price lookup from PDFs
# Prices reference from PDFs; fallback to market prices for imported goods
products_data = [
    # Coca-Cola
    ("WhatsApp Image 2026-06-12 at 2.25.07 PM.jpeg", "Coca-Cola Original", "Drinks", "USA", 200),
    ("WhatsApp Image 2026-06-12 at 2.25.07 PM (1).jpeg", "Coca-Cola Zero Sugar", "Drinks", "USA", 200),
    ("WhatsApp Image 2026-06-12 at 2.25.07 PM (2).jpeg", "Coca-Cola Cherry", "Drinks", "USA", 220),
    # Pepsi
    ("WhatsApp Image 2026-06-12 at 2.25.09 PM.jpeg", "Pepsi Black Zero Sugar", "Drinks", "USA", 180),
    ("WhatsApp Image 2026-06-12 at 2.25.10 PM.jpeg", "Pepsi Original", "Drinks", "USA", 180),
    ("WhatsApp Image 2026-06-12 at 2.25.10 PM (1).jpeg", "Pepsi Mango", "Drinks", "USA", 180),
    ("WhatsApp Image 2026-06-12 at 2.25.10 PM (2).jpeg", "Pepsi Lime", "Drinks", "USA", 180),
    # Mountain Dew
    ("WhatsApp Image 2026-06-12 at 2.25.10 PM (3).jpeg", "Mountain Dew Original", "Drinks", "USA", 200),
    ("WhatsApp Image 2026-06-12 at 2.25.10 PM (4).jpeg", "Mountain Dew Baja Blast", "Drinks", "USA", 220),
    ("WhatsApp Image 2026-06-12 at 2.25.10 PM (5).jpeg", "Mountain Dew Code Red", "Drinks", "USA", 220),
    # 7UP
    ("WhatsApp Image 2026-06-12 at 2.25.10 PM (6).jpeg", "7UP Original", "Drinks", "USA", 180),
    ("WhatsApp Image 2026-06-12 at 2.25.10 PM (7).jpeg", "7UP Lemon Lemon", "Drinks", "USA", 180),
    # Sprite
    ("WhatsApp Image 2026-06-12 at 2.25.10 PM (8).jpeg", "Sprite Original", "Drinks", "USA", 180),
    ("WhatsApp Image 2026-06-12 at 2.25.10 PM (9).jpeg", "Sprite Cranberry", "Drinks", "USA", 200),
    # Fanta
    ("WhatsApp Image 2026-06-12 at 2.25.10 PM (10).jpeg", "Fanta Orange", "Drinks", "USA", 180),
    ("WhatsApp Image 2026-06-12 at 2.25.10 PM (11).jpeg", "Fanta Watermelon", "Drinks", "USA", 200),
    ("WhatsApp Image 2026-06-12 at 2.25.10 PM (12).jpeg", "Fanta Blue Raspberry", "Drinks", "USA", 200),
    ("WhatsApp Image 2026-06-12 at 2.25.10 PM (13).jpeg", "Fanta Pineapple", "Drinks", "USA", 180),
    ("WhatsApp Image 2026-06-12 at 2.25.10 PM (14).jpeg", "Fanta Mango", "Drinks", "USA", 180),
    # Coca-Cola Creations
    ("WhatsApp Image 2026-06-12 at 2.25.11 PM.jpeg", "Coca-Cola Starlight", "Drinks", "USA", 250),
    ("WhatsApp Image 2026-06-12 at 2.25.11 PM (1).jpeg", "Coca-Cola Dreamworld", "Drinks", "USA", 250),
    ("WhatsApp Image 2026-06-12 at 2.25.11 PM (2).jpeg", "Coca-Cola Marshmello Edition", "Drinks", "USA", 280),
    ("WhatsApp Image 2026-06-12 at 2.25.11 PM (3).jpeg", "Coca-Cola Byte", "Drinks", "USA", 250),
    ("WhatsApp Image 2026-06-12 at 2.25.11 PM (4).jpeg", "Coca-Cola Creations Ultimate", "Drinks", "USA", 280),
    ("WhatsApp Image 2026-06-12 at 2.25.11 PM (5).jpeg", "Coca-Cola Spiced", "Drinks", "USA", 250),
    ("WhatsApp Image 2026-06-12 at 2.25.11 PM (6).jpeg", "Coca-Cola Orange Cream", "Drinks", "USA", 250),
    ("WhatsApp Image 2026-06-12 at 2.25.11 PM (7).jpeg", "Coca-Cola Peach", "Drinks", "USA", 220),
    ("WhatsApp Image 2026-06-12 at 2.25.11 PM (8).jpeg", "Coca-Cola Lemon", "Drinks", "USA", 220),
    ("WhatsApp Image 2026-06-12 at 2.25.11 PM (9).jpeg", "Coca-Cola Raspberry", "Drinks", "USA", 220),
    ("WhatsApp Image 2026-06-12 at 2.25.11 PM (10).jpeg", "Coca-Cola Move", "Drinks", "USA", 250),
    ("WhatsApp Image 2026-06-12 at 2.25.11 PM (11).jpeg", "Coca-Cola Vanilla", "Drinks", "USA", 220),
    # Asian Fanta
    ("WhatsApp Image 2026-06-12 at 2.25.11 PM (12).jpeg", "Fanta Grape", "Drinks", "Vietnam", 150),
    ("WhatsApp Image 2026-06-12 at 2.25.11 PM (13).jpeg", "Fanta Lychee", "Drinks", "Vietnam", 150),
    ("WhatsApp Image 2026-06-12 at 2.25.11 PM (14).jpeg", "Fanta Strawberry", "Drinks", "Vietnam", 150),
    # Mirinda
    ("WhatsApp Image 2026-06-12 at 2.25.11 PM (15).jpeg", "Mirinda Sarsaparilla", "Drinks", "Vietnam", 120),
    ("WhatsApp Image 2026-06-12 at 2.25.11 PM (16).jpeg", "Mirinda Orange", "Drinks", "Vietnam", 120),
    ("WhatsApp Image 2026-06-12 at 2.25.12 PM.jpeg", "Mirinda Pineapple", "Drinks", "Vietnam", 120),
    ("WhatsApp Image 2026-06-12 at 2.25.12 PM (1).jpeg", "Mirinda Cream Soda", "Drinks", "Vietnam", 120),
    # Dr Pepper
    ("WhatsApp Image 2026-06-12 at 2.25.12 PM (2).jpeg", "Dr Pepper & Cream Soda", "Drinks", "USA", 280),
    # Glinter
    ("WhatsApp Image 2026-06-12 at 2.25.12 PM (3).jpeg", "Glinter Sparkling Blueberry", "Drinks", "Thailand", 130),
    # Vinut Popping Boba
    ("WhatsApp Image 2026-06-12 at 2.25.12 PM (4).jpeg", "Vinut Popping Boba Strawberry", "Drinks", "Vietnam", 150),
    ("WhatsApp Image 2026-06-12 at 2.25.12 PM (5).jpeg", "Vinut Popping Boba Mango", "Drinks", "Vietnam", 150),
    # Kinza
    ("WhatsApp Image 2026-06-12 at 2.25.12 PM (6).jpeg", "Kinza Cola", "Drinks", "Saudi Arabia", 130),
    ("WhatsApp Image 2026-06-12 at 2.25.12 PM (7).jpeg", "Kinza Citrus", "Drinks", "Saudi Arabia", 130),
    ("WhatsApp Image 2026-06-12 at 2.25.12 PM (8).jpeg", "Kinza Pomegranate", "Drinks", "Saudi Arabia", 130),
    ("WhatsApp Image 2026-06-12 at 2.25.12 PM (9).jpeg", "Kinza Blackcurrant", "Drinks", "Saudi Arabia", 130),
    ("WhatsApp Image 2026-06-12 at 2.25.12 PM (10).jpeg", "Kinza Lemon", "Drinks", "Saudi Arabia", 130),
    ("WhatsApp Image 2026-06-12 at 2.25.12 PM (11).jpeg", "Kinza Orange", "Drinks", "Saudi Arabia", 130),
    # Mabu Coco
    ("WhatsApp Image 2026-06-12 at 2.25.12 PM (12).jpeg", "Mabu Coco Orange Juice", "Drinks", "Thailand", 100),
    ("WhatsApp Image 2026-06-12 at 2.25.12 PM (13).jpeg", "Mabu Coco Pineapple Juice", "Drinks", "Thailand", 100),
    ("WhatsApp Image 2026-06-12 at 2.25.12 PM (14).jpeg", "Mabu Coco Strawberry Juice", "Drinks", "Thailand", 100),
    ("WhatsApp Image 2026-06-12 at 2.25.12 PM (15).jpeg", "Mabu Coco Lychee Juice", "Drinks", "Thailand", 100),
    # Prime
    ("WhatsApp Image 2026-06-12 at 2.25.12 PM (16).jpeg", "Prime Hydration", "Drinks", "USA", 400),
    # Coffee
    ("WhatsApp Image 2026-06-12 at 2.25.12 PM (17).jpeg", "Nescafe Latte Can", "Drinks", "Thailand", 200),
    ("WhatsApp Image 2026-06-12 at 2.25.12 PM (18).jpeg", "Starbucks Frappuccino Caramel", "Drinks", "USA", 350),
    ("WhatsApp Image 2026-06-12 at 2.25.12 PM (19).jpeg", "Nescafe Cappuccino Can", "Drinks", "Thailand", 200),
    # Rani
    ("WhatsApp Image 2026-06-12 at 2.25.12 PM (20).jpeg", "Rani Float Pineapple", "Drinks", "UAE", 150),
    ("WhatsApp Image 2026-06-12 at 2.25.12 PM (21).jpeg", "Rani Float Peach", "Drinks", "UAE", 150),
    # Lindt Excellence
    ("WhatsApp Image 2026-06-12 at 3.43.46 PM.jpeg", "Lindt Excellence Chili Dark", "Chocolates", "Switzerland", 550),
    ("WhatsApp Image 2026-06-12 at 3.43.46 PM (1).jpeg", "Lindt Excellence Raspberry Intense", "Chocolates", "Switzerland", 550),
    ("WhatsApp Image 2026-06-12 at 3.43.46 PM (2).jpeg", "Lindt Excellence Caramel Sea Salt", "Chocolates", "Switzerland", 550),
    # Lindt Lindor
    ("WhatsApp Image 2026-06-12 at 3.43.47 PM.jpeg", "Lindt Lindor Milk Chocolate Bar", "Chocolates", "Switzerland", 950),
    ("WhatsApp Image 2026-06-12 at 3.43.47 PM (1).jpeg", "Lindt Lindor Hazelnut Milk Bar", "Chocolates", "Switzerland", 950),
    ("WhatsApp Image 2026-06-12 at 3.43.47 PM (2).jpeg", "Lindt Lindor 60% Dark Truffles Box", "Chocolates", "Switzerland", 799),
    ("WhatsApp Image 2026-06-12 at 3.43.47 PM (3).jpeg", "Lindt Receta Original Dark 52%", "Chocolates", "Spain", 450),
    ("WhatsApp Image 2026-06-12 at 3.43.47 PM (4).jpeg", "Lindt Swiss Classic Fruit & Nut", "Chocolates", "Switzerland", 499),
    ("WhatsApp Image 2026-06-12 at 3.43.47 PM (5).jpeg", "Lindt Swiss Classic Hazelnuts", "Chocolates", "Switzerland", 499),
    ("WhatsApp Image 2026-06-12 at 3.43.47 PM (6).jpeg", "Lindt Swiss Classic Almond Hazelnut", "Chocolates", "Switzerland", 499),
    ("WhatsApp Image 2026-06-12 at 3.43.47 PM (7).jpeg", "Lindt Receta Original Milk", "Chocolates", "Spain", 420),
    ("WhatsApp Image 2026-06-12 at 3.43.47 PM (8).jpeg", "Lindt Receta Original Hazelnut", "Chocolates", "Spain", 450),
    ("WhatsApp Image 2026-06-12 at 3.43.47 PM (9).jpeg", "Lindt Receta Hazelnut Milk (Large)", "Chocolates", "Spain", 699),
    ("WhatsApp Image 2026-06-12 at 3.43.47 PM (10).jpeg", "Lindt Lindor Assorted Truffles Box", "Chocolates", "Switzerland", 999),
    ("WhatsApp Image 2026-06-12 at 3.43.47 PM (11).jpeg", "Lindt Lindor 70% Dark Truffles Box", "Chocolates", "Switzerland", 899),
    ("WhatsApp Image 2026-06-12 at 3.43.49 PM.jpeg", "Lindt Lindor Milk Chocolate Box", "Chocolates", "Switzerland", 899),
    ("WhatsApp Image 2026-06-12 at 3.43.49 PM (1).jpeg", "Lindt Sensation Blueberry Acai", "Chocolates", "Switzerland", 650),
]

# Build final products list
products = []
for i, (filename, name, category, country, price) in enumerate(products_data):
    img_file = filename_map.get(filename, "")
    img_path = f"/products/exotica/{img_file}" if img_file else ""
    product_id = f"ex_{i+1:03d}"
    products.append({
        "id": product_id,
        "name": name,
        "price": price,
        "image": img_path,
        "category": category,
        "country": country
    })

# Save to JSON
with open("src/components/exotica_products.json", "w") as f:
    json.dump(products, f, indent=2)

print(f"Generated {len(products)} products")
for p in products:
    print(f"  {p['id']}: {p['name']} - ₹{p['price']} - {p['image']}")
