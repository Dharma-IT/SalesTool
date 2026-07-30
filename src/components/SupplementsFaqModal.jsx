import React from 'react';
import { ExternalLink, Search, X } from 'lucide-react';

const getSupplementUrl = (name) => {
  const lowerName = name.toLowerCase();
  const urlMap = [
    ['hydrolyzed collagen peptides', 'https://dharmanutritionclinic.com/products/grass-fed-hydrolyzed-collagen-peptides'],
    ['mct fat burner', 'https://dharmanutritionclinic.com/products/fat-burner-with-mct'],
    ['bloat away', 'https://dharmanutritionclinic.com/products/probiotic-40-billion-with-prebiotics'],
    ['berberine', 'https://dharmanutritionclinic.com/products/berberine'],
    ['multivitaminico', 'https://dharmanutritionclinic.com/products/complete-multivitamin'],
    ['max detox', 'https://dharmanutritionclinic.com/products/max-detox-acai-detox'],
    ['nad+', 'https://dharmanutritionclinic.com/products/nad'],
    ['vanilla whey', 'https://dharmanutritionclinic.com/products/advanced-100-whey-protein-isolate-vanilla'],
    ['gut boost', 'https://dharmanutritionclinic.com/products/digestive-enzyme-pro-blend'],
    ['beauty boost', 'https://dharmanutritionclinic.com/products/hair-skin-and-nails-essentials-1'],
    ['omega-3', 'https://dharmanutritionclinic.com/products/omega-3-epa-180mg-dha-120mg'],
    ['maca plus', 'https://dharmanutritionclinic.com/products/maca-plus'],
    ['colon gentle cleanse', 'https://dharmanutritionclinic.com/products/colon-gentle-cleanse'],
    ['vitamin d3 10,000', ''],
    ['vitamin d3', 'https://dharmanutritionclinic.com/products/vitamin-d3-2-000-iu'],
    ['chocolate whey', 'https://dharmanutritionclinic.com/products/advanced-100-whey-protein-isolate-chocolate'],
    ['energy oral strips', 'https://dharmanutritionclinic.com/products/energy-strips-1'],
    ['sleep oral strips', 'https://dharmanutritionclinic.com/products/sleep-strips-1'],
    ['vanilla - collagen', 'https://dharmanutritionclinic.com/products/grass-fed-collagen-creamer-vanilla'],
    ['creatine', 'https://dharmanutritionclinic.com/products/creatine-monohydrate'],
    ['brain & focus', 'https://dharmanutritionclinic.com/products/brain-focus-formula'],
    ['bone & heart', 'https://dharmanutritionclinic.com/products/bone-heart-support'],
    ['chocolate - collagen', 'https://dharmanutritionclinic.com/products/grass-fed-collagen-peptides-powder-chocolate'],
    ['magnesio glicinato', 'https://dharmanutritionclinic.com/products/magnesium-glycinate'],
    ['apple cider vinegar', 'https://dharmanutritionclinic.com/products/apple-cider-vinegar-capsules'],
    ['hydraglow powder (peach mango)', 'https://dharmanutritionclinic.com/products/hydration-powder-peach-mango'],
    ['hydraglow powder (lychee)', 'https://dharmanutritionclinic.com/products/hydration-powder-lychee'],
    ['hydraglow powder (lemonade)', 'https://dharmanutritionclinic.com/products/hydration-powder-lemonade'],
    ['hydraglow powder electrolyte formula', 'https://dharmanutritionclinic.com/products/hydration-powder-peach-mango'],
  ];

  const match = urlMap.find(([key]) => lowerName.includes(key));
  return match ? match[1] : '';
};

const SUPPLEMENT_FAQ_ITEMS = [
  {
    name: 'Hydrolyzed Collagen Peptides Powder - Unflavored, Grass-Fed Bovine, 280g',
    price: '$39.90',
    description: 'This supplement is essential for maintaining healthy collagen levels, which is a key protein in the body that supports skin, hair, nails, tendons, and joints. It improves skin health by maintaining elasticity and hydration, provides joint support by strengthening joints and reducing pain, and supports bone health by maintaining bone structure and density.',
    usage: 'Mix one scoop with 8-10 oz of water or beverage daily.',
    ingredients: 'Bovine Hide Collagen Peptides.',
  },
  {
    name: 'MCT Fat Burner with L-Carnitine & Appetite Control',
    price: '$33.90 (Regular price: $49.90)',
    description: 'This supplement provides key benefits including fat burning that accelerates metabolism and thermogenesis, pure energy by converting fat into fuel with MCT and L-Carnitine, healthy weight control that facilitates fat loss, liver health support through Choline for optimal liver function, and enhanced athletic performance that optimizes diet and exercise results.',
    usage: 'Take 4 capsules daily, preferably with meals. For best results, take 2 capsules with 8 oz (237 ml) of water before breakfast and again before dinner. This product should be used alongside a balanced diet and exercise program.',
    ingredients: 'MCT Oil, L-Carnitine, Chromium, Choline, CLA.',
  },
  {
    name: 'Bloat Away - Probiotic 40 Billion CFU with Prebiotics | 60 Capsules',
    price: '$24.90 (Regular price: $33.90)',
    description: 'This probiotic supplement is a blend of four probiotic strains: Lactobacillus Acidophilus, Bifidobacterium Lactis, Lactobacillus Plantarum, and Lactobacillus Paracasei. Together, they provide a high level of beneficial bacteria to the gut to support a healthy metabolic response for both men and women, reducing bloating and digestive discomfort.',
    usage: 'Take two (2) capsules once a day as a dietary supplement. For best results, take one (1) capsule during the day and one (1) capsule in the evening. Do not exceed two capsules per day.',
    ingredients: 'Proprietary Blend of Probiotic Bacteria with MAKTREK Bi-Pass Technology, Lactobacillus Acidophilus, Bifidobacterium Lactis, Lactobacillus Plantarum, Lactobacillus Paracasei, Marine Polysaccharide Complex, Fructooligosaccharide (FOS), Cellulose (vegetable capsule), Rice maltodextrin, L-Leucine.',
  },
  {
    name: 'Berberine+ HCL 97% | Maximo Control Metabolico y Perdida de Peso',
    price: '$39.99 (Regular price: $59.00)',
    description: 'This supplement reduces abdominal bloating, controls cravings, activates metabolism, supports fat burning, and provides more stable energy throughout the day. It helps reduce inflammation and promotes a flatter abdomen.',
    usage: 'Take 2 capsules per day.',
    ingredients: 'Berberine HCL 97%.',
  },
  {
    name: 'Multivitaminico Completo Diario - Energia, Inmunidad y Bienestar',
    price: '$33.90',
    description: 'This complete daily multivitamin supports your body with a complete formula designed to cover your daily needs, strengthen your health, and help you perform better each day. Key benefits include increased energy levels, immune system support, contribution to body balance, general health and wellbeing support, and physical and mental performance support.',
    usage: 'As a dietary supplement, take two (2) capsules in the morning with a meal.',
    ingredients: 'Complete vitamin and mineral formula (specific vitamins and minerals listed on label).',
  },
  {
    name: 'Max Detox - Natural Liver Cleanse & Full Body Detox Supplement',
    price: '$24.90 (Regular price: $33.90)',
    description: "This supplement helps remove harmful toxins while supporting the liver, an essential part of the body's natural detoxification processes. It cleanses the body of built-up toxins, heavy metals, and parasites, which can positively impact immunological function, digestion, and skin health.",
    usage: 'As a dietary supplement, take two (2) capsules once a day. For best results, take one (1) capsule during the day and one (1) capsule in the evening. Do not exceed two capsules per day.',
    ingredients: 'Proprietary Blend of Psyllium Powder, Acai Berry Extract, Inulin, Slippery Elm Bark, Aloe Ferox Powder, Chlorella, Black Walnut Hulls Powder, Ginger Root, Hyssop Leaf, Papaya Fruit Powder, Lycopene 5%, Cellulose (Vegetable Capsule), Magnesium Stearate.',
  },
  {
    name: 'NAD+ Cellular Energy & Anti-Aging',
    price: '$39.90 (Regular price: $59.90)',
    description: 'This supplement provides key benefits including maximum cellular energy, cell recovery facilitation, improved cognitive and mental health, cardiovascular protection, and immune system reinforcement. It supports anti-aging at the cellular level.',
    usage: 'As a dietary supplement, adults should take two (2) capsules per day. For best results, take with 6 oz (177 ml) of water or as directed by a healthcare professional.',
    ingredients: 'NAD+ precursors and supportive compounds.',
  },
  {
    name: 'Vanilla Whey Protein Isolate - 22g Protein | Muscle Recovery & Weight Loss Support',
    price: '$49.90 (Regular price: $59.90)',
    description: 'This advanced 100% Whey Protein Isolate provides a delicious, creamy vanilla flavor to deliver high-quality protein to support muscle repair and growth. It contains 22g of pure whey protein isolate per serving to aid in muscle recovery, has a smooth and creamy natural vanilla flavor, supports digestive health with apple pectin powder, and includes MCT oil powder for quick energy and enhanced metabolism.',
    usage: 'As a dietary supplement, adults mix two (2) scoops with 6-8 oz of water or favorite beverage daily. For best results, take 20-30 minutes before a meal with 8 oz of water.',
    ingredients: 'Whey Protein Isolate, Natural Flavors, MCT Oil Powder, Apple Pectin Powder, Sunflower Lecithin, Stevia Extract (leaf), Sea Salt, Silicon Dioxide.',
  },
  {
    name: 'Gut Boost Pro - Daily Digestive Support & Bloating Relief Supplement',
    price: '$24.90 (Regular price: $33.90) - Currently Sold Out',
    description: 'This supplement supports digestive health from the inside out. Key benefits include reduced bloating and digestive discomfort, improved digestion and nutrient absorption, support for gut microbiome balance, a flatter and lighter feeling abdomen, and contribution to general wellbeing.',
    usage: 'Take one (1) capsule twice a day as a dietary supplement. For best results, take 20-30 minutes before a meal or as directed by your healthcare professional.',
    ingredients: 'Digestive enzyme blend and probiotic strains.',
  },
  {
    name: 'BEAUTY BOOST - CABELLO, PIEL Y UNAS',
    price: '$33.90',
    description: 'This supplement provides more shine, more strength, and a noticeable glow. Key benefits include strengthening hair and reducing hair loss, improving skin appearance, supporting stronger and healthier nails, nourishing from within for a natural glow, and helping you look and feel better every day.',
    usage: 'For adults only. Take two (2) capsules per day with food. Do not take this supplement during the hour before or after taking medications. Do not exceed the recommended dose.',
    ingredients: 'Hair, skin, and nail support formula with vitamins and minerals.',
  },
  {
    name: 'Omega-3 Fish Oil EPA 180mg + DHA 120mg - Heart, Brain & Inflammation Support',
    price: '$33.90',
    description: 'This supplement provides less inflammation, better health, and daily wellbeing. Key benefits include heart health support, inflammation reduction, improved brain function and focus, healthy cholesterol level support, and general wellbeing contribution.',
    usage: 'As a dietary supplement, adults should take one (1) softgel capsule, two (2) times a day with meals, or as directed by a healthcare professional. Store in a cool, dry place away from direct light.',
    ingredients: 'Fish Oil providing EPA 180mg and DHA 120mg per serving.',
  },
  {
    name: 'Maca Plus - Triple Maca Root Complex 1500mg | 60 Capsules',
    price: '$24.90',
    description: 'Historically, maca health benefits include improving fertility issues and sexual dysfunction, boosting energy levels, and bracing athletic performance. This formula is formulated with red, black, and yellow maca to help users get the best results. Maca is also used to help balance hormones and is full of vital antioxidants. It offers one of the highest potencies of maca root available with over 1500mg in every serving.',
    usage: 'As a dietary supplement, take two (2) capsules once a day. For best results, take 20-30 minutes before a meal or as directed by your healthcare professional.',
    ingredients: 'Organic Maca Root (Black), Organic Maca Root (Red), Organic Maca Root (Yellow), Black Pepper, Cellulose (Vegetable Capsule), Vegetable Stearate.',
  },
  {
    name: 'Colon Gentle Cleanse - Fiber & Enzyme Digestive Support Supplement',
    price: '$33.90',
    description: 'This colon cleanser is a dietary supplement designed to support and maintain digestive health. It is formulated with a blend of natural ingredients to promote regular bowel movements and ease digestive discomfort. This product combines the benefits of fiber, natural extracts, and digestive enzymes to gently cleanse the colon and support overall digestive function. Ginger Root promotes normal intestinal peristalsis, while Psyllium Husk is rich in water-soluble fiber to stimulate intestinal transit without irritating the intestines and has prebiotic properties.',
    usage: 'It is recommended to take one sachet once or twice a day, separate from meals. The contents of the bag should be poured into a glass filled with non-carbonated water (6.76 oz / 200 ml), stir well and drink immediately.',
    ingredients: 'Psyllium husk (Plantago Ovata) seed powder, Tamarind (Tamarindus Indica) fruit extract, Digestive Enzyme blend from fermented cereals (amylase, lactase, lipase, cellulase), Ginger root (Zingiber officinale Roscoe).',
  },
  {
    name: 'Vitamin D3 2,000 IU - Bone, Mood & Energy Support | 100 Softgels',
    price: '$24.90',
    description: "Vitamin D3 is a fat-soluble vitamin that supports the growth and development of bones and teeth. It also plays an essential role in the functioning of muscles and boosting energy levels in the body. The body naturally produces Vitamin D when exposed to sunlight, and you can also receive Vitamin D from some foods like oily fish. In the winter months, especially in colder regions, the body doesn't produce as much Vitamin D, leading to seasonal depression.",
    usage: 'As a dietary supplement, adults take one (1) softgel capsule daily or as directed by a health care professional. Store in a cool, dry place and away from direct light.',
    ingredients: 'Vitamin D3 (as cholecalciferol), Softgel (gelatin, glycerin, water), soybean oil, corn oil.',
  },
  {
    name: 'Chocolate Whey Isolate Protein Powder - Lean Muscle & Recovery',
    price: '$47.90 (Regular price: $59.90)',
    description: 'This supplement provides more protein, better body, and real results. Key benefits include supporting muscle mass development, helping tone and define the body, supporting recovery after training, providing high-quality fast-absorbing protein, and keeping you satiated and energized.',
    usage: 'As a dietary supplement, adults should mix two (2) scoops with 6-8 oz of water or their favorite beverage per day. For best results, take 20-30 minutes before a meal with 8 oz of water or as directed by a healthcare professional.',
    ingredients: 'Whey Protein Isolate, Cocoa Powder, Natural Flavors, MCT Oil Powder, Apple Pectin Powder, Sunflower Lecithin, Stevia Extract.',
  },
  {
    name: 'Energy Oral Strips - Green Tea Caffeine, L-Theanine & B12 | No Crash',
    price: '$29.90 (Regular price: $33.90)',
    description: 'These energy strips are designed specifically for people on the go. When used before exercising or in high-energy activities, they provide noticeable long-term benefits such as improved focus, physical endurance, and mental clarity. They offer increased sustained energy compared to sugary drinks or coffee without the crash or jitters. The combination of Green Tea Caffeine and L-Theanine work together synergistically to provide sustained energy levels lasting up to several hours, while Vitamin B12 helps convert carbohydrates into glucose for energy.',
    usage: 'Place one oral strip on your tongue and allow it to dissolve. Take one oral strip anytime, up to a maximum of 1 strip per day.',
    ingredients: 'Pullulan, L-Theanine, Caffeine, Mannitol, Cellulose, Cranberry Flavor, Lecithin, Malic Acid, Pectin, Erythritol, Steviol glycosides, Methylcobalamin.',
  },
  {
    name: 'Sleep Oral Strips with Melatonin, Valerian Root & Chamomile - Dissolvable Bedtime Aid',
    price: '$29.90 (Regular price: $33.90)',
    description: 'Whether you enjoy an active lifestyle or just need an extra boost during the day, these sleep strips provide the energy to do anything. They help you wake up refreshed every day without feeling groggy and exhausted. The combination of Valerian extract, Lavender, Chamomile, Hibiscus Extract, and Melatonin promotes relaxation and improves sleep quality with a synergistic effect. These are the perfect non-addictive sleeping aid.',
    usage: 'Place one oral strip on your tongue and allow it to dissolve. Take one oral strip anytime, up to a maximum of 1 strip per day, preferably before bedtime.',
    ingredients: 'Pullulan, Valerian root extract, Lavender extract, Chamomile extract, Hibiscus extract, Cellulose, Raspberry Flavor, Malic acid, Xylitol, Lecithin, Erythritol, Sorbitol Syrup, Medium Chain Triglycerides, Steviol Glycosides, Melatonin.',
  },
  {
    name: 'Vanilla - Collagen Peptides Creamer Grass-Fed Powder',
    price: '$39.90',
    description: 'This Grass-Fed Collagen Creamer helps keep the body functioning optimally. Collagen is a significant protein in the body mainly found in connective tissue, responsible for retaining elasticity in the skin, hair, and nails while providing structure to tendons and joints. The body produces less collagen as it ages, making supplementation essential. This creamer contains types 1 and 3 collagen essential for healthy skin, muscles, and bone, and is the perfect way to level up your morning coffee or favorite hot beverage.',
    usage: 'Adults mix two (2) scoops with 8-10 fl oz (236-295 ml) of their favorite hot or cold beverage. Store in a cool, dry place and away from direct light.',
    ingredients: 'Hydrolyzed collagen peptides (from bovine hide), medium chain triglycerides, acacia powder, calcium carbonate, pea protein powder, natural flavor, silica, stevia extract powder.',
  },
  {
    name: 'Creatine',
    price: '$33.90 (Regular price: $39.90) - Currently Sold Out',
    description: 'This supplement provides more strength, more muscle, and better performance every day. Key benefits include increased strength and endurance, improved performance at the gym, support for muscle growth, faster recovery, and energy and power in every workout.',
    usage: 'As a dietary supplement, adults should take one (1) measure in eight (8) oz of water or juice four (4) times a day for the first five (5) days (loading phase). After the loading phase, take one (1) or two (2) times a day or as directed by a healthcare professional.',
    ingredients: 'Creatine Monohydrate.',
  },
  {
    name: 'Brain & Focus Formula - Nootropic Supplement with DMAE, Bacopa & Amino Acids',
    price: '$24.90 - Currently Sold Out',
    description: 'This formula combines powerful amino acids such as Dimethylaminoethanol (DMAE Bitartrate), L-Glutamine, L-Tyrosine, and GABA to enhance neuroactivity with plant extracts such as Bacopa that alter neurochemistry to improve focus, learning, and intelligence. It keeps your focus sharp and energy high with a natural nootropic formula.',
    usage: 'As a dietary supplement, take two (2) veggie capsules once a day. For best results, take 20-30 minutes before a meal with an 8oz (236 ml) glass of water or as directed by your healthcare professional.',
    ingredients: 'Vitamin A (as Beta-Carotene), Vitamin C (as Ascorbic Acid), Calcium, Iron, Vitamin D, Vitamin E, B Vitamins (B1, B2, B3, B5, B6, Folate, Biotin), Magnesium, Zinc, Selenium, Copper, Manganese, Chromium, Molybdenum, Potassium, Choline, and a Proprietary Blend including DMAE Bitartrate, L-Glutamine HCL, Glutamic Acid, Green Tea Extract, Bacopa Extract, Inositol, N-Acetyl L-Tyrosine, Bilberry Fruit Extract, GABA, Grape Seed Extract, and more.',
  },
  {
    name: 'Bone & Heart Support',
    price: '$24.90',
    description: "Both vitamins D3 and K2 are essential to the body's function and overall health. Vitamin D3 aids in absorbing calcium and phosphorus, which are essential for bone formation and maintenance. In addition to supporting the development of strong bones, Vitamin K2 may also benefit the cardiovascular system as it may promote healthy blood clotting.",
    usage: 'Take one (1) capsule twice a day as a dietary supplement. For best results, take 20-30 minutes before a meal or as directed by your healthcare professional.',
    ingredients: 'Calcium (as Calcium Carbonate), Vitamin D3 (Cholecalciferol), Vitamin K2 (mk-7) (as Menaquinone), BioPerine (Black Pepper Fruit Extract), Cellulose (vegetable capsule).',
  },
  {
    name: 'Chocolate - Collagen Peptides Grass-Fed Powder',
    price: '$39.90',
    description: 'This Grass-Fed Collagen Peptide Powder helps maintain healthy bodily function. Collagen is an essential protein found mostly in connective tissue throughout the body, supporting the flexibility of the skin, hair, and nails and giving structure to tendons and joints. Collagen is loaded with amino acids glycine, proline, hydroxyproline, and alanine, which help promote collagen synthesis in the body. However, as the body ages, it produces less collagen, making supplementation crucial. It contains collagen types 1 and 3 necessary for healthy skin, muscles, and bones.',
    usage: 'As a dietary supplement, adults mix two (2) scoops with 8-10 oz (236-295 ml) of their favorite beverage in a shaker cup or blender. Store in a cool, dry place and away from direct light.',
    ingredients: 'Hydrolyzed Collagen Peptides (from bovine hide), Cocoa Powder, Acacia Powder, Natural Flavor, Sodium Chloride, Xanthan Gum, Stevia Extract Powder (Reb A), Silica.',
  },
  {
    name: 'Magnesio Glicinato - Sueno, Relajacion y Sistema Nervioso',
    price: '$33.90',
    description: 'This supplement relaxes your body, helps you sleep better, and wakes you up refreshed. Key benefits include improved sleep quality, reduced stress and anxiety, relaxed muscles and body, nervous system balance support, and waking up with more energy and real rest.',
    usage: 'As a dietary supplement, take three (3) capsules once a day or as directed by your healthcare professional.',
    ingredients: 'Magnesium Glycinate (high bioavailability form for better absorption).',
  },
  {
    name: 'Bloom Wow - Probiotic & Bitter Drink with Prebiotic',
    price: '',
    description: 'Probiotic and prebiotic drink support for daily digestive wellness.',
    usage: 'Not listed on product page.',
    ingredients: 'Not listed on product page.',
  },
  {
    name: 'Moon Plus - Triple Moon Mood Complex',
    price: '',
    description: 'Mood support supplement complex.',
    usage: 'Not listed on product page.',
    ingredients: 'Not listed on product page.',
  },
  {
    name: 'Vitamin D3 10,000 IU - Bone, Mood & Energy Support',
    price: '',
    description: 'High-potency Vitamin D3 support for bones, mood, and energy.',
    usage: 'Not listed on product page.',
    ingredients: 'Vitamin D3 10,000 IU. Other ingredients not listed on product page.',
  },
  {
    name: 'Sleep Gel Magnesium with Melatonin, Valerian Root & Chamomile',
    price: '',
    description: 'Sleep support gel with magnesium, melatonin, valerian root, and chamomile.',
    usage: 'Not listed on product page.',
    ingredients: 'Magnesium, Melatonin, Valerian Root, Chamomile. Other ingredients not listed on product page.',
  },
  {
    name: 'Energy Gel Rings - Green Tea Caffeine, L-Theanine & B12',
    price: '',
    description: 'Energy support gel rings with green tea caffeine, L-Theanine, and B12.',
    usage: 'Not listed on product page.',
    ingredients: 'Green Tea Caffeine, L-Theanine, Vitamin B12. Other ingredients not listed on product page.',
  },
  {
    name: 'Apple Cider Vinegar Capsules',
    price: '$39.00',
    description: 'Apple cider vinegar supplement capsules designed to support daily wellness, digestion, and a simple routine for customers who want the benefits of apple cider vinegar without the liquid taste.',
    usage: 'Not listed on product page.',
    ingredients: 'Apple Cider Vinegar powder. Other ingredients not listed on product page.',
  },
  {
    name: 'Hydraglow Powder (Peach Mango)',
    price: '',
    description: 'Electrolyte hydration powder designed to support hydration, muscle function, endurance, and daily energy without caffeine.',
    usage: 'Measuring with the scooper located inside the jar, mix each scoop, to desired taste, with 14-20 ounces (414-591 ml) of water. Two scoops may be mixed with 28-40 ounces (828 ml-1.2 l) of water.',
    ingredients: 'Vitamin B1 (Thiamin), Vitamin B2 (Riboflavin), Vitamin B3 (Niacin), Vitamin B6 (Pyridoxal 5 Phosphate), Vitamin B9 (Folate), Vitamin B12 (Methylcobalamin), Calcium (Calcium Citrate), Magnesium (Magnesium Citrate), Sodium (Sodium Citrate), Potassium (Potassium Citrate), Polydextrose, Citric Acid, Natural & Artificial Flavors, Sucralose, Calcium Silicate, Fruit & Vegetable Blend (for color).',
  },
  {
    name: 'Hydraglow Powder (Lychee)',
    price: '',
    description: 'Electrolyte hydration powder designed to support healthy hydration, daily energy, electrolyte balance, and a light refreshing routine.',
    usage: 'Mezcle 1 scoop con 14-20 oz de agua o segun su preferencia.',
    ingredients: 'Vitamin B1 (Thiamin), Vitamin B2 (Riboflavin), Vitamin B3 (Niacin), Vitamin B6 (Pyridoxal 5 Phosphate), Vitamin B9 (Folate), Vitamin B12 (Methylcobalamin), Calcium (Calcium Citrate), Magnesium (Magnesium Citrate), Sodium (Sodium Citrate), Potassium (Potassium Citrate), Polydextrose, Citric Acid, Natural & Artificial Flavors, Sucralose, Calcium Silicate, Fruit & Vegetable Blend (for color).',
  },
  {
    name: 'Hydraglow Powder (Lemonade)',
    price: '',
    description: 'Electrolyte hydration powder designed to support hydration, muscle function, endurance, and daily energy without caffeine.',
    usage: 'Measuring with the scooper located inside the jar, mix each scoop, to desired taste, with 14-20 ounces (414-591 ml) of water. Two scoops may be mixed with 28-40 ounces (828 ml-1.2 l) of water.',
    ingredients: 'Vitamin B1 (Thiamin), Vitamin B2 (Riboflavin), Vitamin B3 (Niacin), Vitamin B6 (Pyridoxal 5 Phosphate), Vitamin B9 (Folate), Vitamin B12 (Methylcobalamin), Calcium (Calcium Citrate), Magnesium (Magnesium Citrate), Sodium (Sodium Citrate), Potassium (Potassium Citrate), Polydextrose, Citric Acid, Natural & Artificial Flavors, Sucralose, Calcium Silicate, Fruit & Vegetable Blend (for color).',
  },
  {
    name: 'Hydraglow Powder Electrolyte Formula (various flavors)',
    price: '',
    description: 'Hydraglow electrolyte hydration formula available in multiple flavors.',
    usage: 'Mix each scoop, to desired taste, with 14-20 ounces (414-591 ml) of water.',
    ingredients: 'Vitamin B1 (Thiamin), Vitamin B2 (Riboflavin), Vitamin B3 (Niacin), Vitamin B6 (Pyridoxal 5 Phosphate), Vitamin B9 (Folate), Vitamin B12 (Methylcobalamin), Calcium (Calcium Citrate), Magnesium (Magnesium Citrate), Sodium (Sodium Citrate), Potassium (Potassium Citrate), Polydextrose, Citric Acid, Natural & Artificial Flavors, Sucralose, Calcium Silicate, Fruit & Vegetable Blend (for color).',
  },
];

const SupplementsFaqModal = ({ onClose }) => {
  const [query, setQuery] = React.useState('');

  const filteredItems = SUPPLEMENT_FAQ_ITEMS.filter((item) => {
    const value = `${item.name} ${item.description} ${item.ingredients} ${item.usage} ${getSupplementUrl(item.name)}`.toLowerCase();
    return value.includes(query.toLowerCase());
  });

  return (
    <div className="faq-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="supplements-faq-title">
      <div className="faq-modal">
        <div className="faq-modal-header">
          <div>
            <div className="faq-modal-kicker">Dharma Nutrition Clinic</div>
            <h2 id="supplements-faq-title">Supplements FAQ</h2>
          </div>
          <button type="button" className="faq-modal-close" onClick={onClose} aria-label="Close supplements FAQ">
            <X size={20} />
          </button>
        </div>

        <div className="faq-toolbar">
          <div>
            <div className="faq-source">Source: public/Sup facts.pdf</div>
            <div className="faq-helper">Edit `SUPPLEMENT_FAQ_ITEMS` to add, remove, or change details.</div>
          </div>
          <label className="faq-search">
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search supplements"
              aria-label="Search supplements FAQ"
            />
          </label>
        </div>

        <div className="faq-content">
          {filteredItems.map((item, index) => (
            <section className="supplement-faq-card" key={`${item.name}-${index}`}>
              <h3>{index + 1}. {item.name}</h3>
              <div className="supplement-faq-table">
                <div className="supplement-faq-label">Product URL</div>
                <div>
                  {getSupplementUrl(item.name) ? (
                    <a href={getSupplementUrl(item.name)} target="_blank" rel="noreferrer">
                      {getSupplementUrl(item.name)}
                      <ExternalLink size={13} />
                    </a>
                  ) : (
                    'Not listed on product page.'
                  )}
                </div>
                <div className="supplement-faq-label">Price</div>
                <div>{item.price || 'Not listed on product page.'}</div>
                <div className="supplement-faq-label">Description</div>
                <div>{item.description}</div>
                <div className="supplement-faq-label">How to take</div>
                <div>{item.usage}</div>
                <div className="supplement-faq-label">Ingredients</div>
                <div>{item.ingredients}</div>
              </div>
            </section>
          ))}

          {filteredItems.length === 0 && (
            <div className="faq-empty">
              <Search size={28} />
              <div>No supplement details match your search.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplementsFaqModal;
