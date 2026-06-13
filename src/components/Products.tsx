'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useCart, CartItem } from '@/context/CartContext'

type Product = Omit<CartItem, 'quantity'> & {
  ingredients?: string
  description?: string
  origin?: string
  images?: string[]   // Additional photos (back, sides, details). First image is always the front.
}

const PRODUCTS: Product[] = [
  { id: 'ex_001', name: 'Monster Ultra Roza', price: 200, image: '/products/exotica/exotica_003.jpg', images: ['/products/exotica/exotica_003_side.png', '/products/exotica/exotica_003_back.png'], category: 'Drinks', country: 'USA', description: 'Zero sugar energy drink with a refreshing pink grapefruit flavor.', ingredients: 'Carbonated Water, Citric Acid, Natural & Artificial Flavors, Taurine, Sodium Citrate, Caffeine, Niacinamide, D-Glucuronolactone, Pyridoxine HCl, Cyanocobalamin' },
  { id: 'ex_002', name: 'Monster Ultra Peachy Keen', price: 200, image: '/products/exotica/exotica_001.jpg', images: ['/products/exotica/exotica_001_back.png'], category: 'Drinks', country: 'USA', description: 'Ultra smooth zero sugar energy with a luscious peach flavor.', ingredients: 'Carbonated Water, Peach Flavor, Citric Acid, Taurine, Caffeine, Niacinamide, Sodium Citrate, Pyridoxine HCl, Cyanocobalamin' },
  { id: 'ex_003', name: 'Monster Ultra Strawberry Dreams', price: 220, image: '/products/exotica/exotica_002.jpg', images: ['/products/exotica/exotica_002_back.png', '/products/exotica/exotica_002_lifestyle.png'], category: 'Drinks', country: 'USA', description: 'Dreamy strawberry flavor with Monster\'s legendary zero sugar energy blend.', ingredients: 'Carbonated Water, Strawberry Natural Flavor, Citric Acid, Taurine, Caffeine, Niacinamide, Sodium Citrate, Pyridoxine HCl, Cyanocobalamin' },
  { id: 'ex_004', name: 'Monster Punch MIXXD Energy', price: 180, image: '/products/exotica/exotica_004.jpg', category: 'Drinks', country: 'USA', description: 'A tropical punch blend of flavors for a powerful energy kick.', ingredients: 'Carbonated Water, High Fructose Corn Syrup, Citric Acid, Natural Flavors, Taurine, Sodium Citrate, Caffeine, Benzoic Acid, Sorbic Acid, Niacinamide, Sucralose' },
  { id: 'ex_005', name: 'Monster Pinepine Punch', price: 180, image: '/products/exotica/exotica_019.jpg', category: 'Drinks', country: 'USA', description: 'Bursting pineapple energy punch — tropical vibes in every can.', ingredients: 'Carbonated Water, Pineapple Flavor, Sugar, Citric Acid, Taurine, Caffeine, Niacinamide, Sodium Citrate, Pyridoxine HCl' },
  { id: 'ex_006', name: 'Monster Aussie Lemonade', price: 180, image: '/products/exotica/exotica_005.jpg', category: 'Drinks', country: 'USA', description: 'A crisp, refreshing lemonade flavor inspired by Australia.', ingredients: 'Carbonated Water, Lemon Juice Concentrate, Natural Lemonade Flavor, Citric Acid, Taurine, Caffeine, Niacinamide, Sucralose' },
  { id: 'ex_007', name: 'Monster Rio Punch', price: 180, image: '/products/exotica/exotica_011.jpg', images: ['/products/exotica/exotica_011_back.png'], category: 'Drinks', country: 'USA', description: 'Bold tropical punch inspired by the streets of Rio de Janeiro.', ingredients: 'Carbonated Water, Tropical Fruit Blend, Citric Acid, Taurine, Caffeine, Niacinamide, Sodium Citrate' },
  { id: 'ex_008', name: 'Monster Mango Loco', price: 200, image: '/products/exotica/exotica_012.jpg', category: 'Drinks', country: 'USA', description: 'Loco for mango — a sweet and fruity energy rush.', ingredients: 'Carbonated Water, Mango Puree Concentrate, Citric Acid, Natural Mango Flavor, Taurine, Caffeine, Niacinamide, Sucralose, Pyridoxine HCl' },
  { id: 'ex_009', name: 'Monster Mariposa', price: 220, image: '/products/exotica/exotica_013.jpg', category: 'Drinks', country: 'USA', description: 'A light, refreshing citrus blend with tropical undertones.', ingredients: 'Carbonated Water, Citrus Juice Concentrate, Natural Flavors, Citric Acid, Taurine, Caffeine, Niacinamide, Sucralose' },
  { id: 'ex_010', name: 'Monster Ultra Watermelon', price: 220, image: '/products/exotica/exotica_014.jpg', category: 'Drinks', country: 'USA', description: 'Zero sugar ultra energy with a crisp watermelon flavor.', ingredients: 'Carbonated Water, Watermelon Natural Flavor, Citric Acid, Taurine, Caffeine, Niacinamide, Sodium Citrate, Sucralose, Pyridoxine HCl, Cyanocobalamin' },
  { id: 'ex_011', name: 'Monster Pacific Punch', price: 180, image: '/products/exotica/exotica_015.jpg', category: 'Drinks', country: 'USA', description: 'Hawaiian punch vibes with Monster energy. Island life in a can.', ingredients: 'Carbonated Water, High Fructose Corn Syrup, Natural Flavors, Citric Acid, Taurine, Caffeine, Niacinamide, Sucralose' },
  { id: 'ex_012', name: 'Monster Cosmic Peach', price: 180, image: '/products/exotica/exotica_016.jpg', category: 'Drinks', country: 'USA', description: 'Out-of-this-world peach flavor meets Monster\'s powerful energy blend.', ingredients: 'Carbonated Water, Peach Puree Concentrate, Natural Peach Flavor, Citric Acid, Taurine, Caffeine, Niacinamide, Sucralose, Cyanocobalamin' },
  { id: 'ex_013', name: 'Monster Energy White', price: 180, image: '/products/exotica/exotica_017.jpg', category: 'Drinks', country: 'USA', description: 'The legendary white can — zero sugar, zero calories, maximum energy.', ingredients: 'Carbonated Water, Citric Acid, Taurine, Sodium Citrate, Natural Flavors, Caffeine, Niacinamide, Sucralose, Pyridoxine HCl, Riboflavin, Cyanocobalamin' },
  { id: 'ex_014', name: 'Monster Energy Original (Sugar-less)', price: 200, image: '/products/exotica/exotica_018.jpg', category: 'Drinks', country: 'USA', description: 'Monster\'s iconic original energy formula, now sugar-free.', ingredients: 'Carbonated Water, Citric Acid, Taurine, Sodium Citrate, Caffeine, Niacinamide, Sucralose, Acesulfame Potassium, Sorbic Acid, Benzoic Acid, Pyridoxine HCl, Cyanocobalamin' },
  { id: 'ex_015', name: 'Monster Energy Nitro Super Dry', price: 180, image: '/products/exotica/exotica_006.jpg', category: 'Drinks', country: 'USA', description: 'Nitrogen-infused super dry energy for a clean, crisp kick.', ingredients: 'Carbonated Water with Nitrogen, Natural Flavors, Citric Acid, Taurine, Caffeine, Niacinamide, Sucralose, Pyridoxine HCl, Cyanocobalamin' },
  { id: 'ex_016', name: 'Monster Khaotic Energy', price: 200, image: '/products/exotica/exotica_007.jpg', category: 'Drinks', country: 'USA', description: 'Blended fruit energy juice with Monster\'s energy matrix.', ingredients: 'Carbonated Water, Apple Juice, Grape Juice, Natural Flavors, Citric Acid, Taurine, Caffeine, Niacinamide, Sucralose' },
  { id: 'ex_017', name: 'Monster Full Throttle Energy', price: 200, image: '/products/exotica/exotica_008.jpg', category: 'Drinks', country: 'USA', description: 'Full throttle, zero hesitation — bold citrus energy.', ingredients: 'Carbonated Water, High Fructose Corn Syrup, Citric Acid, Natural Flavors, Taurine, Sodium Citrate, Caffeine, Niacinamide, Sucralose, Sodium Benzoate' },
  { id: 'ex_018', name: 'Monster VR46', price: 180, image: '/products/exotica/exotica_009.jpg', category: 'Drinks', country: 'USA', description: 'Limited edition energy drink inspired by MotoGP legend Valentino Rossi.', ingredients: 'Carbonated Water, Natural Flavors, Citric Acid, Taurine, Caffeine, Niacinamide, Sucralose, Pyridoxine HCl, Cyanocobalamin' },
  { id: 'ex_019', name: 'Monster Lando Norris', price: 180, image: '/products/exotica/exotica_010.jpg', category: 'Drinks', country: 'USA', description: 'The Lando Norris F1 edition — made for champions.', ingredients: 'Carbonated Water, Natural Flavors, Citric Acid, Taurine, Caffeine, Niacinamide, Sucralose, Sodium Citrate, Pyridoxine HCl' },
  { id: 'ex_020', name: 'Monster Ripper Energy', price: 250, image: '/products/exotica/exotica_036.jpg', category: 'Drinks', country: 'USA', description: 'UK exclusive fruit juice energy blend. Rip it open.', ingredients: 'Carbonated Water, Apple Juice Concentrate, Citric Acid, Natural Flavors, Taurine, Caffeine, Niacinamide, Sucralose, Pyridoxine HCl, Cyanocobalamin' },
  { id: 'ex_021', name: 'Monster Ultra Fiesta Mango', price: 250, image: '/products/exotica/exotica_020.jpg', category: 'Drinks', country: 'USA', description: 'A fiesta of mango flavor — zero sugar, endless energy.', ingredients: 'Carbonated Water, Mango Natural Flavor, Citric Acid, Taurine, Caffeine, Niacinamide, Sucralose, Pyridoxine HCl, Cyanocobalamin' },
  { id: 'ex_022', name: 'Monster Bad Apple', price: 280, image: '/products/exotica/exotica_028.jpg', category: 'Drinks', country: 'USA', description: 'Crisp apple energy — be bad, taste good.', ingredients: 'Carbonated Water, Apple Juice Concentrate, Natural Flavors, Citric Acid, Taurine, Caffeine, Niacinamide, Sucralose, Pyridoxine HCl' },
  { id: 'ex_023', name: 'RedBull Kratingdaeng', price: 250, image: '/products/exotica/exotica_029.jpg', category: 'Drinks', country: 'USA', description: 'The original Thai Red Bull formula — the one that started it all.', ingredients: 'Water, Sugar, Citric Acid, Sodium Citrate, Caffeine, Inositol, Niacinamide, Pantothenic Acid, Pyridoxine HCl, Cyanocobalamin, Natural & Artificial Flavors' },
  { id: 'ex_024', name: 'RedBull Original', price: 280, image: '/products/exotica/exotica_030.jpg', category: 'Drinks', country: 'USA', description: 'The iconic original Red Bull energy drink. Gives you wings.', ingredients: 'Carbonated Water, Sucrose, Glucose, Citric Acid, Taurine, Sodium Bicarbonate, Magnesium Carbonate, Caffeine, Niacinamide, Pyridoxine HCl, Calcium Pantothenate, Artificial Flavors, Colors' },
  { id: 'ex_025', name: 'RedBull Apple Muscat Grape', price: 250, image: '/products/exotica/exotica_031.jpg', category: 'Drinks', country: 'USA', description: 'Summer edition Red Bull with apple and muscat grape notes.', ingredients: 'Carbonated Water, Sucrose, Glucose, Taurine, Sodium Citrate, Caffeine, Apple & Grape Natural Flavors, Niacinamide, Pyridoxine HCl, Calcium Pantothenate, Cyanocobalamin' },
  { id: 'ex_026', name: 'RedBull Blueberry & Blackcurrant', price: 250, image: '/products/exotica/exotica_032.jpg', category: 'Drinks', country: 'USA', description: 'Rich summer berries meet Red Bull\'s legendary energy formula.', ingredients: 'Carbonated Water, Sucrose, Glucose, Taurine, Citric Acid, Caffeine, Blueberry & Blackcurrant Natural Flavors, Niacinamide, Pyridoxine HCl, Cyanocobalamin' },
  { id: 'ex_027', name: 'RedBull Summer Berry', price: 220, image: '/products/exotica/exotica_033.jpg', category: 'Drinks', country: 'USA', description: 'A fruity summer berry twist on the classic Red Bull.', ingredients: 'Carbonated Water, Sucrose, Glucose, Taurine, Sodium Citrate, Caffeine, Natural Berry Flavors, Niacinamide, Pyridoxine HCl, Calcium Pantothenate, Cyanocobalamin' },
  { id: 'ex_028', name: 'Milaf Cola', price: 220, image: '/products/exotica/exotica_034.jpg', category: 'Drinks', country: 'USA', description: 'Premium imported cola with a distinctive, bold flavor profile.', ingredients: 'Carbonated Water, High Fructose Corn Syrup, Caramel Color, Phosphoric Acid, Natural Flavors, Caffeine' },
  { id: 'ex_029', name: 'Pepsi Zero Sugar Lime', price: 220, image: '/products/exotica/exotica_035.jpg', category: 'Drinks', country: 'USA', description: 'Crisp zero sugar Pepsi with a refreshing lime twist.', ingredients: 'Carbonated Water, Caramel Color, Phosphoric Acid, Aspartame, Potassium Benzoate, Caffeine, Natural Lime Flavor, Citric Acid, Acesulfame Potassium' },
  { id: 'ex_031', name: 'Coca-Cola Vanilla', price: 220, image: '/products/exotica/exotica_022.jpg', category: 'Drinks', country: 'USA', description: 'Classic Coca-Cola enhanced with a smooth, creamy vanilla flavor.', ingredients: 'Carbonated Water, High Fructose Corn Syrup, Caramel Color, Phosphoric Acid, Natural Flavors (Including Vanilla), Caffeine' },
  { id: 'ex_032', name: 'Fanta Grape', price: 150, image: '/products/exotica/exotica_023.jpg', category: 'Drinks', country: 'Vietnam', description: 'Vibrant grape Fanta — a fruity fizz explosion.', ingredients: 'Carbonated Water, Sugar, Citric Acid, Natural Grape Flavor, Sodium Benzoate, Grape Juice Concentrate, Color (E133)' },
  { id: 'ex_033', name: 'Fanta Lychee', price: 150, image: '/products/exotica/exotica_024.jpg', category: 'Drinks', country: 'Vietnam', description: 'Exotic lychee-flavored Fanta — Asian exclusive, now in India.', ingredients: 'Carbonated Water, Sugar, Lychee Juice Concentrate, Citric Acid, Natural Lychee Flavor, Sodium Benzoate, Color (E102, E110)' },
  { id: 'ex_034', name: 'Fanta Strawberry', price: 150, image: '/products/exotica/exotica_025.jpg', category: 'Drinks', country: 'Vietnam', description: 'Sweet and bubbly strawberry soda from Fanta\'s Asian collection.', ingredients: 'Carbonated Water, Sugar, Strawberry Juice Concentrate, Citric Acid, Natural Strawberry Flavor, Sodium Benzoate' },
  { id: 'ex_035', name: 'Mirinda Sarsaparilla', price: 120, image: '/products/exotica/exotica_026.jpg', category: 'Drinks', country: 'Vietnam', description: 'A unique sarsaparilla-flavored soda with a classic herbal taste.', ingredients: 'Carbonated Water, Sugar, Citric Acid, Sarsaparilla Natural Flavor, Sodium Benzoate, Caramel Color' },
  { id: 'ex_036', name: 'Mirinda Orange', price: 120, image: '/products/exotica/exotica_027.jpg', category: 'Drinks', country: 'Vietnam', description: 'Classic orange Mirinda with a vibrant, zesty flavor.', ingredients: 'Carbonated Water, Sugar, Citric Acid, Natural Orange Flavor, Sodium Benzoate, Color (Sunset Yellow)' },
  { id: 'ex_037', name: 'Mirinda Pineapple', price: 120, image: '/products/exotica/exotica_058.jpg', category: 'Drinks', country: 'Vietnam', description: 'Tropical pineapple Mirinda — refreshing and fizzy.', ingredients: 'Carbonated Water, Sugar, Citric Acid, Natural Pineapple Flavor, Sodium Benzoate, Color (E102)' },
  { id: 'ex_038', name: 'Mirinda Cream Soda', price: 120, image: '/products/exotica/exotica_037.jpg', category: 'Drinks', country: 'Vietnam', description: 'Smooth and creamy soda with a sweet vanilla finish.', ingredients: 'Carbonated Water, Sugar, Citric Acid, Cream Soda Natural Flavor, Vanilla Extract, Sodium Benzoate' },
  { id: 'ex_039', name: 'Dr Pepper & Cream Soda', price: 280, image: '/products/exotica/exotica_048.jpg', category: 'Drinks', country: 'USA', description: 'Dr Pepper\'s signature 23-flavor blend mixed with creamy vanilla soda.', ingredients: 'Carbonated Water, High Fructose Corn Syrup, Caramel Color, Phosphoric Acid, Natural and Artificial Flavors, Sodium Benzoate, Caffeine' },
  { id: 'ex_040', name: 'Glinter Sparkling Blueberry', price: 130, image: '/products/exotica/exotica_051.jpg', category: 'Drinks', country: 'Thailand', description: 'Sparkling blueberry soda from Thailand — light and refreshing.', ingredients: 'Carbonated Water, Sugar, Blueberry Juice Concentrate, Citric Acid, Natural Blueberry Flavor, Sodium Benzoate' },
  { id: 'ex_041', name: 'Vinut Popping Boba Strawberry', price: 150, image: '/products/exotica/exotica_052.jpg', category: 'Drinks', country: 'Vietnam', description: 'Fun Vietnamese juice drink with real strawberry popping boba inside.', ingredients: 'Water, Sugar, Strawberry Juice Concentrate (8%), Popping Boba (Tapioca Starch, Sugar, Strawberry Flavor, Color E129), Citric Acid, Sodium Benzoate' },
  { id: 'ex_042', name: 'Vinut Popping Boba Mango', price: 150, image: '/products/exotica/exotica_053.jpg', category: 'Drinks', country: 'Vietnam', description: 'Tropical mango juice with popping boba pearls from Vietnam.', ingredients: 'Water, Sugar, Mango Puree (10%), Popping Boba (Tapioca Starch, Sugar, Mango Flavor, Color E110), Citric Acid, Sodium Benzoate' },
  { id: 'ex_043', name: 'Kinza Cola', price: 130, image: '/products/exotica/exotica_054.jpg', category: 'Drinks', country: 'Saudi Arabia', description: 'Saudi premium cola — bold and distinctly flavored.', ingredients: 'Carbonated Water, Sugar, Caramel Color, Phosphoric Acid, Natural Cola Flavor, Caffeine' },
  { id: 'ex_044', name: 'Kinza Citrus', price: 130, image: '/products/exotica/exotica_055.jpg', category: 'Drinks', country: 'Saudi Arabia', description: 'Refreshing citrus soda from Saudi Arabia\'s premium Kinza range.', ingredients: 'Carbonated Water, Sugar, Citric Acid, Natural Citrus Flavor, Sodium Benzoate, Color (E102)' },
  { id: 'ex_045', name: 'Kinza Pomegranate', price: 130, image: '/products/exotica/exotica_056.jpg', category: 'Drinks', country: 'Saudi Arabia', description: 'Rich pomegranate soda with a jewel-toned, antioxidant-rich profile.', ingredients: 'Carbonated Water, Sugar, Pomegranate Juice Concentrate, Citric Acid, Natural Pomegranate Flavor, Sodium Benzoate, Color (E129)' },
  { id: 'ex_046', name: 'Kinza Blackcurrant', price: 130, image: '/products/exotica/exotica_057.jpg', category: 'Drinks', country: 'Saudi Arabia', description: 'Deep, dark blackcurrant fizz from the Kinza premium collection.', ingredients: 'Carbonated Water, Sugar, Blackcurrant Juice Concentrate, Citric Acid, Natural Blackcurrant Flavor, Sodium Benzoate, Color (E122)' },
  { id: 'ex_047', name: 'Kinza Lemon', price: 130, image: '/products/exotica/exotica_038.jpg', category: 'Drinks', country: 'Saudi Arabia', description: 'Tangy and refreshing lemon soda from Saudi Arabia.', ingredients: 'Carbonated Water, Sugar, Citric Acid, Natural Lemon Flavor, Sodium Benzoate' },
  { id: 'ex_048', name: 'Kinza Orange', price: 130, image: '/products/exotica/exotica_039.jpg', category: 'Drinks', country: 'Saudi Arabia', description: 'Classic orange soda with a Middle Eastern premium twist.', ingredients: 'Carbonated Water, Sugar, Citric Acid, Orange Juice Concentrate, Natural Orange Flavor, Sodium Benzoate, Color (E110)' },
  { id: 'ex_049', name: 'Mabu Coco Orange Juice', price: 100, image: '/products/exotica/exotica_040.jpg', category: 'Drinks', country: 'Thailand', description: 'Refreshing Thai coconut-orange juice blend.', ingredients: 'Water, Coconut Water, Orange Juice Concentrate (15%), Sugar, Citric Acid, Natural Orange Flavor, Ascorbic Acid' },
  { id: 'ex_050', name: 'Mabu Coco Pineapple Juice', price: 100, image: '/products/exotica/exotica_041.jpg', category: 'Drinks', country: 'Thailand', description: 'Tropical pineapple and coconut water juice from Thailand.', ingredients: 'Water, Coconut Water, Pineapple Juice Concentrate (15%), Sugar, Citric Acid, Natural Pineapple Flavor' },
  { id: 'ex_051', name: 'Mabu Coco Strawberry Juice', price: 100, image: '/products/exotica/exotica_042.jpg', category: 'Drinks', country: 'Thailand', description: 'Light strawberry coconut juice drink — perfect for hot days.', ingredients: 'Water, Coconut Water, Strawberry Juice Concentrate, Sugar, Citric Acid, Natural Strawberry Flavor, Color (E129)' },
  { id: 'ex_052', name: 'Mabu Coco Lychee Juice', price: 100, image: '/products/exotica/exotica_043.jpg', category: 'Drinks', country: 'Thailand', description: 'Delicate lychee and coconut water combination from Thailand.', ingredients: 'Water, Coconut Water, Lychee Juice Concentrate, Sugar, Citric Acid, Natural Lychee Flavor' },
  { id: 'ex_053', name: 'Prime Hydration', price: 400, image: '/products/exotica/exotica_044.jpg', category: 'Drinks', country: 'USA', description: 'KSI & Logan Paul\'s viral sports hydration drink. Electrolytes & BCAAs.', ingredients: 'Filtered Water, Coconut Water, Citric Acid, Dipotassium Phosphate, Trimagnesium Citrate, Natural Flavor, L-Leucine, L-Isoleucine, L-Valine, Sucralose, Acesulfame Potassium' },
  { id: 'ex_054', name: 'Nescafe Latte Can', price: 200, image: '/products/exotica/exotica_045.jpg', category: 'Drinks', country: 'Thailand', description: 'Premium ready-to-drink Nescafe latte in a chilled can.', ingredients: 'Water, Skimmed Milk, Sugar, Coffee Extract (4%), Stabilizers (E460, E466), Acidity Regulator (E331)' },
  { id: 'ex_055', name: 'Starbucks Frappuccino Caramel', price: 350, image: '/products/exotica/exotica_046.jpg', category: 'Drinks', country: 'USA', description: 'The iconic Starbucks caramel Frappuccino in a bottle — anytime, anywhere.', ingredients: 'Milk, Brewed Starbucks Coffee (Water, Coffee), Skim Milk, Sugar, Cream, Caramel Syrup, Mono and Diglycerides, Pectin, Carrageenan, Natural Flavors, Vitamin A Palmitate' },
  { id: 'ex_056', name: 'Nescafe Cappuccino Can', price: 200, image: '/products/exotica/exotica_047.jpg', category: 'Drinks', country: 'Thailand', description: 'Frothy cappuccino taste in a convenient ready-to-drink can.', ingredients: 'Water, Skim Milk Powder, Sugar, Coffee (3%), Cocoa Powder, Stabilizers (E460, E466, E407a), Acidity Regulator (E331)' },
  { id: 'ex_057', name: 'Rani Float Pineapple', price: 150, image: '/products/exotica/exotica_049.jpg', category: 'Drinks', country: 'UAE', description: 'Real fruit pieces floating in pineapple juice — iconic Middle Eastern drink.', ingredients: 'Pineapple Juice Concentrate, Water, Sugar, Pineapple Fruit Pieces (6%), Citric Acid, Ascorbic Acid, Natural Pineapple Flavor' },
  { id: 'ex_058', name: 'Rani Float Peach', price: 150, image: '/products/exotica/exotica_050.jpg', category: 'Drinks', country: 'UAE', description: 'Luscious peach juice with real floating peach fruit pieces from UAE.', ingredients: 'Peach Juice Concentrate, Water, Sugar, Peach Fruit Pieces (6%), Citric Acid, Ascorbic Acid, Natural Peach Flavor' },
  { id: 'ex_059', name: 'Lindt Excellence Chili Dark', price: 550, image: '/products/exotica/exotica_061.jpg', category: 'Chocolates', country: 'Switzerland', description: 'Bold 47% dark chocolate infused with a fiery chili kick. A daring combination.', ingredients: 'Sugar, Cocoa Mass, Cocoa Butter, Bourbon Vanilla Beans, Chili Powder (0.5%), Emulsifier (Soya Lecithin). Cocoa Solids: 47% min.' },
  { id: 'ex_060', name: 'Lindt Excellence Raspberry Intense', price: 550, image: '/products/exotica/exotica_059.jpg', category: 'Chocolates', country: 'Switzerland', description: 'Intense dark chocolate paired with the vibrant tartness of raspberries.', ingredients: 'Sugar, Cocoa Mass, Cocoa Butter, Raspberries (4%), Emulsifier (Soya Lecithin), Bourbon Vanilla Beans. Cocoa Solids: 47% min.' },
  { id: 'ex_061', name: 'Lindt Excellence Caramel Sea Salt', price: 550, image: '/products/exotica/exotica_060.jpg', category: 'Chocolates', country: 'Switzerland', description: 'Smooth dark chocolate with a caramel swirl and crunchy sea salt crystals.', ingredients: 'Sugar, Cocoa Mass, Cocoa Butter, Caramel Pieces (8%)(Sugar, Glucose Syrup, Cream, Sea Salt, Butter), Emulsifier (Soya Lecithin), Bourbon Vanilla Beans.' },
  { id: 'ex_062', name: 'Lindt Lindor Milk Chocolate Bar', price: 950, image: '/products/exotica/exotica_073.jpg', category: 'Chocolates', country: 'Switzerland', description: 'A smooth milk chocolate bar with Lindt\'s signature melt-in-your-mouth filling.', ingredients: 'Sugar, Whole Milk Powder, Cocoa Butter, Cocoa Mass, Skimmed Milk Powder, Butteroil, Emulsifier (Soya Lecithin), Vanilla. Cocoa Solids: 28% min. Milk Solids: 14% min.' },
  { id: 'ex_063', name: 'Lindt Lindor Hazelnut Milk Bar', price: 950, image: '/products/exotica/exotica_062.jpg', category: 'Chocolates', country: 'Switzerland', description: 'Creamy milk chocolate bar packed with crunchy roasted hazelnuts.', ingredients: 'Sugar, Whole Milk Powder, Cocoa Butter, Hazelnuts (15%), Cocoa Mass, Skimmed Milk Powder, Emulsifier (Soya Lecithin), Vanilla.' },
  { id: 'ex_064', name: 'Lindt Lindor 60% Dark Truffles Box', price: 799, image: '/products/exotica/exotica_065.jpg', category: 'Chocolates', country: 'Switzerland', description: 'Individually wrapped 60% dark chocolate truffles with a smooth liquid center.', ingredients: 'Sugar, Cocoa Mass, Cocoa Butter, Milkfat, Emulsifier (Soya Lecithin), Vanilla. Cocoa Solids: 60% min.' },
  { id: 'ex_065', name: 'Lindt Receta Original Dark 52%', price: 450, image: '/products/exotica/exotica_066.jpg', category: 'Chocolates', country: 'Spain', description: 'Classic Spanish recipe 52% dark chocolate — smooth and full-bodied.', ingredients: 'Cocoa Mass, Sugar, Cocoa Butter, Emulsifier (Soya Lecithin), Vanilla. Cocoa Solids: 52% min.' },
  { id: 'ex_066', name: 'Lindt Swiss Classic Fruit & Nut', price: 499, image: '/products/exotica/exotica_067.jpg', category: 'Chocolates', country: 'Switzerland', description: 'Swiss milk chocolate bar studded with raisins, almonds, and hazelnuts.', ingredients: 'Sugar, Whole Milk Powder, Cocoa Butter, Almonds (10%), Raisins (8%), Hazelnuts (6%), Cocoa Mass, Emulsifier (Soya Lecithin), Vanilla.' },
  { id: 'ex_067', name: 'Lindt Swiss Classic Hazelnuts', price: 499, image: '/products/exotica/exotica_068.jpg', category: 'Chocolates', country: 'Switzerland', description: 'Crunchy whole hazelnuts enrobed in silky Swiss milk chocolate.', ingredients: 'Sugar, Whole Milk Powder, Cocoa Butter, Hazelnuts (18%), Cocoa Mass, Skimmed Milk Powder, Emulsifier (Soya Lecithin), Vanilla.' },
  { id: 'ex_068', name: 'Lindt Swiss Classic Almond Hazelnut', price: 499, image: '/products/exotica/exotica_069.jpg', category: 'Chocolates', country: 'Switzerland', description: 'Premium Swiss milk chocolate with whole roasted almonds and hazelnuts.', ingredients: 'Sugar, Whole Milk Powder, Cocoa Butter, Almonds (12%), Hazelnuts (8%), Cocoa Mass, Emulsifier (Soya Lecithin), Vanilla.' },
  { id: 'ex_069', name: 'Lindt Receta Original Milk', price: 420, image: '/products/exotica/exotica_070.jpg', category: 'Chocolates', country: 'Spain', description: 'Classic Spanish-recipe creamy milk chocolate.', ingredients: 'Sugar, Whole Milk Powder, Cocoa Butter, Cocoa Mass, Skimmed Milk Powder, Emulsifier (Soya Lecithin), Vanilla. Cocoa Solids: 34% min.' },
  { id: 'ex_070', name: 'Lindt Receta Original Hazelnut', price: 450, image: '/products/exotica/exotica_071.jpg', category: 'Chocolates', country: 'Spain', description: 'Spanish milk chocolate with crunchy roasted hazelnut pieces throughout.', ingredients: 'Sugar, Whole Milk Powder, Cocoa Butter, Hazelnuts (12%), Cocoa Mass, Emulsifier (Soya Lecithin), Vanilla.' },
  { id: 'ex_071', name: 'Lindt Receta Hazelnut Milk (Large)', price: 699, image: '/products/exotica/exotica_072.jpg', category: 'Chocolates', country: 'Spain', description: 'The large format Spanish hazelnut milk chocolate bar — perfect for sharing.', ingredients: 'Sugar, Whole Milk Powder, Cocoa Butter, Hazelnuts (14%), Cocoa Mass, Skimmed Milk Powder, Emulsifier (Soya Lecithin), Vanilla.' },
  { id: 'ex_072', name: 'Lindt Lindor Assorted Truffles Box', price: 999, image: '/products/exotica/exotica_063.jpg', category: 'Chocolates', country: 'Switzerland', description: 'A luxurious assortment of Lindor truffles — milk, dark & white.', ingredients: 'Sugar, Vegetable Fat, Cocoa Mass, Cocoa Butter, Whole Milk Powder, Milkfat, Emulsifier (Soya Lecithin), Vanilla. May contain Nuts.' },
  { id: 'ex_073', name: 'Lindt Lindor 70% Dark Truffles Box', price: 899, image: '/products/exotica/exotica_064.jpg', category: 'Chocolates', country: 'Switzerland', description: 'Intense 70% dark chocolate truffles with an irresistibly smooth center.', ingredients: 'Cocoa Mass, Sugar, Cocoa Butter, Milkfat, Emulsifier (Soya Lecithin), Vanilla. Cocoa Solids: 70% min.' },
  { id: 'ex_074', name: 'Lindt Lindor Milk Chocolate Box', price: 899, image: '/products/exotica/exotica_075.jpg', category: 'Chocolates', country: 'Switzerland', description: 'Classic box of Lindt Lindor milk chocolate truffles — a timeless gift.', ingredients: 'Sugar, Whole Milk Powder, Cocoa Butter, Cocoa Mass, Milkfat, Emulsifier (Soya Lecithin), Vanilla. Cocoa Solids: 28% min.' },
  { id: 'ex_075', name: 'Lindt Sensation Blueberry Acai', price: 650, image: '/products/exotica/exotica_074.jpg', category: 'Chocolates', country: 'Switzerland', description: 'Dark chocolate with a fruity blueberry & acai berry filling. Stunning.', ingredients: 'Sugar, Cocoa Mass, Cocoa Butter, Blueberry Puree (6%), Acai Powder, Emulsifier (Soya Lecithin), Vanilla, Natural Blueberry Flavor. Cocoa Solids: 47% min.' },
]

const CATEGORIES = ['All', 'Chocolates', 'Drinks', 'Candy', 'Biscuits', 'Other']

const CATEGORY_ICONS: Record<string, string> = {
  'All':        'fas fa-border-all',
  'Chocolates': 'fas fa-cube',
  'Drinks':     'fas fa-wine-bottle',
  'Candy':      'fas fa-candy-cane',
  'Biscuits':   'fas fa-cookie-bite',
  'Other':      'fas fa-star',
}

// ─── Product Quick View Modal ───────────────────────────────────────────────
interface QuickViewProps {
  product: Product
  onClose: () => void
}

function QuickViewModal({ product, onClose }: QuickViewProps) {
  const { addItem, items, updateQty } = useCart()
  const inCart = items.find(i => i.id === product.id)
  const inCartQty = inCart?.quantity ?? 0

  // Build the full image list: main image first, then any extra images
  const allImages = [product.image, ...(product.images ?? [])].filter(Boolean) as string[]
  const [activeIdx, setActiveIdx] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)

  // ── Zoom + Pan state ──
  const ZOOM_SCALE = 2.5
  const [zoomed, setZoomed]       = useState(false)
  const [origin, setOrigin]       = useState('50% 50%')   // transform-origin for zoom point
  const [pan, setPan]             = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({ startX: 0, startY: 0, startPanX: 0, startPanY: 0, moved: false })
  const wrapRef = useRef<HTMLDivElement>(null)

  // Reset when switching photos
  const handleSetActive = (idx: number) => {
    if (idx === activeIdx) return
    setZoomed(false)
    setPan({ x: 0, y: 0 })
    setImgLoaded(false)
    setActiveIdx(idx)
  }

  // Click on image: zoom in at exact click point, or zoom out
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragRef.current.moved) return   // was a drag, not a click
    const wrap = wrapRef.current
    if (!wrap) return

    if (zoomed) {
      // Zoom out — reset
      setZoomed(false)
      setPan({ x: 0, y: 0 })
      setOrigin('50% 50%')
    } else {
      // Zoom in at exact click point
      const rect = wrap.getBoundingClientRect()
      const xPct = ((e.clientX - rect.left) / rect.width)  * 100
      const yPct = ((e.clientY - rect.top)  / rect.height) * 100
      setOrigin(`${xPct.toFixed(1)}% ${yPct.toFixed(1)}%`)
      setZoomed(true)
    }
  }

  // Pointer drag handlers (unified mouse + touch)
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!zoomed) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { startX: e.clientX, startY: e.clientY, startPanX: pan.x, startPanY: pan.y, moved: false }
    setIsDragging(true)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragRef.current.moved = true
    setPan({ x: dragRef.current.startPanX + dx, y: dragRef.current.startPanY + dy })
  }

  const onPointerUp = () => {
    setIsDragging(false)
    setTimeout(() => { dragRef.current.moved = false }, 0)
  }

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     { onClose() }
      if (e.key === 'ArrowRight') handleSetActive((activeIdx + 1) % allImages.length)
      if (e.key === 'ArrowLeft')  handleSetActive((activeIdx - 1 + allImages.length) % allImages.length)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, activeIdx, allImages.length])

  const imgLabel = activeIdx === 0 ? 'Front' : activeIdx === 1 ? 'Back' : `Photo ${activeIdx + 1}`

  // Image transform: scale at origin + translate for pan
  const imgTransform = zoomed
    ? `scale(${ZOOM_SCALE}) translate(${pan.x / ZOOM_SCALE}px, ${pan.y / ZOOM_SCALE}px)`
    : 'scale(1) translate(0,0)'

  return (
    <div className="qv-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={product.name}>
      <div className="qv-modal" onClick={e => e.stopPropagation()}>
        {/* Close */}
        <button className="qv-close" onClick={onClose} aria-label="Close">
          <i className="fas fa-times" />
        </button>

        {/* ── Image Gallery Side ── */}
        <div className="qv-gallery">
          {/* Main image */}
          <div
            ref={wrapRef}
            className={`qv-img-wrap${zoomed ? ' zoomed' : ''}`}
            onClick={handleImageClick}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{ cursor: zoomed ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in' }}
          >
            {!imgLoaded && <div className="qv-img-skeleton" />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={allImages[activeIdx]}
              src={allImages[activeIdx]}
              alt={`${product.name} — ${imgLabel}`}
              className={`qv-img${imgLoaded ? ' loaded' : ''}`}
              draggable={false}
              onLoad={() => setImgLoaded(true)}
              style={{
                transformOrigin: origin,
                transform: imgTransform,
                transition: isDragging ? 'none' : 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)',
              }}
            />

            {/* Badges */}
            <span className="qv-photo-label">{imgLabel}</span>
            <span className="qv-country-badge">{product.country}</span>

            {/* Zoom hint */}
            {!isDragging && (
              <div className="qv-zoom-hint">
                <i className={`fas fa-${zoomed ? 'compress-alt' : 'search-plus'}`} />
                {zoomed ? 'Click to zoom out · Drag to pan' : 'Click anywhere to zoom in'}
              </div>
            )}

            {/* Arrow nav — only if multiple images */}
            {allImages.length > 1 && (
              <>
                <button
                  className="qv-arrow qv-arrow-left"
                  onClick={e => { e.stopPropagation(); handleSetActive((activeIdx - 1 + allImages.length) % allImages.length) }}
                  aria-label="Previous photo"
                >
                  <i className="fas fa-chevron-left" />
                </button>
                <button
                  className="qv-arrow qv-arrow-right"
                  onClick={e => { e.stopPropagation(); handleSetActive((activeIdx + 1) % allImages.length) }}
                  aria-label="Next photo"
                >
                  <i className="fas fa-chevron-right" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip — only if multiple images */}
          {allImages.length > 1 && (
            <div className="qv-thumbs">
              {allImages.map((src, idx) => (
                <button
                  key={src + idx}
                  className={`qv-thumb${activeIdx === idx ? ' active' : ''}`}
                  onClick={() => handleSetActive(idx)}
                  aria-label={idx === 0 ? 'Front photo' : idx === 1 ? 'Back photo' : `Photo ${idx + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Thumbnail ${idx + 1}`} draggable={false} />
                  <span className="qv-thumb-label">
                    {idx === 0 ? 'Front' : idx === 1 ? 'Back' : `#${idx + 1}`}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Details Side ── */}
        <div className="qv-details">
          <p className="qv-category">{product.category}</p>
          <h2 className="qv-name">{product.name}</h2>
          {product.description && <p className="qv-desc">{product.description}</p>}

          {/* Price + Cart controls */}
          <div className="qv-buy-row">
            <span className="qv-price">₹{product.price}</span>
            {inCartQty > 0 ? (
              <div className="qv-stepper">
                <button className="qv-step-btn" onClick={() => updateQty(product.id, -1)} aria-label="Decrease quantity">
                  <i className="fas fa-minus" />
                </button>
                <span className="qv-step-qty">{inCartQty}</span>
                <button className="qv-step-btn" onClick={() => updateQty(product.id, 1)} aria-label="Increase quantity">
                  <i className="fas fa-plus" />
                </button>
              </div>
            ) : (
              <button className="qv-add-btn" onClick={() => addItem(product, 1)}>
                <i className="fas fa-plus" /> Add
              </button>
            )}
          </div>

          {/* Ingredients */}
          {product.ingredients && (
            <div className="qv-ingredients">
              <h3 className="qv-ingredients-title">
                <i className="fas fa-leaf" /> Ingredients
              </h3>
              <p className="qv-ingredients-text">{product.ingredients}</p>
            </div>
          )}

          {/* Image count helper */}
          {allImages.length > 1 && (
            <p className="qv-img-count-hint">
              <i className="fas fa-images" /> {allImages.length} photos · Use arrows or thumbnails to browse
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Product Card ────────────────────────────────────────────────────────────
interface ProductCardProps {
  product: Product
  index: number
  onQuickView: (product: Product) => void
}

function ProductCard({ product, index, onQuickView }: ProductCardProps) {
  const { addItem, items, updateQty } = useCart()
  const [added, setAdded] = useState(false)

  const inCart = items.find(i => i.id === product.id)
  const inCartQty = inCart?.quantity ?? 0

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 800)
  }

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateQty(product.id, 1)
  }

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateQty(product.id, -1)
  }

  return (
    <div
      className="product-card reveal"
      style={{ transitionDelay: `${index * 0.04}s` }}
      id={`product-card-${product.id}`}
      onClick={() => onQuickView(product)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onQuickView(product)}
      aria-label={`View ${product.name} details`}
    >
      {/* Image */}
      <div className="product-card-img-wrap">
        {product.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={product.image}
            alt={product.name}
            className="product-card-img"
            loading="lazy"
          />
        ) : (
          <div className="product-card-img-placeholder" />
        )}
        <div className="product-card-overlay" />
        <span className="product-card-country">{product.country}</span>

        {/* "View" hint on hover */}
        <div className="product-card-view-hint">
          <i className="fas fa-expand-alt" /> View Details
        </div>
      </div>

      {/* Body */}
      <div className="product-card-body">
        <p className="product-card-category">{product.category}</p>
        <h3 className="product-card-name">{product.name}</h3>

        <div className="product-card-footer">
          <span className="product-price">₹{product.price}</span>

          {/* Blinkit-style: show ADD or stepper */}
          {inCartQty > 0 ? (
            <div className="pc-stepper" onClick={e => e.stopPropagation()}>
              <button
                className="pc-step-btn"
                onClick={handleDecrease}
                aria-label="Remove one"
              >
                <i className="fas fa-minus" />
              </button>
              <span className="pc-step-qty">{inCartQty}</span>
              <button
                className="pc-step-btn"
                onClick={handleIncrease}
                aria-label="Add one more"
              >
                <i className="fas fa-plus" />
              </button>
            </div>
          ) : (
            <button
              className={`pc-add-btn${added ? ' pc-added' : ''}`}
              onClick={handleAdd}
              id={`add-to-cart-${product.id}`}
              aria-label={`Add ${product.name} to cart`}
            >
              {added ? <i className="fas fa-check" /> : <><i className="fas fa-plus" /> ADD</>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Products Section ───────────────────────────────────────────────────
export default function Products() {
  const [activeCat, setActiveCat] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(24)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const { totalItems, totalPrice, openCart } = useCart()
  const sectionRef = useRef<HTMLElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeCat === 'All' || p.category === activeCat
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  const visibleProducts = filtered.slice(0, visibleCount)

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setVisibleCount(24)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    searchRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleBrandSearch = (e: Event) => {
      const customEvent = e as CustomEvent<string>
      setSearchQuery(customEvent.detail)
      setActiveCat('All')
      setVisibleCount(24)
      const productsSection = document.getElementById('products')
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
    window.addEventListener('filterBrand', handleBrandSearch)
    return () => window.removeEventListener('filterBrand', handleBrandSearch)
  }, [])

  useEffect(() => {
    setVisibleCount(24)
  }, [activeCat])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } }),
      { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
    )
    el.querySelectorAll('.reveal').forEach(t => obs.observe(t))
    return () => obs.disconnect()
  })

  return (
    <section className="products-section" id="products" ref={sectionRef} aria-label="Shop products">
      <div className="products-header">
        <div className="reveal">
          <div className="section-label">
            <span className="gold-line" aria-hidden="true" />
            Shop Our Collection
          </div>
          <h2 className="section-title">
            The World&apos;s Finest,<br /><em>Delivered to PCMC</em>
          </h2>
        </div>

        {/* Search bar */}
        <div className="products-search-wrap reveal reveal-delay-1">
          <div className="products-search-inner">
            <i className="fas fa-search products-search-icon" aria-hidden="true" />
            <input
              ref={searchRef}
              type="text"
              className="products-search-input"
              placeholder="Search chocolates, drinks, snacks…"
              value={searchQuery}
              onChange={handleSearch}
              aria-label="Search products"
              id="products-search"
            />
            {searchQuery && (
              <button className="products-search-clear" onClick={clearSearch} aria-label="Clear search">
                <i className="fas fa-times" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <div className="category-filters reveal reveal-delay-2" role="group" aria-label="Filter by category">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-filter-btn${activeCat === cat ? ' active' : ''}`}
              onClick={() => { setActiveCat(cat); setSearchQuery('') }}
              id={`filter-${cat.toLowerCase()}`}
              aria-pressed={activeCat === cat}
            >
              <i className={`${CATEGORY_ICONS[cat]} cat-icon`} aria-hidden="true" /> {cat}
            </button>
          ))}
        </div>
      </div>

      {PRODUCTS.length > 0 && (
        <div className="products-results-bar">
          <span className="products-results-count">
            {filtered.length === PRODUCTS.length
              ? `${PRODUCTS.length} products`
              : `${filtered.length} result${filtered.length !== 1 ? 's' : ''} found`}
          </span>
          {searchQuery && (
            <span className="products-results-query">for &ldquo;<strong>{searchQuery}</strong>&rdquo;</span>
          )}
        </div>
      )}

      {PRODUCTS.length === 0 ? (
        <div className="products-coming-soon">
          <div className="coming-soon-icon"><i className="fas fa-box-open" aria-hidden="true" /></div>
          <h3 className="coming-soon-title">Products Coming Soon</h3>
          <p className="coming-soon-text">Our curated collection is being updated.<br />Visit the store or contact us to browse in person.</p>
          <a href="#contact" className="coming-soon-btn"><i className="fas fa-arrow-right" aria-hidden="true" /> Get in Touch</a>
        </div>
      ) : (
        <>
          <div className="products-grid" role="list" aria-label="Product list">
            {visibleProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} onQuickView={setQuickViewProduct} />
            ))}
            {filtered.length === 0 && (
              <div className="products-no-results">
                <i className="fas fa-search" aria-hidden="true" />
                <p>No products found for &ldquo;<strong>{searchQuery}</strong>&rdquo;</p>
                <button className="cat-filter-btn" onClick={clearSearch}>Clear Search</button>
              </div>
            )}
          </div>

          {visibleCount < filtered.length && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
              <button
                className="cat-filter-btn"
                style={{ padding: '14px 40px', fontSize: '0.85rem' }}
                onClick={() => setVisibleCount(v => v + 24)}
                aria-label="Load more products"
              >
                Load More Products
              </button>
            </div>
          )}
        </>
      )}

      {/* Sticky cart bar */}
      {totalItems > 0 && (
        <div className="products-cart-bar" id="products-cart-bar">
          <div className="products-cart-bar-inner">
            <div className="products-cart-bar-info">
              <i className="fas fa-shopping-bag" aria-hidden="true" />
              <span><strong>{totalItems}</strong> item{totalItems !== 1 ? 's' : ''} in cart</span>
            </div>
            <div className="products-cart-bar-right">
              <span className="products-cart-bar-total">₹{totalPrice.toLocaleString('en-IN')}</span>
              <button className="products-cart-bar-btn" onClick={openCart} id="products-view-cart-btn">
                View Cart <i className="fas fa-arrow-right" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </section>
  )
}
