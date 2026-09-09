const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { buildUpiUri } from '../../shared/upi.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { items, customer_name, customer_phone, delivery_address, pincode, delivery_type } = body;

    // --- validate customer input (never trust the client) ---
    if (!customer_name || String(customer_name).trim().length < 2) {
      return Response.json({ error: 'Please enter your full name' }, { status: 400 });
    }
    if (!/^\d{10}$/.test(String(customer_phone || ''))) {
      return Response.json({ error: 'Please enter a valid 10-digit mobile number' }, { status: 400 });
    }
    if (delivery_type !== 'Home Delivery' && delivery_type !== 'Self Pickup') {
      return Response.json({ error: 'Invalid delivery type' }, { status: 400 });
    }
    if (delivery_type === 'Home Delivery') {
      if (!delivery_address || String(delivery_address).trim().length < 8) {
        return Response.json({ error: 'Please enter your full delivery address' }, { status: 400 });
      }
      if (!/^\d{6}$/.test(String(pincode || ''))) {
        return Response.json({ error: 'Please enter a valid 6-digit pincode' }, { status: 400 });
      }
    }
    if (!Array.isArray(items) || items.length === 0) {
      return Response.json({ error: 'Your cart is empty' }, { status: 400 });
    }

    // --- server-side price recalculation from the database (anti-tampering) ---
    const products = await db.asServiceRole.entities.Product.list();
    const productMap = {};
    for (const p of products) productMap[p.id] = p;

    let total = 0;
    const lineItems = [];
    for (const it of items) {
      const p = productMap[it.product_id];
      if (!p || !p.in_stock) {
        return Response.json({ error: 'A selected sweet is unavailable. Please refresh your cart.' }, { status: 400 });
      }
      let price;
      if (it.weight === '250g') price = p.price_250g;
      else if (it.weight === '500g') price = p.price_500g;
      else if (it.weight === '1kg') price = p.price_1kg;
      else return Response.json({ error: 'Invalid weight selection' }, { status: 400 });
      const qty = Math.max(1, Math.min(50, Math.floor(Number(it.quantity) || 1)));
      total += price * qty;
      lineItems.push({
        order_id: '',
        product_id: p.id,
        product_name: p.name,
        quantity: qty,
        weight_selected: it.weight,
        price_at_purchase: price
      });
    }
    total = Math.round(total);

    // --- create the order with a sequential order number ---
    const existing = await db.asServiceRole.entities.Order.list('-created_date', 1000);
    const orderNumber = 'ORD-' + (1001 + existing.length);

    const order = await db.asServiceRole.entities.Order.create({
      order_number: orderNumber,
      customer_name: String(customer_name).trim(),
      customer_phone: String(customer_phone),
      delivery_address: String(delivery_address || '').trim(),
      pincode: String(pincode || ''),
      delivery_type,
      total_amount: total,
      upi_utr_number: '',
      payment_proof_url: '',
      status: 'PENDING_APPROVAL'
    });

    await db.asServiceRole.entities.OrderItem.bulkCreate(
      lineItems.map(li => ({ ...li, order_id: order.id }))
    );

    return Response.json({
      order_id: order.id,
      order_number: orderNumber,
      total_amount: total,
      upi_uri: buildUpiUri(total, orderNumber)
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}