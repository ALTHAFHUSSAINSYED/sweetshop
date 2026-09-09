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
  "Dry Fruit & Kaju",
  "Bengali Sweets",
  "Namkeen & Snacks",
  "Festival Gift Boxes",
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
  const lines = [
    `🍬 *Update on your Palnadu Sweets order*`,
    "",
    `*Order ID:* #${order.order_number}`,
    `*Status:* ${statusLabel}`,
    `*Total:* ₹${order.total_amount}`,
    "",
    "Thank you for ordering from Palnadu Sweets! 🙏",
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