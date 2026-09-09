// Local In-Browser Database Engine for Palnadu Sweets
// Runs 100% in the frontend with zero backend server required!

import { buildUpiUri } from "@/lib/shopConfig";

const DEFAULT_PRODUCTS = [
  {
    id: "prod_1",
    name: "Pure Ghee Mysore Pak",
    category: "Ghee Specials",
    description: "Melt-in-mouth traditional Mysore Pak made with 100% pure cow ghee and aromatic cardamom.",
    badge: "Bestseller",
    price_250g: 175,
    price_500g: 340,
    price_1kg: 660,
    in_stock: true,
    is_in_stock: true,
    image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
    created_date: new Date().toISOString(),
  },
  {
    id: "prod_2",
    name: "Special Kaju Katli",
    category: "Dry Fruit & Kaju",
    description: "Diamond-cut premium cashew fudge made with pure cashews and edible silver leaf.",
    badge: "Popular",
    price_250g: 275,
    price_500g: 540,
    price_1kg: 1050,
    in_stock: true,
    is_in_stock: true,
    image_url: "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=600&auto=format&fit=crop&q=80",
    created_date: new Date().toISOString(),
  },
  {
    id: "prod_3",
    name: "Andhra Madatha Kaja",
    category: "All Sweets",
    description: "Crispy and juicy layered Andhra traditional sweet soaked in pure saffron sugar syrup.",
    badge: "Traditional",
    price_250g: 140,
    price_500g: 270,
    price_1kg: 520,
    in_stock: true,
    is_in_stock: true,
    image_url: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&auto=format&fit=crop&q=80",
    created_date: new Date().toISOString(),
  },
  {
    id: "prod_4",
    name: "Pure Ghee Motichoor Laddu",
    category: "Ghee Specials",
    description: "Tiny gram-flour pearls fried in pure ghee, blended with cardamom, saffron, and melon seeds.",
    badge: "Fresh Daily",
    price_250g: 160,
    price_500g: 310,
    price_1kg: 600,
    in_stock: true,
    is_in_stock: true,
    image_url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
    created_date: new Date().toISOString(),
  },
  {
    id: "prod_5",
    name: "Traditional Bellam Ariselu",
    category: "All Sweets",
    description: "Classic Telugu festive delicacy prepared with pure organic jaggery, rice flour, and sesame seeds.",
    badge: "Authentic",
    price_250g: 150,
    price_500g: 290,
    price_1kg: 560,
    in_stock: true,
    is_in_stock: true,
    image_url: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=80",
    created_date: new Date().toISOString(),
  },
  {
    id: "prod_6",
    name: "Kaju Pista Roll",
    category: "Dry Fruit & Kaju",
    description: "Delightful cashew rolls stuffed with roasted pistachios, almonds, and royal saffron.",
    badge: "Premium",
    price_250g: 300,
    price_500g: 580,
    price_1kg: 1120,
    in_stock: true,
    is_in_stock: true,
    image_url: "https://images.unsplash.com/photo-1505253758473-96b3015f27eb?w=600&auto=format&fit=crop&q=80",
    created_date: new Date().toISOString(),
  },
  {
    id: "prod_7",
    name: "Special Spicy Palnadu Mixture",
    category: "Namkeen & Snacks",
    description: "Crispy savoury mixture with crunchy groundnuts, cashews, roasted dal, and fragrant curry leaves.",
    badge: "Crispy",
    price_250g: 110,
    price_500g: 210,
    price_1kg: 400,
    in_stock: true,
    is_in_stock: true,
    image_url: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop&q=80",
    created_date: new Date().toISOString(),
  },
  {
    id: "prod_8",
    name: "Palnadu Royal Festival Gift Box",
    category: "Festival Gift Boxes",
    description: "Exquisite assortment of Kaju Katli, Mysore Pak, Dry Fruit Laddu, and Putharekulu in a luxury gift box.",
    badge: "Gift Special",
    price_250g: 350,
    price_500g: 680,
    price_1kg: 1300,
    in_stock: true,
    is_in_stock: true,
    image_url: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80",
    created_date: new Date().toISOString(),
  },
];

const STORAGE_KEY_PRODUCTS = "palnadu_products_v3";
const STORAGE_KEY_ORDERS = "palnadu_orders_v3";
const STORAGE_KEY_ORDER_ITEMS = "palnadu_order_items_v3";

function getStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage quota fallback */
  }
}

const listeners = new Set();
function notifyListeners() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch {}
  });
}

export function initLocalDatabase() {
  if (!getStored(STORAGE_KEY_PRODUCTS, null)) {
    setStored(STORAGE_KEY_PRODUCTS, DEFAULT_PRODUCTS);
  }
  if (!getStored(STORAGE_KEY_ORDERS, null)) {
    setStored(STORAGE_KEY_ORDERS, []);
  }
  if (!getStored(STORAGE_KEY_ORDER_ITEMS, null)) {
    setStored(STORAGE_KEY_ORDER_ITEMS, []);
  }

  const db = {
    entities: {
      Product: {
        list: async () => {
          return getStored(STORAGE_KEY_PRODUCTS, DEFAULT_PRODUCTS);
        },
        get: async (id) => {
          const list = getStored(STORAGE_KEY_PRODUCTS, DEFAULT_PRODUCTS);
          return list.find((p) => p.id === id) || null;
        },
        create: async (data) => {
          const list = getStored(STORAGE_KEY_PRODUCTS, DEFAULT_PRODUCTS);
          const newItem = {
            id: "prod_" + Date.now(),
            in_stock: true,
            is_in_stock: true,
            created_date: new Date().toISOString(),
            ...data,
          };
          list.unshift(newItem);
          setStored(STORAGE_KEY_PRODUCTS, list);
          notifyListeners();
          return newItem;
        },
        update: async (id, data) => {
          const list = getStored(STORAGE_KEY_PRODUCTS, DEFAULT_PRODUCTS);
          const idx = list.findIndex((p) => p.id === id);
          if (idx !== -1) {
            list[idx] = { ...list[idx], ...data };
            setStored(STORAGE_KEY_PRODUCTS, list);
            notifyListeners();
            return list[idx];
          }
          return null;
        },
        delete: async (id) => {
          const list = getStored(STORAGE_KEY_PRODUCTS, DEFAULT_PRODUCTS);
          const filtered = list.filter((p) => p.id !== id);
          setStored(STORAGE_KEY_PRODUCTS, filtered);
          notifyListeners();
          return { success: true };
        },
      },

      Order: {
        list: async () => {
          return getStored(STORAGE_KEY_ORDERS, []);
        },
        get: async (id) => {
          const orders = getStored(STORAGE_KEY_ORDERS, []);
          return orders.find((o) => o.id === id) || null;
        },
        create: async (data) => {
          const orders = getStored(STORAGE_KEY_ORDERS, []);
          const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);
          const newOrder = {
            id: "order_" + Date.now(),
            order_number: orderNumber,
            status: "PENDING_APPROVAL",
            created_date: new Date().toISOString(),
            ...data,
          };
          orders.unshift(newOrder);
          setStored(STORAGE_KEY_ORDERS, orders);
          notifyListeners();
          return newOrder;
        },
        update: async (id, data) => {
          const orders = getStored(STORAGE_KEY_ORDERS, []);
          const idx = orders.findIndex((o) => o.id === id);
          if (idx !== -1) {
            orders[idx] = { ...orders[idx], ...data };
            setStored(STORAGE_KEY_ORDERS, orders);
            notifyListeners();
            return orders[idx];
          }
          return null;
        },
        subscribe: (cb) => {
          listeners.add(cb);
          return () => listeners.delete(cb);
        },
      },

      OrderItem: {
        list: async () => {
          return getStored(STORAGE_KEY_ORDER_ITEMS, []);
        },
        create: async (data) => {
          const items = getStored(STORAGE_KEY_ORDER_ITEMS, []);
          const newItem = {
            id: "item_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
            created_date: new Date().toISOString(),
            ...data,
          };
          items.push(newItem);
          setStored(STORAGE_KEY_ORDER_ITEMS, items);
          return newItem;
        },
      },
    },

    functions: {
      invoke: async (name, args) => {
        if (name === "createOrder") {
          const { items, ...orderData } = args || {};
          const products = getStored(STORAGE_KEY_PRODUCTS, DEFAULT_PRODUCTS);

          let total = 0;
          const orderItems = (items || []).map((i) => {
            const product = products.find((p) => p.id === i.product_id);
            const unitPrice = product
              ? i.weight === "250g"
                ? product.price_250g
                : i.weight === "500g"
                ? product.price_500g
                : product.price_1kg
              : 0;
            total += unitPrice * i.quantity;
            return {
              product_id: i.product_id,
              product_name: product?.name || "Sweet",
              weight_selected: i.weight,
              quantity: i.quantity,
              unit_price: unitPrice,
              subtotal: unitPrice * i.quantity,
            };
          });

          const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);
          const orderId = "ord_" + Date.now();
          const newOrder = {
            id: orderId,
            order_number: orderNumber,
            customer_name: orderData.customer_name || "Customer",
            customer_phone: orderData.customer_phone || "",
            delivery_type: orderData.delivery_type || "Home Delivery",
            delivery_address: orderData.delivery_address || "",
            pincode: orderData.pincode || "",
            total_amount: total,
            status: "PENDING_APPROVAL",
            created_date: new Date().toISOString(),
          };

          const orders = getStored(STORAGE_KEY_ORDERS, []);
          orders.unshift(newOrder);
          setStored(STORAGE_KEY_ORDERS, orders);

          const allItems = getStored(STORAGE_KEY_ORDER_ITEMS, []);
          orderItems.forEach((oi) => {
            allItems.push({ ...oi, order_id: orderId });
          });
          setStored(STORAGE_KEY_ORDER_ITEMS, allItems);
          notifyListeners();

          return { data: { order_id: orderId, order_number: orderNumber } };
        }

        if (name === "getOrderDetails") {
          const { order_id } = args || {};
          const orders = getStored(STORAGE_KEY_ORDERS, []);
          const order = orders.find((o) => o.id === order_id);
          if (!order) {
            throw new Error("Order not found");
          }
          const allItems = getStored(STORAGE_KEY_ORDER_ITEMS, []);
          const items = allItems.filter((i) => i.order_id === order_id);
          const upi_uri = buildUpiUri(order.total_amount, order.order_number);

          return {
            data: {
              order,
              items,
              upi_uri,
            },
          };
        }

        if (name === "submitPaymentUtr") {
          const { order_id, utr_number, proof_url } = args || {};
          const orders = getStored(STORAGE_KEY_ORDERS, []);
          const idx = orders.findIndex((o) => o.id === order_id);
          if (idx !== -1) {
            orders[idx] = {
              ...orders[idx],
              upi_utr_number: utr_number,
              payment_proof_url: proof_url,
              status: "PENDING_APPROVAL",
            };
            setStored(STORAGE_KEY_ORDERS, orders);
            notifyListeners();
            return { data: { success: true } };
          }
          throw new Error("Order not found");
        }

        return { data: null };
      },
    },

    auth: {
      isAuthenticated: async () => {
        return localStorage.getItem("palnadu_admin_auth") === "true";
      },
      me: async () => {
        if (localStorage.getItem("palnadu_admin_auth") === "true") {
          return { id: "admin_1", email: "abbus2155@gmail.com", role: "admin" };
        }
        return null;
      },
      loginViaEmailPassword: async (email, password) => {
        const currentPassword = localStorage.getItem("palnadu_admin_password") || "Palnadu@123";
        if (password !== currentPassword) {
          throw new Error("Incorrect password. Please enter your valid admin password.");
        }
        localStorage.setItem("palnadu_admin_auth", "true");
        localStorage.setItem("palnadu_admin_email", email || "abbus2155@gmail.com");
        notifyListeners();
        return { success: true, user: { id: "admin_1", email, role: "admin" } };
      },
      changePassword: async (oldPassword, newPassword) => {
        const currentPassword = localStorage.getItem("palnadu_admin_password") || "Palnadu@123";
        if (oldPassword !== currentPassword) {
          throw new Error("Current password is incorrect.");
        }
        if (!newPassword || newPassword.trim().length < 4) {
          throw new Error("New password must be at least 4 characters long.");
        }
        localStorage.setItem("palnadu_admin_password", newPassword.trim());
        return { success: true };
      },
      logout: async (redirectTo = "/") => {
        localStorage.removeItem("palnadu_admin_auth");
        localStorage.removeItem("palnadu_admin_email");
        notifyListeners();
        window.location.href = redirectTo;
      },
      redirectToLogin: (returnTo) => {
        window.location.href = `/admin/login?returnTo=${encodeURIComponent(returnTo || "/admin")}`;
      },
      resetPasswordRequest: async () => {
        return { success: true };
      },
      resetPassword: async () => {
        return { success: true };
      },
    },

    app: {
      getPublicSettings: async () => {
        return {
          id: "palnadu-sweets",
          public_settings: {
            shop_name: "Palnadu Sweets",
            upi_id: "Q396308303@ybl",
          },
        };
      },
    },

    integrations: {
      Core: {
        UploadFile: async ({ file }) => {
          return new Promise((resolve) => {
            if (!file) {
              resolve({ file_url: "" });
              return;
            }
            const reader = new FileReader();
            reader.onload = () => resolve({ file_url: reader.result });
            reader.onerror = () => resolve({ file_url: "" });
            reader.readAsDataURL(file);
          });
        },
      },
    },
  };

  globalThis.__B44_DB__ = db;
  return db;
}

export const db = initLocalDatabase();
export default db;
