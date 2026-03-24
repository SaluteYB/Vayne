/**
 * Interactive Brokers Client Portal Web API
 * Gateway runs at https://localhost:5000
 * Docs: https://www.interactivebrokers.com/api/doc.html
 */

const BASE = 'https://localhost:5000/v1/api';

const req = async (path, options = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText}${text ? ': ' + text : ''}`);
  }
  return res.json();
};

export const ibkr = {
  // Session
  status: () => req('/iserver/auth/status'),
  tickle: () => req('/tickle', { method: 'POST' }),
  reauthenticate: () => req('/iserver/reauthenticate', { method: 'POST' }),

  // Accounts
  accounts: () => req('/portfolio/accounts'),
  summary: (accountId) => req(`/portfolio/${accountId}/summary`),
  positions: (accountId, pageId = 0) => req(`/portfolio/${accountId}/positions/${pageId}`),

  // Orders
  orders: () => req('/iserver/account/orders'),
  placeOrder: (accountId, order) =>
    req(`/iserver/account/${accountId}/orders`, {
      method: 'POST',
      body: JSON.stringify({ orders: [order] }),
    }),
  confirmOrder: (replyId, confirmed = true) =>
    req(`/iserver/reply/${replyId}`, {
      method: 'POST',
      body: JSON.stringify({ confirmed }),
    }),
  cancelOrder: (accountId, orderId) =>
    req(`/iserver/account/${accountId}/order/${orderId}`, { method: 'DELETE' }),

  // Market data
  searchSymbol: (symbol, secType = 'STK') =>
    req(`/iserver/secdef/search?symbol=${encodeURIComponent(symbol)}&name=true&secType=${secType}`),
  snapshot: (conids, fields = '31,83,84,85,87,88') =>
    req(`/iserver/marketdata/snapshot?conids=${conids}&fields=${fields}`),
  unsubscribeAll: () => req('/iserver/marketdata/unsubscribeall', { method: 'GET' }),

  // Historical data (HMDS)
  // period: 1D, 1W, 1M, 3M, 6M, 1Y  bar: 1min, 5min, 1h, 1d, 1w
  history: (conid, period = '3M', bar = '1d') =>
    req(`/hmds/history?conid=${conid}&period=${period}&bar=${bar}&outsideRth=true`),
};

// Market data field codes
export const FIELDS = {
  LAST: '31',
  CHANGE_PCT: '83',
  BID: '84',
  ASK: '85',
  VOLUME: '87',
  OPEN: '88',
  HIGH: '70',
  LOW: '71',
  CLOSE: '7295',
};
