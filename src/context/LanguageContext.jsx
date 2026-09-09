import React, { createContext, useContext, useEffect, useState } from "react";

const TRANSLATIONS = {
  en: {
    // Header & Announcement
    bannerText: "🛵 Online delivery within 20 km of Piduguralla & villages | 🛍️ Self pickup at Maya Bazar",
    shopTagline: "Since 1985 · Pure Ghee Sweets",
    menu: "Categories",
    cart: "Cart",
    callUs: "Call",

    // Hero
    heroBadge: "✨ Handcrafted Daily in Piduguralla",
    heroTitle: "Pure Ghee Andhra Sweets Made with Love",
    heroSubtitle: "Authentic taste of traditional Telugu sweets, prepared fresh daily with 100% pure cow ghee. Delivered fresh to your doorstep or ready for pickup at Maya Bazar.",
    heroCta: "Order Fresh Sweets",
    featurePureGhee: "100% Pure Cow Ghee",
    featureFreshDaily: "Freshly Made Daily",
    featureDelivery: "20 KM Fast Delivery",
    featureDirectUpi: "Zero Fee Direct UPI",

    // Catalog & Search
    sweetsHeading: "Our Sweets & Savouries",
    sweetsSubtitle: "Pick a weight, add to cart — fresh sweets packed to order.",
    searchPlaceholder: "Search sweets, laddus, kajas, namkeen…",
    allSweets: "All Sweets",
    noSweetsFound: "No sweets found",
    trySearchingOther: "Try searching for another sweet or browse all categories.",

    // Product Card
    addToCart: "Add to Cart",
    addedToCart: "Added ✓",
    bestseller: "Bestseller",
    popular: "Popular",
    traditional: "Traditional",
    freshDaily: "Fresh Daily",
    authentic: "Authentic",
    premium: "Premium",
    crispy: "Crispy",
    giftSpecial: "Gift Special",

    // Menu Drawer
    categoryMenu: "Sweets Menu & Categories",
    exploreMenu: "Explore all varieties of Andhra sweets & savouries",
    allCategories: "All Categories",
    viewAllSweets: "View All Sweets",
    contactShop: "Contact Store",
    mayaBazarShop: "Maya Bazar Counter, Piduguralla",

    // Cart Drawer
    yourCart: "Your Sweets Cart",
    emptyCartTitle: "Your cart is empty",
    emptyCartSubtitle: "Add some delicious pure ghee sweets to begin your order.",
    browseSweets: "Browse Sweets",
    subtotal: "Subtotal",
    deliveryFee: "Delivery Fee",
    freeDelivery: "FREE (within 20km)",
    total: "Total",
    checkoutButton: "Proceed to Checkout",

    // Checkout
    checkoutTitle: "Checkout",
    backToSweets: "Continue Shopping",
    yourDetails: "Your Details",
    fullName: "Full Name",
    fullNamePlaceholder: "Enter your full name",
    phoneLabel: "Mobile Number (10 digits)",
    deliveryOptions: "Delivery & Pickup Options",
    doorstepDelivery: "Doorstep Delivery (20km)",
    doorstepSub: "Piduguralla & surrounding villages",
    storePickup: "Store Self Pickup",
    storePickupSub: "Collect fresh from Maya Bazar shop",
    addressLabel: "Delivery Address (House / Street / Village)",
    addressPlaceholder: "e.g. Near Ramalayam Temple, Main Road, Janapadu Village",
    pincodeLabel: "Pincode (6 digits)",
    orderSummary: "Order Summary",
    placeOrderButton: "Place Order · Pay via UPI",

    // Payment Page
    orderSuccessBadge: "🎉 Order Placed Successfully",
    orderHeading: "Order",
    scanToPay: "Scan to Pay via UPI",
    scanSubtitle: "Works with PhonePe, Google Pay, Paytm, BHIM or any UPI app",
    payViaUpiApp: "Pay via UPI App (PhonePe / GPay / Paytm)",
    shopUpiId: "Shop UPI ID",
    copy: "Copy ID",
    copied: "Copied ✓",
    iHavePaid: "I Have Paid",
    paymentReported: "Payment Reported Successfully!",
    orderPreparing: "Our team is verifying and preparing your fresh sweets now.",
    printBill: "Print / Save Order Bill",
    whatsappUs: "Confirm on WhatsApp",
    needHelp: "Need help with your payment?",
    chatWithShop: "Chat with our Maya Bazar shop team directly",

    // Footer
    footerAbout: "Authentic Andhra & Pure Ghee Sweets handcrafted daily in Piduguralla, Palnadu District, Andhra Pradesh. Order online and pay directly via UPI — zero gateway fees, ever.",
    contactTitle: "Store Contact",
    quickLinksTitle: "Quick Links",
    sweetsCatalogLink: "Sweets Catalog",
    copyright: "Direct UPI payments — 100% free, zero gateway fees",
  },

  te: {
    // Header & Announcement
    bannerText: "🛵 పిడుగురాళ్ల & పరిసర గ్రామాలకు 20 కి.మీ ఉచిత డెలివరీ | 🛍️ మాయా బజార్ షాపులో సెల్ఫ్ పికప్",
    shopTagline: "1985 నుండి · స్వచ్ఛమైన నెయ్యి స్వీట్లు",
    menu: "మెనూ / కేటగిరీలు",
    cart: "కార్ట్",
    callUs: "కాల్",

    // Hero
    heroBadge: "✨ పిడుగురాళ్లలో రోజూ తాజా తయారీ",
    heroTitle: "స్వచ్ఛమైన ఆవు నెయ్యితో చేసిన సంప్రదాయ ఆంధ్రా స్వీట్లు",
    heroSubtitle: "100% స్వచ్ఛమైన ఆవు నెయ్యితో ప్రతిరోజూ తాజాగా తయారుచేసే అచ్చమైన తెలుగు పిండివంటలు. మీ ఇంటి వద్దకే డెలివరీ లేదా మాయా బజార్ షాపులో తీసుకోండి.",
    heroCta: "తాజా స్వీట్లు ఆర్డర్ చేయండి",
    featurePureGhee: "100% స్వచ్ఛమైన ఆవు నెయ్యి",
    featureFreshDaily: "ప్రతిరోజూ తాజా తయారీ",
    featureDelivery: "20 కి.మీ వేగవంతమైన డెలివరీ",
    featureDirectUpi: "జీరో ఛార్జీలతో డైరెక్ట్ UPI",

    // Catalog & Search
    sweetsHeading: "మా స్వీట్లు & హాట్స్",
    sweetsSubtitle: "పరిమాణం ఎంచుకోండి, కార్ట్‌కు చేర్చండి — తాజాగా ప్యాక్ చేసి అందిస్తాము.",
    searchPlaceholder: "స్వీట్లు, లడ్డూలు, కాజాలు, మిక్చర్ వెతకండి…",
    allSweets: "అన్ని రకాలు",
    noSweetsFound: "స్వీట్లు దొరకలేదు",
    trySearchingOther: "మరో స్వీట్ పేరుతో వెతకండి లేదా కేటగిరీలు చూడండి.",

    // Product Card
    addToCart: "కార్ట్‌కు చేర్చండి",
    addedToCart: "చేర్చబడింది ✓",
    bestseller: "అత్యధిక అమ్మకాలు",
    popular: "పాపులర్",
    traditional: "సంప్రదాయ",
    freshDaily: "రోజూ తాజా",
    authentic: "అచ్చమైన రుచి",
    premium: "ప్రీమియం",
    crispy: "కరకరలాడే",
    giftSpecial: "పండుగ స్పెషల్",

    // Menu Drawer
    categoryMenu: "స్వీట్స్ మెనూ & కేటగిరీలు",
    exploreMenu: "అన్ని రకాల నెయ్యి స్వీట్లు & ఆంధ్ర పిండివంటలు",
    allCategories: "అన్ని కేటగిరీలు",
    viewAllSweets: "అన్ని స్వీట్లు చూడండి",
    contactShop: "షాపు సంప్రదించండి",
    mayaBazarShop: "మాయా బజార్ కౌంటర్, పిడుగురాళ్ల",

    // Cart Drawer
    yourCart: "మీ స్వీట్స్ కార్ట్",
    emptyCartTitle: "మీ కార్ట్ ఖాళీగా ఉంది",
    emptyCartSubtitle: "రుచికరమైన స్వచ్ఛమైన నెయ్యి స్వీట్లను ఎంచుకోండి.",
    browseSweets: "స్వీట్లు చూడండి",
    subtotal: "ఉపమొత్తం",
    deliveryFee: "డెలివరీ ఛార్జీ",
    freeDelivery: "ఉచితం (20 కి.మీ లోపు)",
    total: "మొత్తం",
    checkoutButton: "చెక్‌అవుట్‌కు వెళ్లండి",

    // Checkout
    checkoutTitle: "ఆర్డర్ వివరాలు (చెక్‌అవుట్)",
    backToSweets: "మరిన్ని స్వీట్లు చూడండి",
    yourDetails: "మీ వివరాలు",
    fullName: "పూర్తి పేరు",
    fullNamePlaceholder: "మీ పూర్తి పేరు నమోదు చేయండి",
    phoneLabel: "మొబైల్ నంబర్ (10 అంకెలు)",
    deliveryOptions: "డెలివరీ & పికప్ ఎంపికలు",
    doorstepDelivery: "ఇంటి వద్దకే డెలివరీ (20 కి.మీ)",
    doorstepSub: "పిడుగురాళ్ల టౌన్ & చుట్టుపక్కల గ్రామాలు",
    storePickup: "షాపులో సెల్ఫ్ పికప్",
    storePickupSub: "మాయా బజార్ షాపు నుండి స్వయంగా తీసుకోండి",
    addressLabel: "డెలివరీ చిరునామా (ఇంటి నం / వీధి / గ్రామం)",
    addressPlaceholder: "ఉదా: రామాలయం దగ్గర, మెయిన్ రోడ్, జానపాడు గ్రామం",
    pincodeLabel: "పిన్‌కోడ్ (6 అంకెలు)",
    orderSummary: "ఆర్డర్ సారాంశం",
    placeOrderButton: "ఆర్డర్ చేయండి · UPI ద్వారా చెల్లించండి",

    // Payment Page
    orderSuccessBadge: "🎉 ఆర్డర్ విజయవంతంగా నమోదైంది",
    orderHeading: "ఆర్డర్",
    scanToPay: "UPI QR స్కాన్ చేసి చెల్లించండి",
    scanSubtitle: "PhonePe, Google Pay, Paytm, BHIM లేదా ఏదైనా UPI యాప్ ద్వారా చెల్లించవచ్చు",
    payViaUpiApp: "UPI యాప్ ఓపెన్ చేయండి (PhonePe / GPay)",
    shopUpiId: "షాపు UPI ఐడీ",
    copy: "కాపీ చేయండి",
    copied: "కాపీ అయ్యింది ✓",
    iHavePaid: "నేను చెల్లించాను",
    paymentReported: "చెల్లింపు విజయవంతంగా అందింది!",
    orderPreparing: "మా బృందం పరిశీలించి మీ తాజా స్వీట్లను ప్యాకింగ్ చేస్తోంది.",
    printBill: "ఆర్డర్ బిల్ ప్రింట్ / సేవ్ చేయండి",
    whatsappUs: "వాట్సాప్‌లో కన్ఫర్మ్ చేయండి",
    needHelp: "చెల్లింపులో సహాయం కావాలా?",
    chatWithShop: "మా మాయా బజార్ షాపు టీమ్‌తో నేరుగా చాట్ చేయండి",

    // Footer
    footerAbout: "పిడుగురాళ్ల, పల్నాడు జిల్లాలో ప్రతిరోజూ స్వచ్ఛమైన ఆవు నెయ్యితో చేత్తో తయారుచేసే అచ్చమైన ఆంధ్ర స్వీట్లు & పిండివంటలు. డైరెక్ట్ UPI ద్వారా ఉచితంగా సులభంగా చెల్లించండి.",
    contactTitle: "షాపు సంప్రదింపులు",
    quickLinksTitle: "త్వరిత లింకులు",
    sweetsCatalogLink: "స్వీట్స్ జాబితా",
    copyright: "డైరెక్ట్ UPI చెల్లింపులు — 100% ఉచితం, జీరో ఫీజులు",
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Default is English ('en')
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem("palnadu_language") || "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("palnadu_language", language);
    } catch {
      /* localStorage fallback */
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "te" : "en"));
  };

  const t = (key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isTelugu: language === "te",
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageContext;
