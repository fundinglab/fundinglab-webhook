import { getRawBody } from 'raw-body';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false });

  let body;
  try {
    const raw = await getRawBody(req);
    body = JSON.parse(raw.toString());
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Invalid body' });
  }

  const eventType = body.type;
  if (eventType === 'subscription.created') return handleCreate(body, res);
  if (['subscription.cancelled', 'subscription.expired'].includes(eventType)) return handleCancel(body, res);
  return res.status(200).json({ success: true, message: 'Ignored' });
}

async function handleCreate(body, res) {
  const meta = body.data.metadata || {};
  const { login, investor_password, broker_server, platform = 'mt4' } = meta;
  const token = process.env.METAAPI_TOKEN;
  const master = process.env.METAAPI_MASTER_ID;

  if (!login || !investor_password || !broker_server) {
    return res.status(400).json({ success: false, message: 'Missing metadata' });
  }

  const response = await fetch('https://trading-api-v1.metaapi.cloud/users/current/copyfactory2/subscribers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'auth-token': token },
    body: JSON.stringify({
      name: `Whop Sub ${body.data.id}`,
      subscriptions: [{ strategyId: master, multiplier: 1 }],
      connectionSettings: { server: broker_server, login, password: investor_password, platform },
      metadata: { whopSubscriptionId: body.data.id, whopUserId: body.data.user?.id || 'unknown' }
    })
  });

  const result = await response.json();
  if (!response.ok) return res.status(500).json({ success: false, error: result });
  return res.status(200).json({ success: true, id: result.id });
}

async function handleCancel(body, res) {
  const token = process.env.METAAPI_TOKEN;
  const subId = body.data.id;

  const all = await fetch('https://trading-api-v1.metaapi.cloud/users/current/copyfactory2/subscribers', {
    headers: { 'auth-token': token }
  });
  const list = await all.json();
  const match = list.find(s => s.metadata?.whopSubscriptionId === subId);
  if (!match) return res.status(200).json({ success: true, message: 'No match found' });

  const disable = await fetch(`https://trading-api-v1.metaapi.cloud/users/current/copyfactory2/subscribers/${match.id}/disable`, {
    method: 'PUT',
    headers: { 'auth-token': token }
  });
  if (!disable.ok) return res.status(500).json({ success: false, error: await disable.json() });

  return res.status(200).json({ success: true, message: 'Disabled', id: match.id });
}

export const config = { api: { bodyParser: false } };
