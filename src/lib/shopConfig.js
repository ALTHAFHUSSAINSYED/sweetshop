export const SHOP = {
  name: "Palnadu Sweets",
  tagline: "Authentic Andhra & Pure Ghee Sweets, Fresh Daily",
  upiId: "Q396308303@ybl",
  phone: "+919381675510",
  phoneRaw: "919381675510",
  email: "abbus2155@gmail.com",
  whatsapp: "919381675510",
  address: "Near Sangam Dairy, Beside Jio Office, Maya Bazar, Piduguralla, Palnadu Dist, Andhra Pradesh 522413",
};

export const DELIVERY_CONFIG = {
  radiusKm: 20,
  hub: "Piduguralla",
  villages: [
    "Piduguralla Town & Maya Bazar",
    "Janapadu",
    "Karampudi",
    "Gurazala",
    "Dachepalli",
    "Rentachintala",
    "Brahmanapalli",
    "Julakallu",
    "Konanki",
    "Nemalipuri",
    "Morjampadu",
    "Pillutla",
    "Guttikonda",
    "Tumrukota",
    "Gamalapadu",
    "Tangeda",
  ],
  bannerText: "🛵 Online delivery within 20 km of Piduguralla & villages | 🛍️ Self pickup at Maya Bazar",
};

export const CATEGORIES = [
  "All Sweets",
  "Ghee Specials",
  "Traditional Andhra",
  "Dry Fruit & Kaju",
  "Bengali Sweets",
  "Namkeen & Snacks",
  "Festival Gift Boxes",
];

export const CATEGORY_TAXONOMY = [
  {
    id: "ghee-specials",
    categoryName: "Ghee Specials",
    name_en: "Ghee Specials",
    name_te: "నెయ్యి స్వీట్లు",
    icon: "🔥",
    subcategories: [
      { id: "mysore-pak", name_en: "Mysore Pak", name_te: "మైసూర్ పాక్", keywords: ["mysore pak"] },
      { id: "motichoor-laddu", name_en: "Motichoor Laddu", name_te: "మోతీచూర్ లడ్డూ", keywords: ["motichoor"] },
      { id: "bandar-laddu", name_en: "Bandar Laddu", name_te: "బందరు లడ్డూ", keywords: ["bandar laddu", "tokkudu"] },
      { id: "ghee-halwa", name_en: "Pure Ghee Halwa", name_te: "నెయ్యి హల్వా", keywords: ["halwa"] },
      { id: "boondi-laddu", name_en: "Boondi Laddu", name_te: "బూందీ లడ్డూ", keywords: ["boondi"] },
    ],
  },
  {
    id: "traditional-andhra",
    categoryName: "All Sweets",
    name_en: "Traditional Andhra",
    name_te: "ఆంధ్ర సంప్రదాయ పిండివంటలు",
    icon: "🌾",
    subcategories: [
      { id: "madatha-kaja", name_en: "Madatha Kaja", name_te: "మడత కాజా", keywords: ["madatha kaja", "kaja"] },
      { id: "bellam-ariselu", name_en: "Bellam Ariselu", name_te: "బెల్లం అరిసెలు", keywords: ["ariselu", "bellam"] },
      { id: "pootharekulu", name_en: "Pootharekulu", name_te: "పూతరేకులు", keywords: ["pootharekulu", "putharekulu"] },
      { id: "bobbatlu", name_en: "Nethi Bobbatlu", name_te: "నెయ్యి బొబ్బట్లు", keywords: ["bobbatlu", "polelu"] },
      { id: "sunnundalu", name_en: "Minapa Sunnundalu", name_te: "మినప సున్నుండలు", keywords: ["sunnundalu"] },
    ],
  },
  {
    id: "dry-fruit-kaju",
    categoryName: "Dry Fruit & Kaju",
    name_en: "Dry Fruit & Kaju",
    name_te: "జీడిపప్పు & డ్రై ఫ్రూట్స్",
    icon: "✨",
    subcategories: [
      { id: "kaju-katli", name_en: "Kaju Katli", name_te: "కాజు కత్లి", keywords: ["kaju katli"] },
      { id: "kaju-pista-roll", name_en: "Kaju Pista Roll", name_te: "కాజు పిస్తా రోల్", keywords: ["kaju pista", "pista roll"] },
      { id: "anjeer-barfi", name_en: "Anjeer Barfi", name_te: "అంజీర్ బర్ఫీ", keywords: ["anjeer", "barfi"] },
      { id: "dry-fruit-laddu", name_en: "Dry Fruit Laddu", name_te: "డ్రై ఫ్రూట్ లడ్డూ", keywords: ["dry fruit laddu"] },
    ],
  },
  {
    id: "bengali-sweets",
    categoryName: "Bengali Sweets",
    name_en: "Bengali & Milk Sweets",
    name_te: "బెంగాలీ & పాల స్వీట్లు",
    icon: "🥛",
    subcategories: [
      { id: "rasgulla", name_en: "Spongy Rasgulla", name_te: "రసగుల్లా", keywords: ["rasgulla"] },
      { id: "gulab-jamun", name_en: "Gulab Jamun", name_te: "గులాబ్ జామూన్", keywords: ["gulab jamun"] },
      { id: "kalakand", name_en: "Milk Kalakand", name_te: "పాల కళాకండ్", keywords: ["kalakand"] },
      { id: "malai-peda", name_en: "Malai Peda", name_te: "మలై పేడా", keywords: ["peda"] },
    ],
  },
  {
    id: "namkeen-snacks",
    categoryName: "Namkeen & Snacks",
    name_en: "Namkeen & Snacks",
    name_te: "కారప్పూస & స్నాక్స్",
    icon: "🌶️",
    subcategories: [
      { id: "palnadu-mixture", name_en: "Palnadu Special Mixture", name_te: "స్పెషల్ మిక్చర్", keywords: ["mixture"] },
      { id: "murukulu", name_en: "Chekkalu & Murukulu", name_te: "చెక్కలు & మురుకులు", keywords: ["murukulu", "chekkalu"] },
      { id: "chekodilu", name_en: "Hot Chekodilu", name_te: "చెకోడీలు", keywords: ["chekodilu"] },
      { id: "bellam-gavvalu", name_en: "Bellam Gavvalu", name_te: "తీపి గవ్వలు", keywords: ["gavvalu"] },
    ],
  },
  {
    id: "festival-gift-boxes",
    categoryName: "Festival Gift Boxes",
    name_en: "Festival Gift Boxes",
    name_te: "పండుగ గిఫ్ట్ బాక్సులు",
    icon: "🎁",
    subcategories: [
      { id: "royal-gift-box", name_en: "Royal Festival Box", name_te: "రాయల్ గిఫ్ట్ బాక్స్", keywords: ["gift box", "festival"] },
      { id: "dry-fruit-combo", name_en: "Dry Fruit Combo", name_te: "డ్రై ఫ్రూట్ కాంబో", keywords: ["combo", "assorted"] },
    ],
  },
];

export const WEIGHTS = ["250g", "500g", "1kg"];

export const priceForWeight = (product, weight) =>
  weight === "250g"
    ? product.price_250g
    : weight === "500g"
      ? product.price_500g
      : product.price_1kg;

export const formatINR = (n) => "₹" + Number(n).toLocaleString("en-IN");

export const buildUpiUri = (amount, orderNumber) =>
  `upi://pay?pa=${SHOP.upiId}&pn=${encodeURIComponent(SHOP.name)}&am=${amount}&tr=${encodeURIComponent(
    orderNumber
  )}&tn=${encodeURIComponent(`Payment for Order ${orderNumber}`)}&cu=INR`;

export const buildWhatsAppOrderLink = (order, items) => {
  const lines = [
    "🛍️ *New Order Placed at Palnadu Sweets*",
    "",
    `📋 *Order ID:* #${order.order_number}`,
    `👤 *Customer:* ${order.customer_name} (${order.customer_phone})`,
    "",
    "🍬 *Items Ordered:*",
    ...items.map(
      (i) => `  • ${i.product_name} (${i.weight_selected}) × ${i.quantity}`
    ),
    "",
    `💰 *Total Amount:* ₹${order.total_amount}`,
  ];
  if (order.delivery_type === "Home Delivery") {
    lines.push("🛵 *Delivery Type:* Doorstep Delivery (Within 20km)");
    lines.push(`📍 *Delivery Address:* ${order.delivery_address} - ${order.pincode}`);
  } else {
    lines.push("🛍️ *Delivery Type:* Store Self Pickup (Maya Bazar Shop, Piduguralla)");
    lines.push("📍 *Pickup Location:* Near Sangam Dairy, Beside Jio Office, Maya Bazar");
  }
  if (order.upi_utr_number) {
    lines.push(`💳 *PhonePe UPI UTR:* ${order.upi_utr_number}`);
  }
  lines.push("");
  lines.push("🙏 *Thank you for choosing Palnadu Sweets!* ✨");
  return `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
};

export const buildWhatsAppStatusLink = (order, statusLabel) => {
  let statusMessage = "Thank you for ordering with Palnadu Sweets! 🙏";
  if (statusLabel === "Paid & Confirmed" || statusLabel === "PAID") {
    statusMessage = "✅ *Payment Verified & Confirmed!* We have verified your payment and our kitchen is preparing and packing your fresh sweets right away. 🍬";
  } else if (statusLabel === "Out for Delivery") {
    statusMessage = "🛵 *Out for Delivery!* Your sweets parcel is on the way to your doorstep.";
  } else if (statusLabel === "Delivered") {
    statusMessage = "🎉 *Order Delivered!* Thank you for shopping with Palnadu Sweets. Enjoy the authentic pure ghee sweets! ✨";
  } else if (statusLabel === "Cancelled") {
    statusMessage = "⚠️ *Order Cancelled.* If your payment was deducted or you need assistance, please reply directly to this message.";
  }

  const lines = [
    `🍬 *Update from ${SHOP.name}*`,
    "",
    `📋 *Order ID:* #${order.order_number}`,
    `👤 *Customer:* ${order.customer_name}`,
    `📦 *Status:* ${statusLabel}`,
    `💰 *Total Amount:* ₹${order.total_amount}`,
    "",
    statusMessage,
    "",
    order.delivery_type === "Home Delivery"
      ? `📍 *Delivery Address:* ${order.delivery_address} (${order.pincode})`
      : `🏪 *Pickup Counter:* Maya Bazar Shop, Piduguralla`,
    "",
    `📞 *Shop WhatsApp / Phone:* ${SHOP.phone}`,
    "✨ *Handcrafted Daily with Pure Cow Ghee & Love*",
  ];
  return `https://wa.me/91${order.customer_phone}?text=${encodeURIComponent(lines.join("\n"))}`;
};

export const STATUS_LABELS = {
  PENDING_APPROVAL: "Pending Approval",
  PAID: "Paid & Confirmed",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};