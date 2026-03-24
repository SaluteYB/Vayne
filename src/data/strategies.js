// ── Technical Indicator Helpers ────────────────────────────────────────────

export const sma = (prices, period) =>
  prices.map((_, i) =>
    i < period - 1
      ? null
      : prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period
  );

export const ema = (prices, period) => {
  const k = 2 / (period + 1);
  const result = new Array(period - 1).fill(null);
  let prev = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  result.push(prev);
  for (let i = period; i < prices.length; i++) {
    prev = prices[i] * k + prev * (1 - k);
    result.push(prev);
  }
  return result;
};

export const rsi = (prices, period = 14) => {
  if (prices.length <= period) return new Array(prices.length).fill(null);
  const result = new Array(period).fill(null);
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const d = prices[i] - prices[i - 1];
    if (d > 0) gains += d; else losses -= d;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  result.push(avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss));
  for (let i = period + 1; i < prices.length; i++) {
    const d = prices[i] - prices[i - 1];
    avgGain = (avgGain * (period - 1) + Math.max(d, 0)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(-d, 0)) / period;
    result.push(avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss));
  }
  return result;
};

export const bollingerBands = (prices, period = 20, mult = 2) => {
  const mid = sma(prices, period);
  return mid.map((m, i) => {
    if (m === null) return { upper: null, middle: null, lower: null };
    const slice = prices.slice(i - period + 1, i + 1);
    const std = Math.sqrt(slice.reduce((s, p) => s + (p - m) ** 2, 0) / period);
    return { upper: m + mult * std, middle: m, lower: m - mult * std };
  });
};

export const macd = (prices, fast = 12, slow = 26, signal = 9) => {
  const fastEma = ema(prices, fast);
  const slowEma = ema(prices, slow);
  const macdLine = fastEma.map((f, i) => (f === null || slowEma[i] === null ? null : f - slowEma[i]));
  const validMacd = macdLine.filter((v) => v !== null);
  const signalLine = ema(validMacd, signal);
  // Pad signal to full length
  const pad = macdLine.length - signalLine.length;
  const paddedSignal = [...new Array(pad).fill(null), ...signalLine];
  const histogram = macdLine.map((m, i) =>
    m === null || paddedSignal[i] === null ? null : m - paddedSignal[i]
  );
  return { macdLine, signalLine: paddedSignal, histogram };
};

// ── Strategy Definitions ───────────────────────────────────────────────────

/**
 * Signal values:
 *  'buy'     - strong buy signal (entry point)
 *  'sell'    - strong sell signal (entry point)
 *  'bullish' - weak bullish bias (hold)
 *  'bearish' - weak bearish bias (hold)
 *  'neutral' - no clear signal
 */

export const STRATEGIES = [
  {
    id: 'ma_cross',
    name: 'MA均线交叉',
    description: '5日均线上穿20日均线买入，下穿卖出',
    params: { fast: 5, slow: 20 },
    signal(prices) {
      if (prices.length < 21) return 'neutral';
      const fast = sma(prices, 5);
      const slow = sma(prices, 20);
      const n = prices.length - 1;
      if (fast[n] === null || slow[n] === null || fast[n - 1] === null || slow[n - 1] === null)
        return 'neutral';
      const crossUp = fast[n] > slow[n] && fast[n - 1] <= slow[n - 1];
      const crossDown = fast[n] < slow[n] && fast[n - 1] >= slow[n - 1];
      if (crossUp) return 'buy';
      if (crossDown) return 'sell';
      return fast[n] > slow[n] ? 'bullish' : 'bearish';
    },
    detail(prices) {
      if (prices.length < 21) return null;
      const fast = sma(prices, 5);
      const slow = sma(prices, 20);
      const n = prices.length - 1;
      return {
        'MA5': fast[n]?.toFixed(2),
        'MA20': slow[n]?.toFixed(2),
        '差值': fast[n] && slow[n] ? (fast[n] - slow[n]).toFixed(2) : null,
      };
    },
  },

  {
    id: 'rsi_strategy',
    name: 'RSI超买超卖',
    description: 'RSI(14) < 30超卖买入，> 70超买卖出',
    params: { period: 14, oversold: 30, overbought: 70 },
    signal(prices) {
      if (prices.length <= 14) return 'neutral';
      const r = rsi(prices, 14);
      const last = r[r.length - 1];
      if (last === null) return 'neutral';
      if (last < 30) return 'buy';
      if (last > 70) return 'sell';
      if (last < 45) return 'bearish';
      if (last > 55) return 'bullish';
      return 'neutral';
    },
    detail(prices) {
      if (prices.length <= 14) return null;
      const r = rsi(prices, 14);
      const last = r[r.length - 1];
      return { 'RSI(14)': last?.toFixed(1), '超卖线': '30', '超买线': '70' };
    },
  },

  {
    id: 'bollinger',
    name: '布林带策略',
    description: '价格触及下轨超卖买入，触及上轨超买卖出',
    params: { period: 20, stdDev: 2 },
    signal(prices) {
      if (prices.length < 20) return 'neutral';
      const bands = bollingerBands(prices, 20, 2);
      const { upper, middle, lower } = bands[bands.length - 1];
      const price = prices[prices.length - 1];
      if (!upper) return 'neutral';
      if (price <= lower) return 'buy';
      if (price >= upper) return 'sell';
      const pct = (price - lower) / (upper - lower);
      if (pct < 0.35) return 'bullish';
      if (pct > 0.65) return 'bearish';
      return 'neutral';
    },
    detail(prices) {
      if (prices.length < 20) return null;
      const bands = bollingerBands(prices, 20, 2);
      const { upper, middle, lower } = bands[bands.length - 1];
      const price = prices[prices.length - 1];
      const bw = upper && lower ? ((upper - lower) / middle * 100).toFixed(1) + '%' : null;
      return {
        '上轨': upper?.toFixed(2),
        '中轨': middle?.toFixed(2),
        '下轨': lower?.toFixed(2),
        '带宽': bw,
      };
    },
  },

  {
    id: 'macd_strategy',
    name: 'MACD策略',
    description: 'MACD金叉买入，死叉卖出',
    params: { fast: 12, slow: 26, signal: 9 },
    signal(prices) {
      if (prices.length < 35) return 'neutral';
      const { histogram } = macd(prices, 12, 26, 9);
      const n = histogram.length - 1;
      if (histogram[n] === null || histogram[n - 1] === null) return 'neutral';
      const goldCross = histogram[n] > 0 && histogram[n - 1] <= 0;
      const deadCross = histogram[n] < 0 && histogram[n - 1] >= 0;
      if (goldCross) return 'buy';
      if (deadCross) return 'sell';
      return histogram[n] > 0 ? 'bullish' : 'bearish';
    },
    detail(prices) {
      if (prices.length < 35) return null;
      const { macdLine, signalLine, histogram } = macd(prices, 12, 26, 9);
      const n = macdLine.length - 1;
      return {
        'MACD': macdLine[n]?.toFixed(3),
        'Signal': signalLine[n]?.toFixed(3),
        'Histogram': histogram[n]?.toFixed(3),
      };
    },
  },

  {
    id: 'momentum',
    name: '价格动量',
    description: '20日涨幅 > 10%多头动量，< -10%空头动量',
    params: { period: 20, threshold: 0.10 },
    signal(prices) {
      if (prices.length < 21) return 'neutral';
      const n = prices.length - 1;
      const ret = (prices[n] - prices[n - 20]) / prices[n - 20];
      if (ret > 0.10) return 'buy';
      if (ret < -0.10) return 'sell';
      if (ret > 0.03) return 'bullish';
      if (ret < -0.03) return 'bearish';
      return 'neutral';
    },
    detail(prices) {
      if (prices.length < 21) return null;
      const n = prices.length - 1;
      const ret = (prices[n] - prices[n - 20]) / prices[n - 20];
      const ret5 = prices.length >= 6
        ? (prices[n] - prices[n - 5]) / prices[n - 5]
        : null;
      return {
        '20日涨幅': (ret * 100).toFixed(2) + '%',
        '5日涨幅': ret5 !== null ? (ret5 * 100).toFixed(2) + '%' : null,
      };
    },
  },
];
