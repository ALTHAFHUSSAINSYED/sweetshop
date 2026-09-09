const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { buildUpiUri } from '../../shared/upi.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { order_id } = body;
    if (!order_id) {
      return Response.json({ error: 'Missing order id' }, { status: 400 });
    }

    let order;
    try {
      order = await db.asServiceRole.entities.Order.get(order_id);
    } catch (e) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    const items = await db.asServiceRole.entities.OrderItem.filter({ order_id });
    return Response.json({
      order,
      items,
      upi_uri: buildUpiUri(order.total_amount, order.order_number)
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}