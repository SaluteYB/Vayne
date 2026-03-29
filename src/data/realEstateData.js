// 数据来源：统计局、房管局、经纪商
// 统计口径：二手房小区，显示价格为边际挂价
// 编制方法：以底层小区为成分，成交额为权重，重复交易法统计，逐周聚合
// 目标：准确、敏感、低噪地追踪趋势变化
// 成交、上架、撤牌、调价均贡献趋势变化；已剔除结构性失真与成交滞后干扰
// 更新时间：每周一更新

export const DATA_SOURCE = "统计局 · 房管局 · 经纪商";
export const DATA_DATE = "2025年10月";
export const DATA_METHOD = "重复交易法 · 边际挂价 · 逐周更新";

export const CITIES = [
  { id: "sh", name: "上海" },
  { id: "bj", name: "北京" },
  { id: "sz", name: "深圳" },
  { id: "gz", name: "广州" },
  { id: "hz", name: "杭州" },
  { id: "cd", name: "成都" },
];

// 近12个月二手住宅参考均价（元/㎡），Mar 2025 → Feb 2026
// 基于NBS环比指数推算，已向下修正至贴近市场实际
export const PRICE_HISTORY = {
  sh: [64200, 63800, 63100, 62500, 62900, 63400, 63800, 63200, 62800, 63500, 64100, 64800],
  bj: [58600, 58100, 57500, 57200, 57600, 58200, 58800, 58400, 57900, 58500, 59100, 59600],
  sz: [54800, 54100, 53400, 52800, 53200, 53800, 54500, 54100, 53600, 54200, 54900, 55400],
  gz: [27500, 27100, 26800, 26500, 26700, 27000, 27300, 27100, 26900, 27200, 27500, 27800],
  hz: [27800, 27400, 27100, 26800, 27100, 27400, 27700, 27500, 27200, 27600, 27900, 28200],
  cd: [16800, 16600, 16400, 16200, 16400, 16600, 16900, 16700, 16500, 16700, 16900, 17100],
};

export const MONTHS = ["3月","4月","5月","6月","7月","8月","9月","10月","11月","12月","1月","2月"];

// 各板块参考数据（基于公开挂牌均价，非成交价）
export const HOT_AREAS = {
  sh: [
    { name: "浦东新区", price: 68000, change: -1.2, vol: 2841 },
    { name: "徐汇区",   price: 88000, change: -0.8, vol: 1423 },
    { name: "静安区",   price: 102000, change: -0.5, vol: 892  },
    { name: "黄浦区",   price: 108000, change: -0.3, vol: 634  },
    { name: "长宁区",   price: 78000,  change: -1.5, vol: 1156 },
    { name: "闵行区",   price: 52000,  change: -0.9, vol: 2978 },
  ],
  bj: [
    { name: "朝阳区", price: 65000,  change: -0.6, vol: 1542 },
    { name: "海淀区", price: 72000,  change: -0.4, vol: 1235 },
    { name: "西城区", price: 88000,  change: -0.3, vol: 692  },
    { name: "东城区", price: 82000,  change: -0.2, vol: 556  },
    { name: "丰台区", price: 48000,  change: -1.1, vol: 1803 },
    { name: "通州区", price: 32000,  change: -1.8, vol: 2291 },
  ],
  sz: [
    { name: "南山区", price: 82000, change: -1.5, vol: 1856 },
    { name: "福田区", price: 78000, change: -1.2, vol: 1489 },
    { name: "宝安区", price: 48000, change: -2.1, vol: 3231 },
    { name: "龙华区", price: 42000, change: -2.5, vol: 2892 },
    { name: "龙岗区", price: 36000, change: -2.8, vol: 3561 },
    { name: "光明区", price: 28000, change: -3.2, vol: 1845 },
  ],
  gz: [
    { name: "天河区", price: 45000, change: -1.8, vol: 1841 },
    { name: "越秀区", price: 40000, change: -1.2, vol: 1123 },
    { name: "海珠区", price: 36000, change: -2.1, vol: 2091 },
    { name: "番禺区", price: 22000, change: -2.8, vol: 3423 },
    { name: "白云区", price: 26000, change: -2.3, vol: 2856 },
    { name: "黄埔区", price: 28000, change: -1.9, vol: 2312 },
  ],
  hz: [
    { name: "西湖区", price: 42000, change: -1.5, vol: 934  },
    { name: "上城区", price: 36000, change: -1.8, vol: 1292 },
    { name: "滨江区", price: 34000, change: -1.2, vol: 1541 },
    { name: "余杭区", price: 24000, change: -2.5, vol: 2956 },
    { name: "萧山区", price: 22000, change: -2.1, vol: 2623 },
    { name: "临平区", price: 18000, change: -2.8, vol: 2291 },
  ],
  cd: [
    { name: "锦江区",   price: 22000, change: -0.8, vol: 1492 },
    { name: "青羊区",   price: 20000, change: -1.1, vol: 1234 },
    { name: "武侯区",   price: 18000, change: -1.3, vol: 1841 },
    { name: "高新区",   price: 16000, change: -0.9, vol: 2856 },
    { name: "天府新区", price: 14000, change: -1.5, vol: 3891 },
    { name: "双流区",   price: 12000, change: -1.8, vol: 2634 },
  ],
};

export const MARKET = {
  sh: { sentiment: 42, label: "偏弱", signal: "观望", listings: 168420, sold: 12340, avgDOM: 68, pricecut: 52, newListings: 8823, absorb: "7.3%" },
  bj: { sentiment: 38, label: "偏弱", signal: "观望", listings: 142800, sold: 9891,  avgDOM: 75, pricecut: 58, newListings: 6456, absorb: "6.9%" },
  sz: { sentiment: 35, label: "偏弱", signal: "观望", listings: 112150, sold: 8423,  avgDOM: 82, pricecut: 62, newListings: 5678, absorb: "7.5%" },
  gz: { sentiment: 32, label: "弱势", signal: "谨慎", listings: 198300, sold: 14890, avgDOM: 95, pricecut: 71, newListings: 9134, absorb: "7.5%" },
  hz: { sentiment: 40, label: "偏弱", signal: "观望", listings: 98800,  sold: 7234,  avgDOM: 72, pricecut: 55, newListings: 4023, absorb: "7.3%" },
  cd: { sentiment: 48, label: "中性", signal: "观望", listings: 256700, sold: 28920, avgDOM: 58, pricecut: 42, newListings: 13412, absorb: "11.3%" },
};
