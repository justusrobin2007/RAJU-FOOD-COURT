export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isBestseller: boolean;
  spiceLevel: number; // 0 = none, 1 = mild, 2 = medium, 3 = spicy
  ingredients: string[];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "d1",
    name: "Raju Madras Special Cheese Burst Dosa",
    description: "An ultra-premium fusion dosa loaded with liquid cheese, special Madras spiced potato filling, onions, and fresh coriander, roasted in pure Amul ghee.",
    price: 249,
    category: "Dosa",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=600&auto=format&fit=crop",
    isBestseller: true,
    spiceLevel: 2,
    ingredients: ["Fermented Rice Batter", "Amul Ghee", "Spiced Potatoes", "Liquid Mozzarella", "House Spice Blend"]
  },
  {
    id: "d2",
    name: "Ghee Podi Roast Dosa",
    description: "Golden crispy thin crepe coated with our signature podi spice mix, roasted to perfection in pure cow ghee. Served with 3 chutneys and sambar.",
    price: 189,
    category: "Dosa",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=600&auto=format&fit=crop",
    isBestseller: true,
    spiceLevel: 3,
    ingredients: ["Fermented Rice Batter", "Pure Cow Ghee", "Roasted Lentil Spice Blend", "Curry Leaves"]
  },
  {
    id: "d3",
    name: "Mysore Masala Dosa",
    description: "Traditional Karnataka-style dosa lined with a spicy garlic-chili-coconut paste, filled with aromatic mashed potato bhaji, roasted with butter.",
    price: 199,
    category: "Dosa",
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=600&auto=format&fit=crop",
    isBestseller: false,
    spiceLevel: 2,
    ingredients: ["Rice & Urad Dal Batter", "Mysore Red Chutney Paste", "Potato Bhaji", "Amul Butter"]
  },
  {
    id: "d4",
    name: "Rava Onion Masala Dosa",
    description: "Crispy semolina and rice crepe studded with green chilies, ginger, and finely chopped onions, rolled with spiced potatoes.",
    price: 219,
    category: "Dosa",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=600&auto=format&fit=crop",
    isBestseller: false,
    spiceLevel: 1,
    ingredients: ["Semolina (Rava)", "Rice Flour", "Fresh Green Chilies", "Crushed Black Pepper", "Onions"]
  },
  {
    id: "i1",
    name: "Classic Steamed Rice Idli",
    description: "Three soft, pillowy steamed rice cakes prepared in the traditional Tamil Nadu style. Served hot with our signature sambar and fresh coconut chutneys.",
    price: 99,
    category: "Idli & Vada",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=600&auto=format&fit=crop",
    isBestseller: false,
    spiceLevel: 0,
    ingredients: ["Parboiled Rice", "Skinless Black Gram (Urad Dal)", "Fenugreek Seeds"]
  },
  {
    id: "i2",
    name: "Ghee Podi Tossed Idli Bites",
    description: "Miniature idlis tossed in pure desi ghee, our signature spice blend, mustard seeds, and fresh curry leaves. A rich, spicy delight.",
    price: 139,
    category: "Idli & Vada",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=600&auto=format&fit=crop",
    isBestseller: true,
    spiceLevel: 2,
    ingredients: ["Mini Rice Idlis", "Desi Ghee", "Spice Blend", "Mustard Seeds", "Curry Leaves"]
  },
  {
    id: "v1",
    name: "Crispy Medu Vada",
    description: "Two crispy, golden-fried black lentil donuts, flavored with whole black peppercorns, curry leaves, and ginger. Perfectly crunchy outside, soft inside.",
    price: 119,
    category: "Idli & Vada",
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=600&auto=format&fit=crop",
    isBestseller: false,
    spiceLevel: 1,
    ingredients: ["Urad Dal Batter", "Crushed Black Pepper", "Fresh Ginger", "Green Chilies", "Curry Leaves"]
  },
  {
    id: "m1",
    name: "Royal Madras Ghee Pongal",
    description: "A comforting Tamil-style porridge made of rice and yellow moong lentil, cooked with milk, heavily tempered with cashew nuts, black pepper, ginger, and ghee.",
    price: 169,
    category: "Traditional Mains",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=600&auto=format&fit=crop",
    isBestseller: false,
    spiceLevel: 0,
    ingredients: ["Raw Rice", "Moong Dal", "Black Peppercorns", "Cashews", "Desi Ghee", "Ginger"]
  },
  {
    id: "m2",
    name: "Raju Madras Special Thali",
    description: "The ultimate vegetarian feast: Basmati Rice, 2 Puris, Sambhar, Rasam, Kootu, Poriyal, Special Kuzhambu, Curd, Pickle, Papad, and traditional Payasam.",
    price: 299,
    category: "Traditional Mains",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop",
    isBestseller: true,
    spiceLevel: 1,
    ingredients: ["Basmati Rice", "Assorted Lentil Stews", "Fresh Seasonal Vegetables", "Whole Wheat Flour", "Curd", "Jaggery"]
  },
  {
    id: "b2",
    name: "Elaneer Payasam",
    description: "A luxury South Indian dessert made of sweet, creamy milk reduced with tender coconut meat pulp, flavored with green cardamom and saffron strands.",
    price: 149,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=600&auto=format&fit=crop",
    isBestseller: true,
    spiceLevel: 0,
    ingredients: ["Tender Coconut Water & Meat", "Reduced Milk", "Cardamom Powder", "Saffron Strands"]
  }
];
