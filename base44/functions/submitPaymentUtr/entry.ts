const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { order_id, upi_utr_number, payment_proof_url } = body;

    if (!order_id) {
      return Response.json({ error: 'Missing order id' }, { status: 400 });
    }
    if (!/^\d{12}$/.test(String(upi_utr_number || ''))) {
      return Response.json({ error: 'UPI reference (UTR) number must be exactly 12 digits' }, { status: 400 });
    }

    let order;
    try {
      order = await db.asServiceRole.entities.Order.get(order_id);
    } catch (e) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status === 'CANCELLED') {
      return Response.json({ error: 'This order was cancelled' }, { status: 400 });
    }

    await db.asServiceRole.entities.Order.update(order_id, {
      upi_utr_number: String(upi_utr_number),
      payment_proof_url: payment_proof_url ? String(payment_proof_url) : order.payment_proof_url,
      status: 'PENDING_APPROVAL'
    });

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}