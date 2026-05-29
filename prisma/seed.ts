import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

// Reusable image URLs per category
const IMG = {
  dosa:    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=600&auto=format&fit=crop',
  masala:  'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=600&auto=format&fit=crop',
  idli:    'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=600&auto=format&fit=crop',
  vada:    'https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=600&auto=format&fit=crop',
  rice:    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop',
  curry:   'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=600&auto=format&fit=crop',
  roti:    'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=600&auto=format&fit=crop',
  drinks:  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop',
  pav:     'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=600&auto=format&fit=crop',
};

const items = [
  // ── CLASSIC DOSA ─────────────────────────────────────────
  { name: 'Sada Dosa',              price: 80,  category: 'Classic Dosa',    image: IMG.dosa,   spiceLevel: 0, isBestseller: false, description: 'Crispy plain dosa made from fermented rice and urad dal batter, served with sambar and coconut chutney.' },
  { name: 'Garlic Sada Dosa',       price: 90,  category: 'Classic Dosa',    image: IMG.dosa,   spiceLevel: 1, isBestseller: false, description: 'Crispy plain dosa topped with freshly ground garlic paste, served with sambar and chutney.' },
  { name: 'Masala Dosa',            price: 100, category: 'Classic Dosa',    image: IMG.masala, spiceLevel: 1, isBestseller: true,  description: 'Golden crispy dosa filled with spiced potato masala, served with sambar and fresh coconut chutney.' },
  { name: 'Garlic Masala Dosa',     price: 110, category: 'Classic Dosa',    image: IMG.masala, spiceLevel: 2, isBestseller: false, description: 'Crispy dosa with garlic paste and spiced potato masala filling, served with sambar and chutney.' },
  { name: 'Mysore Masala Dosa',     price: 110, category: 'Classic Dosa',    image: IMG.masala, spiceLevel: 2, isBestseller: true,  description: 'Karnataka-style dosa with spicy red chutney spread and aromatic potato bhaji filling.' },
  { name: 'Jain Masala Dosa',       price: 110, category: 'Classic Dosa',    image: IMG.dosa,   spiceLevel: 1, isBestseller: false, description: 'Dosa with Jain-style masala — no onion, no garlic — served with sambar and chutney.' },
  { name: 'Jain Mysore Masala Dosa',price: 120, category: 'Classic Dosa',    image: IMG.dosa,   spiceLevel: 2, isBestseller: false, description: 'Mysore-style dosa prepared Jain — no onion, no garlic, no potatoes — with red chutney.' },

  // ── RAVA SPECIALS ─────────────────────────────────────────
  { name: 'Rava Sada Dosa',         price: 100, category: 'Rava Specials',   image: IMG.dosa,   spiceLevel: 0, isBestseller: false, description: 'Crispy semolina dosa with a lacy texture, served with sambar and coconut chutney.' },
  { name: 'Rava Garlic Sada Dosa',  price: 110, category: 'Rava Specials',   image: IMG.dosa,   spiceLevel: 1, isBestseller: false, description: 'Crispy semolina dosa with garlic paste, served with sambar and chutney.' },
  { name: 'Rava Masala Dosa',       price: 120, category: 'Rava Specials',   image: IMG.masala, spiceLevel: 1, isBestseller: false, description: 'Semolina dosa filled with spiced potato masala, served with sambar and chutney.' },
  { name: 'Rava Garlic Masala Dosa',price: 130, category: 'Rava Specials',   image: IMG.masala, spiceLevel: 2, isBestseller: false, description: 'Semolina dosa with garlic and spiced potato masala filling.' },
  { name: 'Rava Mysore Masala Dosa',price: 140, category: 'Rava Specials',   image: IMG.masala, spiceLevel: 2, isBestseller: false, description: 'Semolina dosa with Mysore red chutney and potato masala filling.' },

  // ── UTTAPAM SPECIALS ──────────────────────────────────────
  { name: 'Sada Uttapam',           price: 90,  category: 'Uttapam',         image: IMG.idli,   spiceLevel: 0, isBestseller: false, description: 'Thick soft rice pancake served with sambar and coconut chutney.' },
  { name: 'Masala Uttapam',         price: 130, category: 'Uttapam',         image: IMG.idli,   spiceLevel: 1, isBestseller: false, description: 'Thick rice pancake topped with spiced potato masala, served with sambar and chutney.' },
  { name: 'Mysore Masala Uttapam',  price: 140, category: 'Uttapam',         image: IMG.idli,   spiceLevel: 2, isBestseller: false, description: 'Thick rice pancake with Mysore red chutney and masala topping.' },
  { name: 'Tomato Uttapam',         price: 110, category: 'Uttapam',         image: IMG.idli,   spiceLevel: 1, isBestseller: false, description: 'Soft rice pancake topped with fresh tomatoes and spices.' },
  { name: 'Onion Uttapam',          price: 110, category: 'Uttapam',         image: IMG.idli,   spiceLevel: 1, isBestseller: false, description: 'Soft rice pancake topped with caramelised onions and green chillies.' },
  { name: 'Tomato and Onion Uttapam',price:120, category: 'Uttapam',         image: IMG.idli,   spiceLevel: 1, isBestseller: false, description: 'Soft rice pancake topped with fresh tomatoes and onions.' },

  // ── FAMILY DOSA ───────────────────────────────────────────
  { name: 'Jumbo Sada Dosa',        price: 240, category: 'Family Dosa',     image: IMG.dosa,   spiceLevel: 0, isBestseller: false, description: 'Extra-large plain crispy dosa, perfect for sharing, served with sambar and chutney.' },
  { name: 'Jumbo Garlic Sada Dosa', price: 260, category: 'Family Dosa',     image: IMG.dosa,   spiceLevel: 1, isBestseller: false, description: 'Extra-large garlic dosa, perfect for sharing.' },
  { name: 'Jumbo Masala Dosa',      price: 300, category: 'Family Dosa',     image: IMG.masala, spiceLevel: 1, isBestseller: false, description: 'Extra-large dosa filled with generous spiced potato masala.' },
  { name: 'Jumbo Garlic Masala Dosa',price:320, category: 'Family Dosa',     image: IMG.masala, spiceLevel: 2, isBestseller: false, description: 'Extra-large garlic masala dosa for the whole family.' },
  { name: 'Jumbo Mysore Masala Dosa',price:350, category: 'Family Dosa',     image: IMG.masala, spiceLevel: 2, isBestseller: false, description: 'Extra-large Mysore-style dosa with red chutney and potato masala.' },

  // ── FUSION DOSA ───────────────────────────────────────────
  { name: 'Pineapple Dosa',              price: 150, category: 'Fusion Dosa', image: IMG.dosa,   spiceLevel: 0, isBestseller: false, description: 'Sweet and tangy dosa with pineapple filling — a unique fusion treat.' },
  { name: 'Pineapple Cheese Dosa',       price: 180, category: 'Fusion Dosa', image: IMG.dosa,   spiceLevel: 0, isBestseller: false, description: 'Crispy dosa with melted cheese and pineapple filling.' },
  { name: 'Schezwan Sada Dosa',          price: 140, category: 'Fusion Dosa', image: IMG.dosa,   spiceLevel: 3, isBestseller: false, description: 'Crispy dosa with spicy Schezwan sauce spread.' },
  { name: 'Schezwan Masala Dosa',        price: 170, category: 'Fusion Dosa', image: IMG.masala, spiceLevel: 3, isBestseller: false, description: 'Dosa with Schezwan sauce and spiced potato masala filling.' },
  { name: 'Veg Schezwan Cheese Dosa',    price: 200, category: 'Fusion Dosa', image: IMG.masala, spiceLevel: 3, isBestseller: false, description: 'Crispy dosa loaded with vegetables, Schezwan sauce and melted cheese.' },
  { name: 'Bhaji Dosa',                  price: 150, category: 'Fusion Dosa', image: IMG.pav,    spiceLevel: 1, isBestseller: false, description: 'Crispy dosa served with spiced pav bhaji filling.' },
  { name: 'Bhaji Paneer Dosa',           price: 180, category: 'Fusion Dosa', image: IMG.pav,    spiceLevel: 2, isBestseller: false, description: 'Dosa with pav bhaji and fresh paneer filling.' },
  { name: 'Spring Roll Special Dosa',    price: 200, category: 'Fusion Dosa', image: IMG.dosa,   spiceLevel: 2, isBestseller: true,  description: 'Crispy dosa rolled with spiced vegetable spring roll filling.' },

  // ── FRY VARIETIES ─────────────────────────────────────────
  { name: 'Masala Fry Dosa',             price: 140, category: 'Fry Varieties', image: IMG.masala, spiceLevel: 2, isBestseller: false, description: 'Crispy fried dosa with spiced masala filling.' },
  { name: 'Mysore Masala Fry Dosa',      price: 150, category: 'Fry Varieties', image: IMG.masala, spiceLevel: 3, isBestseller: false, description: 'Fried dosa with Mysore red chutney and masala filling.' },
  { name: 'Masala Idli Fry',             price: 140, category: 'Fry Varieties', image: IMG.idli,   spiceLevel: 2, isBestseller: false, description: 'Crispy fried idlis tossed with spiced masala.' },
  { name: 'Rava Masala Fry',             price: 150, category: 'Fry Varieties', image: IMG.dosa,   spiceLevel: 2, isBestseller: false, description: 'Crispy fried semolina dosa with masala filling.' },

  // ── IDLI & VADA ───────────────────────────────────────────
  { name: 'Thatte Idli',                 price: 50,  category: 'Idli & Vada', image: IMG.idli,   spiceLevel: 0, isBestseller: false, description: 'Large flat steamed rice cake, soft and fluffy, served with sambar and chutney. (1 pc)' },
  { name: 'Thatte Podi Ghee Idli',       price: 80,  category: 'Idli & Vada', image: IMG.idli,   spiceLevel: 2, isBestseller: false, description: 'Large flat idli tossed in gunpowder spice and pure ghee. (1 pc)' },
  { name: 'Podi Ghee Idli',              price: 90,  category: 'Idli & Vada', image: IMG.idli,   spiceLevel: 2, isBestseller: true,  description: 'Two soft idlis tossed in aromatic gunpowder spice mix and pure cow ghee. (2 pc)' },
  { name: 'Mini Podi Ghee Idli',         price: 100, category: 'Idli & Vada', image: IMG.idli,   spiceLevel: 2, isBestseller: false, description: 'Eight mini idlis tossed in gunpowder spice and ghee — a perfect snack. (8 pc)' },
  { name: 'Mini Idli',                   price: 50,  category: 'Idli & Vada', image: IMG.idli,   spiceLevel: 0, isBestseller: false, description: 'Five bite-sized soft steamed idlis served with sambar and coconut chutney. (5 pc)' },
  { name: 'Idli Sambhar',                price: 50,  category: 'Idli & Vada', image: IMG.idli,   spiceLevel: 0, isBestseller: false, description: 'Classic steamed idlis served with a generous bowl of hot lentil sambar.' },
  { name: 'Vada Sambhar',                price: 50,  category: 'Idli & Vada', image: IMG.vada,   spiceLevel: 1, isBestseller: false, description: 'Crispy medu vada served with hot sambar and coconut chutney.' },

  // ── PULAV SPECIALS ────────────────────────────────────────
  { name: 'Veg Pulav',                   price: 100, category: 'Rice & Pulav', image: IMG.rice,   spiceLevel: 1, isBestseller: false, description: 'Fragrant basmati rice cooked with fresh vegetables and aromatic spices.' },
  { name: 'Butter Veg Pulav',            price: 120, category: 'Rice & Pulav', image: IMG.rice,   spiceLevel: 1, isBestseller: false, description: 'Veg pulav enriched with butter for a rich, creamy flavour.' },
  { name: 'Butter Cheese Veg Pulav',     price: 140, category: 'Rice & Pulav', image: IMG.rice,   spiceLevel: 1, isBestseller: false, description: 'Veg pulav topped with butter and melted cheese.' },
  { name: 'Veg Bhaji Pulav',             price: 110, category: 'Rice & Pulav', image: IMG.rice,   spiceLevel: 2, isBestseller: false, description: 'Pulav served with spiced pav bhaji on the side.' },
  { name: 'Veg Butter Bhaji Pulav',      price: 130, category: 'Rice & Pulav', image: IMG.rice,   spiceLevel: 2, isBestseller: false, description: 'Butter pulav served with spiced pav bhaji.' },
  { name: 'Butter Cheese Bhaji Pulav',   price: 160, category: 'Rice & Pulav', image: IMG.rice,   spiceLevel: 2, isBestseller: false, description: 'Butter cheese pulav served with spiced pav bhaji.' },
  { name: 'Veg Paneer Pulav',            price: 150, category: 'Rice & Pulav', image: IMG.rice,   spiceLevel: 1, isBestseller: false, description: 'Fragrant pulav cooked with fresh paneer and vegetables.' },
  { name: 'Pulav Green Peas Paneer',     price: 160, category: 'Rice & Pulav', image: IMG.rice,   spiceLevel: 1, isBestseller: false, description: 'Pulav with green peas and paneer in aromatic spices.' },

  // ── PAV BHAJI ─────────────────────────────────────────────
  { name: 'Oil Pav Bhaji',               price: 90,  category: 'Pav Bhaji',   image: IMG.pav,    spiceLevel: 2, isBestseller: false, description: 'Classic spiced mashed vegetable curry served with soft pav.' },
  { name: 'Butter Pav Bhaji',            price: 130, category: 'Pav Bhaji',   image: IMG.pav,    spiceLevel: 2, isBestseller: true,  description: 'Rich spiced vegetable curry with generous butter, served with soft pav.' },
  { name: 'Special Butter Pav Bhaji',    price: 160, category: 'Pav Bhaji',   image: IMG.pav,    spiceLevel: 2, isBestseller: false, description: 'Premium pav bhaji with extra butter and special spice blend.' },
  { name: 'Double Butter Pav Bhaji',     price: 160, category: 'Pav Bhaji',   image: IMG.pav,    spiceLevel: 2, isBestseller: false, description: 'Extra indulgent pav bhaji with double butter.' },
  { name: 'Jain Pav Bhaji',              price: 100, category: 'Pav Bhaji',   image: IMG.pav,    spiceLevel: 1, isBestseller: false, description: 'Pav bhaji prepared Jain-style — no onion, no garlic, no potatoes.' },
  { name: 'Jain Special Pav Bhaji',      price: 160, category: 'Pav Bhaji',   image: IMG.pav,    spiceLevel: 2, isBestseller: false, description: 'Special Jain pav bhaji with premium ingredients, no onion/garlic/potato.' },
  { name: 'Jain Butter Pav Bhaji',       price: 140, category: 'Pav Bhaji',   image: IMG.pav,    spiceLevel: 1, isBestseller: false, description: 'Butter pav bhaji prepared Jain-style.' },

  // ── PANEER SPECIAL ────────────────────────────────────────
  { name: 'Paneer Toofani',              price: 150, category: 'Paneer Special', image: IMG.curry,  spiceLevel: 3, isBestseller: false, description: 'Fiery paneer curry with bold spices and a rich tomato-based gravy.' },
  { name: 'Paneer Tikka Masala',         price: 180, category: 'Paneer Special', image: IMG.curry,  spiceLevel: 2, isBestseller: true,  description: 'Grilled paneer cubes in a creamy, spiced tikka masala gravy.' },
  { name: 'Paneer Butter Masala',        price: 180, category: 'Paneer Special', image: IMG.curry,  spiceLevel: 1, isBestseller: true,  description: 'Soft paneer in a rich, buttery tomato-cream gravy.' },
  { name: 'Paneer Handi',                price: 190, category: 'Paneer Special', image: IMG.curry,  spiceLevel: 2, isBestseller: false, description: 'Paneer slow-cooked in a handi with aromatic spices and cream.' },
  { name: 'Paneer Kadai',                price: 190, category: 'Paneer Special', image: IMG.curry,  spiceLevel: 2, isBestseller: false, description: 'Paneer cooked with bell peppers and onions in a kadai masala.' },
  { name: 'Palak Paneer',                price: 190, category: 'Paneer Special', image: IMG.curry,  spiceLevel: 1, isBestseller: false, description: 'Fresh paneer cubes in a smooth, spiced spinach gravy.' },
  { name: 'Paneer Angara',               price: 200, category: 'Paneer Special', image: IMG.curry,  spiceLevel: 3, isBestseller: false, description: 'Smoky charcoal-flavoured paneer in a spicy gravy.' },
  { name: 'Paneer Tawa Masala',          price: 200, category: 'Paneer Special', image: IMG.curry,  spiceLevel: 2, isBestseller: false, description: 'Paneer cooked on a tawa with onions, tomatoes and spices.' },
  { name: 'Paneer Bhurji',               price: 210, category: 'Paneer Special', image: IMG.curry,  spiceLevel: 2, isBestseller: false, description: 'Scrambled paneer cooked with onions, tomatoes and spices.' },
  { name: 'Paneer Bangam Babar',         price: 250, category: 'Paneer Special', image: IMG.curry,  spiceLevel: 3, isBestseller: false, description: 'Rich and indulgent paneer preparation with a special spice blend.' },

  // ── VEG SPECIAL ───────────────────────────────────────────
  { name: 'Veg Handi',                   price: 110, category: 'Veg Special',    image: IMG.curry,  spiceLevel: 2, isBestseller: false, description: 'Mixed vegetables slow-cooked in a handi with aromatic spices.' },
  { name: 'Veg Kadai',                   price: 110, category: 'Veg Special',    image: IMG.curry,  spiceLevel: 2, isBestseller: false, description: 'Mixed vegetables cooked in a kadai with bell peppers and spices.' },
  { name: 'Veg Jaipuri',                 price: 110, category: 'Veg Special',    image: IMG.curry,  spiceLevel: 2, isBestseller: false, description: 'Rajasthani-style mixed vegetable curry with bold spices.' },
  { name: 'Veg Kolhapuri',               price: 110, category: 'Veg Special',    image: IMG.curry,  spiceLevel: 3, isBestseller: false, description: 'Spicy Kolhapuri-style mixed vegetable curry.' },
  { name: 'Veg Toofani',                 price: 120, category: 'Veg Special',    image: IMG.curry,  spiceLevel: 3, isBestseller: false, description: 'Fiery mixed vegetable curry with bold spices.' },
  { name: 'Veg Keema Masala',            price: 130, category: 'Veg Special',    image: IMG.curry,  spiceLevel: 2, isBestseller: false, description: 'Minced vegetable preparation cooked with aromatic masala.' },
  { name: 'Veg Hyderabad',               price: 130, category: 'Veg Special',    image: IMG.curry,  spiceLevel: 2, isBestseller: false, description: 'Hyderabadi-style mixed vegetable curry with rich spices.' },
  { name: 'Veg Hungama',                 price: 130, category: 'Veg Special',    image: IMG.curry,  spiceLevel: 2, isBestseller: false, description: 'Tangy and spicy mixed vegetable curry.' },
  { name: 'Veg Hariyali',                price: 140, category: 'Veg Special',    image: IMG.curry,  spiceLevel: 1, isBestseller: false, description: 'Mixed vegetables in a fresh green herb gravy.' },
  { name: 'Veg Angara',                  price: 150, category: 'Veg Special',    image: IMG.curry,  spiceLevel: 3, isBestseller: false, description: 'Smoky charcoal-flavoured mixed vegetable curry.' },

  // ── SPECIAL SABJI ─────────────────────────────────────────
  { name: 'Cheese Butter Masala',        price: 200, category: 'Special Sabji',  image: IMG.curry,  spiceLevel: 1, isBestseller: false, description: 'Rich cheese and butter masala gravy — indulgent and creamy.' },
  { name: 'Cheese Anguri',               price: 200, category: 'Special Sabji',  image: IMG.curry,  spiceLevel: 1, isBestseller: false, description: 'Soft cheese balls in a rich, spiced gravy.' },
  { name: 'Kaju Butter Masala',          price: 210, category: 'Special Sabji',  image: IMG.curry,  spiceLevel: 1, isBestseller: false, description: 'Cashews in a rich buttery masala gravy.' },
  { name: 'Kaju Curry',                  price: 220, category: 'Special Sabji',  image: IMG.curry,  spiceLevel: 2, isBestseller: false, description: 'Cashews cooked in a spiced curry gravy.' },
  { name: 'Paneer Cheese Kaju Masala',   price: 250, category: 'Special Sabji',  image: IMG.curry,  spiceLevel: 2, isBestseller: false, description: 'Premium combination of paneer, cheese and cashews in a rich masala.' },
  { name: 'Khoya Kaju (Sweet)',          price: 300, category: 'Special Sabji',  image: IMG.curry,  spiceLevel: 0, isBestseller: false, description: 'Sweet preparation of cashews with khoya — a rich dessert-style dish.' },

  // ── KOFTA ─────────────────────────────────────────────────
  { name: 'Veg Kofta',                   price: 110, category: 'Kofta',          image: IMG.curry,  spiceLevel: 1, isBestseller: false, description: 'Soft vegetable dumplings in a rich, spiced gravy.' },
  { name: 'Paneer Kofta',                price: 140, category: 'Kofta',          image: IMG.curry,  spiceLevel: 1, isBestseller: false, description: 'Soft paneer dumplings in a creamy, spiced gravy.' },
  { name: 'Malai Kofta (Sweet)',         price: 150, category: 'Kofta',          image: IMG.curry,  spiceLevel: 0, isBestseller: false, description: 'Creamy paneer and potato dumplings in a mild, sweet gravy.' },
  { name: 'Nagesh Kofta',                price: 160, category: 'Kofta',          image: IMG.curry,  spiceLevel: 2, isBestseller: false, description: 'Special kofta preparation with a unique spice blend.' },

  // ── RICE / BIRYANI ────────────────────────────────────────
  { name: 'Jeera Rice',                  price: 90,  category: 'Rice & Biryani', image: IMG.rice,   spiceLevel: 0, isBestseller: false, description: 'Fragrant basmati rice tempered with cumin seeds and ghee.' },
  { name: 'Veg Pulao',                   price: 100, category: 'Rice & Biryani', image: IMG.rice,   spiceLevel: 1, isBestseller: false, description: 'Basmati rice cooked with fresh vegetables and mild spices.' },
  { name: 'Veg Biryani',                 price: 120, category: 'Rice & Biryani', image: IMG.rice,   spiceLevel: 2, isBestseller: true,  description: 'Aromatic basmati rice layered with spiced vegetables and saffron.' },
  { name: 'Hyderabad Biryani',           price: 130, category: 'Rice & Biryani', image: IMG.rice,   spiceLevel: 2, isBestseller: false, description: 'Hyderabadi-style dum biryani with aromatic spices and vegetables.' },
  { name: 'Paneer Cheese Kaju Pulao',    price: 140, category: 'Rice & Biryani', image: IMG.rice,   spiceLevel: 1, isBestseller: false, description: 'Premium pulao with paneer, cheese and cashews.' },

  // ── ROTI / NAAN ───────────────────────────────────────────
  { name: 'Plain Roti',                  price: 20,  category: 'Roti & Naan',    image: IMG.roti,   spiceLevel: 0, isBestseller: false, description: 'Soft whole wheat flatbread baked fresh in a tandoor.' },
  { name: 'Butter Roti',                 price: 25,  category: 'Roti & Naan',    image: IMG.roti,   spiceLevel: 0, isBestseller: false, description: 'Soft whole wheat flatbread topped with fresh butter.' },
  { name: 'Plain Naan',                  price: 30,  category: 'Roti & Naan',    image: IMG.roti,   spiceLevel: 0, isBestseller: false, description: 'Soft leavened flatbread baked in a tandoor.' },
  { name: 'Butter Naan',                 price: 35,  category: 'Roti & Naan',    image: IMG.roti,   spiceLevel: 0, isBestseller: false, description: 'Soft tandoor naan topped with generous butter.' },
  { name: 'Butter Kulcha',               price: 40,  category: 'Roti & Naan',    image: IMG.roti,   spiceLevel: 0, isBestseller: false, description: 'Soft stuffed kulcha topped with butter, baked in tandoor.' },
  { name: 'Paratha',                     price: 45,  category: 'Roti & Naan',    image: IMG.roti,   spiceLevel: 0, isBestseller: false, description: 'Flaky layered whole wheat flatbread cooked with oil.' },
  { name: 'Cheese Naan',                 price: 50,  category: 'Roti & Naan',    image: IMG.roti,   spiceLevel: 0, isBestseller: false, description: 'Soft naan stuffed with melted cheese, baked in tandoor.' },

  // ── DAL ───────────────────────────────────────────────────
  { name: 'Dal Fry',                     price: 100, category: 'Dal',             image: IMG.curry,  spiceLevel: 1, isBestseller: false, description: 'Yellow lentils tempered with cumin, garlic and spices.' },
  { name: 'Dal Kolhapur',                price: 110, category: 'Dal',             image: IMG.curry,  spiceLevel: 3, isBestseller: false, description: 'Spicy Kolhapuri-style lentil preparation.' },
  { name: 'Dal Tadka',                   price: 120, category: 'Dal',             image: IMG.curry,  spiceLevel: 2, isBestseller: false, description: 'Lentils with a rich tadka of ghee, cumin and red chillies.' },

  // ── PAPAD ─────────────────────────────────────────────────
  { name: 'Roasted Papad',               price: 20,  category: 'Extras',          image: IMG.drinks, spiceLevel: 0, isBestseller: false, description: 'Crispy roasted papad served as a side.' },
  { name: 'Fry Papad',                   price: 30,  category: 'Extras',          image: IMG.drinks, spiceLevel: 0, isBestseller: false, description: 'Crispy deep-fried papad.' },
  { name: 'Masala Papad',                price: 40,  category: 'Extras',          image: IMG.drinks, spiceLevel: 1, isBestseller: false, description: 'Crispy papad topped with chopped onions, tomatoes and spices.' },

  // ── BUTTERMILK & LASSI ────────────────────────────────────
  { name: 'Buttermilk',                  price: 15,  category: 'Beverages',       image: IMG.drinks, spiceLevel: 0, isBestseller: false, description: 'Chilled fresh buttermilk — light and refreshing.' },
  { name: 'Masala Buttermilk',           price: 20,  category: 'Beverages',       image: IMG.drinks, spiceLevel: 1, isBestseller: false, description: 'Spiced buttermilk with cumin, ginger and coriander.' },
  { name: 'Salt Lassi',                  price: 40,  category: 'Beverages',       image: IMG.drinks, spiceLevel: 0, isBestseller: false, description: 'Chilled salted yoghurt drink — cooling and refreshing.' },
  { name: 'Sweet Lassi',                 price: 50,  category: 'Beverages',       image: IMG.drinks, spiceLevel: 0, isBestseller: false, description: 'Chilled sweet yoghurt drink.' },

  // ── SALAD ─────────────────────────────────────────────────
  { name: 'Tomato Salad',                price: 50,  category: 'Extras',          image: IMG.drinks, spiceLevel: 0, isBestseller: false, description: 'Fresh tomato salad with onions and spices.' },
  { name: 'Green Salad',                 price: 60,  category: 'Extras',          image: IMG.drinks, spiceLevel: 0, isBestseller: false, description: 'Fresh garden salad with seasonal vegetables.' },

  // ── COLD DRINKS ───────────────────────────────────────────
  { name: 'Thumbs Up',                   price: 20,  category: 'Beverages',       image: IMG.drinks, spiceLevel: 0, isBestseller: false, description: 'Chilled Thumbs Up cold drink.' },
  { name: 'Sprite',                      price: 20,  category: 'Beverages',       image: IMG.drinks, spiceLevel: 0, isBestseller: false, description: 'Chilled Sprite cold drink.' },
  { name: 'Cola',                        price: 20,  category: 'Beverages',       image: IMG.drinks, spiceLevel: 0, isBestseller: false, description: 'Chilled Cola cold drink.' },
  { name: 'Fanta',                       price: 20,  category: 'Beverages',       image: IMG.drinks, spiceLevel: 0, isBestseller: false, description: 'Chilled Fanta cold drink.' },
  { name: 'Maaza',                       price: 20,  category: 'Beverages',       image: IMG.drinks, spiceLevel: 0, isBestseller: false, description: 'Chilled Maaza mango drink.' },
];

async function main() {
  console.log('Seeding menu items...');
  // Clear existing items first
  await db.menuItem.deleteMany({});
  // Insert all items
  for (const item of items) {
    await db.menuItem.create({
      data: { ...item, isActive: true, ingredients: [] },
    });
  }
  console.log(`✓ Seeded ${items.length} menu items`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
