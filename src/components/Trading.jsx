import { useState, useEffect, useCallback, useRef } from 'react';
import { ibkr } from '../services/ibkr';
import { STRATEGIES } from '../data/strategies';

// ── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#0d0d0d',
  card: '#141414',
  card2: '#1a1a1a',
  border: 'rgba(255,255,255,0.08)',
  green: '#00d4a0',
  red: '#ff4b6e',
  yellow: '#f5c842',
  blue: '#4b8fff',
  purple: '#7c5cfc',
  text: '#fff',
  muted: 'rgba(255,255,255,0.38)',
  sub: 'rgba(255,255,255,0.55)',
};

const SIG_COLOR = {
  buy: C.green, sell: C.red, bullish: '#5af0bb', bearish: '#ff7a96', neutral: C.muted,
};
const SIG_LABEL = {
  buy: '强买', sell: '强卖', bullish: '偏多', bearish: '偏空', neutral: '中性',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n, d = 2) =>
  n == null ? '--' : Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

const fmtPct = (n) => {
  if (n == null) return '--';
  const v = Number(n);
  return (v >= 0 ? '+' : '') + v.toFixed(2) + '%';
};

const card = (extra = {}) => ({
  background: C.card, borderRadius: 16,
  border: `1px solid ${C.border}`, ...extra,
});

// ── Default watchlist (well-known IBKR conids) ───────────────────────────────
const DEFAULT_WATCHLIST = [
  { symbol: 'AAPL',  conid: '265598' },
  { symbol: 'TSLA',  conid: '76792991' },
  { symbol: 'NVDA',  conid: '4815747' },
  { symbol: 'SPY',   conid: '756733' },
];

// ════════════════════════════════════════════════════════════════════════════
export default function Trading() {
  const [connected, setConnected]       = useState(false);
  const [accounts, setAccounts]         = useState([]);
  const [accountId, setAccountId]       = useState(null);
  const [summary, setSummary]           = useState(null);
  const [positions, setPositions]       = useState([]);
  const [orders, setOrders]             = useState([]);
  const [watchlist, setWatchlist]       = useState(DEFAULT_WATCHLIST);
  const [quotes, setQuotes]             = useState({});
  const [histories, setHistories]       = useState({});
  const [tab, setTab]                   = useState('watchlist');
  const [searchText, setSearchText]     = useState('');
  const [searchRes, setSearchRes]       = useState([]);
  const [orderModal, setOrderModal]     = useState(null);
  const [orderForm, setOrderForm]       = useState({ qty: '100', type: 'MKT', price: '' });
  const [strategyItem, setStrategyItem] = useState(null); // expanded strategy detail
  const [loading, setLoading]           = useState(false);
  const [err, setErr]                   = useState('');
  const tickleTimer = useRef(null);

  // ── Connect ────────────────────────────────────────────────────────────────
  const connect = useCallback(async () => {
    setLoading(true); setErr('');
    try {
      const status = await ibkr.status();
      if (!status.authenticated) {
        setErr('请先在 https://localhost:5000 完成登录认证');
        return;
      }
      const accs = await ibkr.accounts();
      setAccounts(accs);
      const id = accs[0]?.id || accs[0]?.accountId;
      setAccountId(id);
      setConnected(true);
    } catch {
      setErr('无法连接到盈透 Client Portal Gateway。\n请确保已在本机启动并登录。');
    } finally {
      setLoading(false);
    }
  }, []);

  // Keep session alive
  useEffect(() => {
    if (!connected) return;
    tickleTimer.current = setInterval(() => ibkr.tickle().catch(() => {}), 55_000);
    return () => clearInterval(tickleTimer.current);
  }, [connected]);

  // ── Account data ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!accountId) return;
    const load = async () => {
      try {
        const [sum, pos, ord] = await Promise.all([
          ibkr.summary(accountId),
          ibkr.positions(accountId),
          ibkr.orders(),
        ]);
        setSummary(sum);
        setPositions(Array.isArray(pos) ? pos : []);
        setOrders(ord?.orders ?? []);
      } catch { /* silent */ }
    };
    load();
    const t = setInterval(load, 30_000);
    return () => clearInterval(t);
  }, [accountId]);

  // ── Market data (quotes) ───────────────────────────────────────────────────
  useEffect(() => {
    if (!connected || watchlist.length === 0) return;
    const load = async () => {
      try {
        const conids = watchlist.map((w) => w.conid).join(',');
        const data = await ibkr.snapshot(conids);
        setQuotes((prev) => {
          const next = { ...prev };
          (data || []).forEach((q) => { next[String(q.conid)] = q; });
          return next;
        });
      } catch { /* silent */ }
    };
    load();
    const t = setInterval(load, 5_000);
    return () => clearInterval(t);
  }, [connected, watchlist]);

  // ── Historical data (strategies) ──────────────────────────────────────────
  useEffect(() => {
    if (!connected) return;
    let cancelled = false;
    (async () => {
      for (const item of watchlist) {
        if (cancelled) break;
        if (histories[item.conid]) continue; // already loaded
        try {
          const data = await ibkr.history(item.conid, '3M', '1d');
          if (!cancelled && data?.data?.length) {
            setHistories((prev) => ({
              ...prev,
              [item.conid]: data.data.map((d) => d.c),
            }));
          }
        } catch { /* silent */ }
        await new Promise((r) => setTimeout(r, 300)); // rate limit
      }
    })();
    return () => { cancelled = true; };
  }, [connected, watchlist]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Symbol search ──────────────────────────────────────────────────────────
  const handleSearch = async () => {
    if (!searchText.trim()) return;
    setErr('');
    try {
      const res = await ibkr.searchSymbol(searchText.trim().toUpperCase());
      setSearchRes((res || []).slice(0, 6));
    } catch {
      setErr('搜索失败，请重试');
    }
  };

  const addSymbol = (item) => {
    const conid = String(item.conid);
    if (!watchlist.some((w) => w.conid === conid)) {
      setWatchlist((prev) => [...prev, { symbol: item.symbol, conid }]);
    }
    setSearchRes([]); setSearchText('');
  };

  const removeSymbol = (conid) => setWatchlist((prev) => prev.filter((w) => w.conid !== conid));

  // ── Place order ────────────────────────────────────────────────────────────
  const placeOrder = async () => {
    if (!orderModal || !accountId) return;
    setLoading(true); setErr('');
    try {
      const order = {
        conid: parseInt(orderModal.conid, 10),
        orderType: orderForm.type,
        side: orderModal.side,
        quantity: parseFloat(orderForm.qty),
        tif: 'DAY',
        ...(orderForm.type === 'LMT' ? { price: parseFloat(orderForm.price) } : {}),
      };
      const res = await ibkr.placeOrder(accountId, order);
      // Handle confirmation replies
      const replies = Array.isArray(res) ? res : [res];
      for (const r of replies) {
        if (r.id) await ibkr.confirmOrder(r.id, true);
      }
      setOrderModal(null);
      const ord = await ibkr.orders();
      setOrders(ord?.orders ?? []);
    } catch (e) {
      setErr('下单失败: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Compute all signals for a conid ────────────────────────────────────────
  const signals = (conid) => {
    const prices = histories[conid];
    if (!prices || prices.length < 20) return {};
    return Object.fromEntries(STRATEGIES.map((s) => [s.id, s.signal(prices)]));
  };

  // ── Sub-components ─────────────────────────────────────────────────────────
  const Pill = ({ sig }) => (
    <span style={{
      fontSize: 11, padding: '2px 8px', borderRadius: 6, fontWeight: 700,
      background: `${SIG_COLOR[sig] ?? C.muted}22`,
      color: SIG_COLOR[sig] ?? C.muted,
    }}>{SIG_LABEL[sig] ?? sig}</span>
  );

  const TradeBtn = ({ side, conid, symbol }) => (
    <button
      onClick={() => { setErr(''); setOrderModal({ conid, symbol, side }); }}
      style={{
        flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
        fontWeight: 600, fontSize: 13,
        background: side === 'BUY' ? 'rgba(0,212,160,0.12)' : 'rgba(255,75,110,0.12)',
        color: side === 'BUY' ? C.green : C.red,
      }}
    >{side === 'BUY' ? '买入' : '卖出'}</button>
  );

  // ── Connection screen ──────────────────────────────────────────────────────
  if (!connected) {
    return (
      <div style={{ padding: '32px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>📈</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>量化交易</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            接入盈透证券 Client Portal API<br />进行程序化量化交易
          </div>
        </div>

        {err && (
          <div style={{
            ...card({ padding: '12px 14px', marginBottom: 16 }),
            background: 'rgba(255,75,110,0.08)',
            borderColor: 'rgba(255,75,110,0.25)',
            color: C.red, fontSize: 13, whiteSpace: 'pre-line',
          }}>⚠️ {err}</div>
        )}

        <div style={{ ...card({ padding: 20, marginBottom: 20 }) }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>启动步骤</div>
          {[
            '从盈透官网下载 Client Portal Gateway',
            '执行 bin/run.sh（Linux/Mac）或 bin/run.bat（Windows）',
            '浏览器打开 https://localhost:5000 并登录账户',
            '接受自签名证书（高级 → 继续访问）',
            '点击下方按钮连接',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
              <span style={{
                minWidth: 22, height: 22, borderRadius: '50%', background: C.purple,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, marginTop: 1,
              }}>{i + 1}</span>
              <span style={{ fontSize: 13, color: C.sub, lineHeight: 1.5 }}>{step}</span>
            </div>
          ))}
        </div>

        <button
          onClick={connect}
          disabled={loading}
          style={{
            width: '100%', padding: '15px 0', borderRadius: 14, border: 'none',
            background: loading ? C.border : C.purple,
            color: '#fff', fontWeight: 700, fontSize: 16,
            cursor: loading ? 'default' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >{loading ? '连接中...' : '连接盈透 API'}</button>
      </div>
    );
  }

  // ── Main UI ────────────────────────────────────────────────────────────────
  const TABS = [
    { id: 'watchlist', label: '自选' },
    { id: 'positions', label: '持仓' },
    { id: 'strategies', label: '策略' },
    { id: 'orders',    label: '订单' },
  ];

  return (
    <div style={{ paddingBottom: 24 }}>

      {/* ── Account summary ── */}
      <div style={{ ...card({ padding: '16px', marginBottom: 12, marginTop: 12 }) }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', background: C.green,
              boxShadow: `0 0 8px ${C.green}`,
            }} />
            <span style={{ fontSize: 12, color: C.muted }}>{accountId}</span>
          </div>
          {accounts.length > 1 && (
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              style={{
                background: C.card2, border: `1px solid ${C.border}`,
                color: '#fff', borderRadius: 8, padding: '4px 8px', fontSize: 12,
              }}
            >
              {accounts.map((a) => (
                <option key={a.id || a.accountId} value={a.id || a.accountId}>
                  {a.id || a.accountId}
                </option>
              ))}
            </select>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {[
            { label: '净资产', key: 'netliquidation' },
            { label: '可用资金', key: 'availablefunds' },
            { label: '未实现盈亏', key: 'unrealizedpnl', pnl: true },
          ].map(({ label, key, pnl }) => {
            const val = summary?.[key]?.amount;
            const pos = Number(val) >= 0;
            return (
              <div key={key}>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{label}</div>
                <div style={{
                  fontSize: 14, fontWeight: 700,
                  color: pnl ? (pos ? C.green : C.red) : C.text,
                }}>
                  {val != null ? `$${fmt(val)}` : '--'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 12, padding: 4,
        background: 'rgba(255,255,255,0.05)', borderRadius: 12,
      }}>
        {TABS.map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex: 1, padding: '7px 0', borderRadius: 9, border: 'none', cursor: 'pointer',
            background: tab === id ? 'rgba(255,255,255,0.12)' : 'transparent',
            color: tab === id ? '#fff' : C.muted,
            fontWeight: tab === id ? 600 : 400, fontSize: 13,
          }}>{label}</button>
        ))}
      </div>

      {/* ── Watchlist ── */}
      {tab === 'watchlist' && (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="搜索股票代码 (如 AAPL)..."
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 12, outline: 'none',
                background: C.card, border: `1px solid ${C.border}`,
                color: '#fff', fontSize: 14,
              }}
            />
            <button onClick={handleSearch} style={{
              padding: '10px 16px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: C.purple, color: '#fff', fontWeight: 600, fontSize: 14,
            }}>搜索</button>
          </div>

          {searchRes.length > 0 && (
            <div style={{ ...card({ marginBottom: 10, overflow: 'hidden' }) }}>
              {searchRes.map((r, i) => (
                <div
                  key={i}
                  onClick={() => addSymbol(r)}
                  style={{
                    padding: '10px 14px', cursor: 'pointer', display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center',
                    borderBottom: i < searchRes.length - 1 ? `1px solid ${C.border}` : 'none',
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{r.symbol}</span>
                  <span style={{ color: C.muted, fontSize: 12 }}>
                    {(r.description || r.companyName || '').slice(0, 28)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {err && (
            <div style={{ color: C.red, fontSize: 13, marginBottom: 10 }}>⚠️ {err}</div>
          )}

          {watchlist.map((item) => {
            const q = quotes[item.conid] || {};
            const price = q['31'];
            const changePct = q['83'];
            const isPos = parseFloat(changePct) >= 0;
            const sigs = signals(item.conid);

            return (
              <div key={item.conid} style={{ ...card({ padding: '14px 16px', marginBottom: 8 }) }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{item.symbol}</div>
                    <div style={{ display: 'flex', gap: 5, marginTop: 7, flexWrap: 'wrap' }}>
                      {Object.entries(sigs).map(([id, sig]) => (
                        <Pill key={id} sig={sig} />
                      ))}
                      {Object.keys(sigs).length === 0 && (
                        <span style={{ fontSize: 11, color: C.muted }}>加载历史数据中…</span>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>
                      {price ? `$${fmt(price)}` : '--'}
                    </div>
                    <div style={{ fontSize: 13, color: isPos ? C.green : C.red, marginTop: 2 }}>
                      {changePct ? fmtPct(changePct) : '--'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <TradeBtn side="BUY"  conid={item.conid} symbol={item.symbol} />
                  <TradeBtn side="SELL" conid={item.conid} symbol={item.symbol} />
                  <button
                    onClick={() => removeSymbol(item.conid)}
                    style={{
                      padding: '8px 12px', borderRadius: 10, border: `1px solid ${C.border}`,
                      background: 'rgba(255,255,255,0.04)', color: C.muted, cursor: 'pointer', fontSize: 13,
                    }}
                  >✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Positions ── */}
      {tab === 'positions' && (
        <div>
          {positions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: C.muted }}>暂无持仓</div>
          ) : (
            positions.map((pos, i) => {
              const pnl = pos.unrealizedPnl ?? 0;
              const isPos = pnl >= 0;
              const pnlPct = pos.mktValue && pos.mktPrice
                ? ((pos.mktPrice - pos.avgCost) / pos.avgCost * 100).toFixed(2)
                : null;
              return (
                <div key={i} style={{ ...card({ padding: '14px 16px', marginBottom: 8 }) }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>
                        {pos.ticker || pos.contractDesc}
                      </div>
                      <div style={{ fontSize: 12, color: C.muted, marginTop: 5 }}>
                        {pos.position > 0 ? '多' : '空'} {Math.abs(pos.position)} 股
                        &nbsp;·&nbsp;均价 ${fmt(pos.avgCost)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>${fmt(pos.mktValue)}</div>
                      <div style={{ fontSize: 13, color: isPos ? C.green : C.red, marginTop: 4 }}>
                        {isPos ? '+' : ''}${fmt(pnl)}
                        {pnlPct ? ` (${isPos ? '+' : ''}${pnlPct}%)` : ''}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <TradeBtn side="BUY"  conid={String(pos.conid)} symbol={pos.ticker} />
                    <TradeBtn side="SELL" conid={String(pos.conid)} symbol={pos.ticker} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Strategies ── */}
      {tab === 'strategies' && (
        <div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 14, lineHeight: 1.6 }}>
            ⚠️ 量化信号仅供参考，不构成投资建议。交易有风险，入市需谨慎。
          </div>

          {STRATEGIES.map((strategy) => (
            <div key={strategy.id} style={{ ...card({ padding: 16, marginBottom: 12 }) }}>
              <div
                onClick={() => setStrategyItem(strategyItem === strategy.id ? null : strategy.id)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{strategy.name}</div>
                  <span style={{ color: C.muted, fontSize: 13 }}>
                    {strategyItem === strategy.id ? '▲' : '▼'}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{strategy.description}</div>
              </div>

              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {watchlist.map((item) => {
                  const prices = histories[item.conid];
                  if (!prices || prices.length < 20) {
                    return (
                      <div key={item.conid} style={{
                        display: 'flex', justifyContent: 'space-between',
                        padding: '8px 12px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.03)',
                      }}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{item.symbol}</span>
                        <span style={{ color: C.muted, fontSize: 12 }}>加载中…</span>
                      </div>
                    );
                  }
                  const sig = strategy.signal(prices);
                  const detail = strategyItem === strategy.id
                    ? strategy.detail?.(prices) : null;
                  return (
                    <div key={item.conid} style={{
                      borderRadius: 10, overflow: 'hidden',
                      background: `${SIG_COLOR[sig] ?? C.muted}10`,
                    }}>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '8px 12px',
                      }}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{item.symbol}</span>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <Pill sig={sig} />
                          {(sig === 'buy' || sig === 'sell') && (
                            <button
                              onClick={() => setOrderModal({
                                conid: item.conid, symbol: item.symbol,
                                side: sig === 'buy' ? 'BUY' : 'SELL',
                              })}
                              style={{
                                padding: '3px 10px', borderRadius: 8, fontSize: 12,
                                background: sig === 'buy' ? 'rgba(0,212,160,0.2)' : 'rgba(255,75,110,0.2)',
                                color: sig === 'buy' ? C.green : C.red,
                                border: 'none', cursor: 'pointer', fontWeight: 600,
                              }}
                            >执行</button>
                          )}
                        </div>
                      </div>
                      {detail && (
                        <div style={{
                          borderTop: `1px solid ${C.border}`,
                          padding: '8px 12px',
                          display: 'flex', gap: 16, flexWrap: 'wrap',
                        }}>
                          {Object.entries(detail).filter(([, v]) => v != null).map(([k, v]) => (
                            <div key={k}>
                              <div style={{ fontSize: 10, color: C.muted }}>{k}</div>
                              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{v}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Orders ── */}
      {tab === 'orders' && (
        <div>
          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: C.muted }}>暂无订单记录</div>
          ) : (
            orders.slice(0, 30).map((ord, i) => {
              const statusColor = {
                Filled: C.green, Cancelled: C.muted, Inactive: C.muted,
                Submitted: C.blue, PreSubmitted: C.yellow, ApiPending: C.yellow,
              }[ord.status] || C.text;
              return (
                <div key={i} style={{ ...card({ padding: '12px 16px', marginBottom: 8 }) }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>
                        <span style={{ color: ord.side === 'BUY' ? C.green : C.red }}>
                          {ord.side === 'BUY' ? '买入' : '卖出'}
                        </span>
                        {' '}{ord.ticker || ord.symbol}
                      </div>
                      <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
                        {ord.totalSize ?? ord.filledQuantity} 股
                        &nbsp;·&nbsp;{ord.orderType}
                        {ord.price ? ` · $${fmt(ord.price)}` : ''}
                        {ord.avgPrice ? ` · 成交 $${fmt(ord.avgPrice)}` : ''}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        fontSize: 12, padding: '3px 9px', borderRadius: 8, fontWeight: 600,
                        background: `${statusColor}22`, color: statusColor,
                      }}>{ord.status}</span>

                      {ord.status === 'Submitted' && (
                        <div style={{ marginTop: 8 }}>
                          <button
                            onClick={async () => {
                              try {
                                await ibkr.cancelOrder(accountId, ord.orderId);
                                const o = await ibkr.orders();
                                setOrders(o?.orders ?? []);
                              } catch (e) { setErr('撤单失败: ' + e.message); }
                            }}
                            style={{
                              padding: '3px 10px', fontSize: 12, borderRadius: 8, border: 'none',
                              background: 'rgba(255,75,110,0.15)', color: C.red, cursor: 'pointer',
                            }}
                          >撤单</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Order Modal ── */}
      {orderModal && (
        <div
          onClick={() => setOrderModal(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 500,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'flex-end',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', background: C.card2,
              borderRadius: '20px 20px 0 0', padding: '24px 20px',
              paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>
                <span style={{ color: orderModal.side === 'BUY' ? C.green : C.red }}>
                  {orderModal.side === 'BUY' ? '买入' : '卖出'}
                </span>
                {' '}{orderModal.symbol}
              </div>
              <button
                onClick={() => setOrderModal(null)}
                style={{
                  width: 32, height: 32, borderRadius: '50%', border: 'none',
                  background: 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', fontSize: 16,
                }}
              >✕</button>
            </div>

            {/* Order type */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              {['MKT', 'LMT'].map((t) => (
                <button
                  key={t}
                  onClick={() => setOrderForm((prev) => ({ ...prev, type: t }))}
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
                    background: orderForm.type === t ? C.purple : 'rgba(255,255,255,0.07)',
                    color: '#fff', fontWeight: 600, fontSize: 14,
                  }}
                >{t === 'MKT' ? '市价单' : '限价单'}</button>
              ))}
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>
                数量（股）
              </label>
              <input
                value={orderForm.qty}
                onChange={(e) => setOrderForm((p) => ({ ...p, qty: e.target.value }))}
                type="number" min="1"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 12, outline: 'none',
                  background: C.card, border: `1px solid ${C.border}`,
                  color: '#fff', fontSize: 16, boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Limit price */}
            {orderForm.type === 'LMT' && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>
                  限价（USD）
                </label>
                <input
                  value={orderForm.price}
                  onChange={(e) => setOrderForm((p) => ({ ...p, price: e.target.value }))}
                  type="number" min="0" step="0.01"
                  placeholder={quotes[orderModal.conid]?.['31'] ?? '0.00'}
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 12, outline: 'none',
                    background: C.card, border: `1px solid ${C.border}`,
                    color: '#fff', fontSize: 16, boxSizing: 'border-box',
                  }}
                />
              </div>
            )}

            {err && (
              <div style={{ color: C.red, fontSize: 13, marginBottom: 12 }}>⚠️ {err}</div>
            )}

            <button
              onClick={placeOrder}
              disabled={loading}
              style={{
                width: '100%', padding: '16px 0', borderRadius: 14, border: 'none',
                background: orderModal.side === 'BUY' ? C.green : C.red,
                color: '#fff', fontWeight: 700, fontSize: 16,
                cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1,
              }}
            >{loading ? '提交中...' : `确认${orderModal.side === 'BUY' ? '买入' : '卖出'}`}</button>
          </div>
        </div>
      )}
    </div>
  );
}
