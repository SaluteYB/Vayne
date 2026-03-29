export const CITIES = [
  { id: "sh", name: "上海" },
  { id: "bj", name: "北京" },
  { id: "sz", name: "深圳" },
  { id: "gz", name: "广州" },
  { id: "hz", name: "杭州" },
  { id: "cd", name: "成都" },
];

// 12 months of avg price per sqm (元), Mar 2025 → Feb 2026
export const PRICE_HISTORY = {
  sh: [72300, 73100, 74200, 73900, 75100, 76400, 77200, 76900, 78300, 79100, 80200, 81500],
  bj: [68500, 69200, 70100, 69800, 71200, 72500, 73100, 72800, 74200, 75600, 76100, 77300],
  sz: [65200, 66100, 67300, 66800, 68200, 69500, 70100, 69700, 71200, 72600, 73100, 74800],
  gz: [42100, 42800, 43500, 43200, 44100, 44900, 45600, 45200, 46100, 47200, 47900, 48700],
  hz: [38500, 39200, 40100, 39700, 40900, 41800, 42500, 42100, 43200, 44100, 44800, 45600],
  cd: [18200, 18600, 19100, 18900, 19500, 20100, 20600, 20300, 21000, 21600, 22100, 22700],
};

export const MONTHS = ["3月","4月","5月","6月","7月","8月","9月","10月","11月","12月","1月","2月"];

export const HOT_AREAS = {
  sh: [
    { name: "浦东新区", price: 88000, change: 4.1, vol: 3241 },
    { name: "徐汇区",   price: 105000, change: 2.3, vol: 1892 },
    { name: "静安区",   price: 118000, change: 1.9, vol: 1105 },
    { name: "黄浦区",   price: 125000, change: 1.2, vol: 832  },
    { name: "长宁区",   price: 92000,  change: 3.5, vol: 1456 },
    { name: "闵行区",   price: 65000,  change: 5.8, vol: 3678 },
  ],
  bj: [
    { name: "朝阳区", price: 82500,  change: 3.2, vol: 1842 },
    { name: "海淀区", price: 89200,  change: 2.8, vol: 1635 },
    { name: "西城区", price: 105000, change: 1.5, vol: 892  },
    { name: "东城区", price: 98000,  change: 1.8, vol: 756  },
    { name: "丰台区", price: 62000,  change: 4.1, vol: 2103 },
    { name: "通州区", price: 45000,  change: 5.2, vol: 2891 },
  ],
  sz: [
    { name: "南山区", price: 105000, change: 3.8, vol: 2156 },
    { name: "福田区", price: 98000,  change: 2.1, vol: 1789 },
    { name: "宝安区", price: 62000,  change: 6.2, vol: 4231 },
    { name: "龙华区", price: 55000,  change: 7.1, vol: 3892 },
    { name: "龙岗区", price: 48000,  change: 8.3, vol: 4561 },
    { name: "光明区", price: 38000,  change: 9.5, vol: 2345 },
  ],
  gz: [
    { name: "天河区", price: 72000, change: 2.5, vol: 2341 },
    { name: "越秀区", price: 65000, change: 1.8, vol: 1523 },
    { name: "海珠区", price: 58000, change: 3.2, vol: 2891 },
    { name: "番禺区", price: 38000, change: 5.6, vol: 4123 },
    { name: "白云区", price: 42000, change: 4.3, vol: 3456 },
    { name: "黄埔区", price: 45000, change: 6.1, vol: 3012 },
  ],
  hz: [
    { name: "西湖区", price: 68000, change: 3.1, vol: 1234 },
    { name: "上城区", price: 55000, change: 4.2, vol: 1892 },
    { name: "滨江区", price: 52000, change: 5.8, vol: 2341 },
    { name: "余杭区", price: 38000, change: 7.2, vol: 3456 },
    { name: "萧山区", price: 35000, change: 6.5, vol: 3123 },
    { name: "临平区", price: 28000, change: 8.9, vol: 2891 },
  ],
  cd: [
    { name: "锦江区",   price: 32000, change: 4.5, vol: 1892 },
    { name: "青羊区",   price: 28000, change: 5.2, vol: 1634 },
    { name: "武侯区",   price: 25000, change: 6.8, vol: 2341 },
    { name: "高新区",   price: 22000, change: 8.3, vol: 3456 },
    { name: "天府新区", price: 18000, change: 12.5, vol: 4891 },
    { name: "双流区",   price: 15000, change: 9.2, vol: 3234 },
  ],
};

export const MARKET = {
  sh: { sentiment: 74, label: "强势", signal: "做多", listings: 35680, sold: 5234, avgDOM: 35, pricecut: 12, newListings: 1823, absorb: "14.7%" },
  bj: { sentiment: 68, label: "偏强", signal: "观望", listings: 28420, sold: 3891, avgDOM: 42, pricecut: 18, newListings: 1456, absorb: "13.7%" },
  sz: { sentiment: 71, label: "强势", signal: "做多", listings: 22150, sold: 4123, avgDOM: 38, pricecut: 15, newListings: 1678, absorb: "18.6%" },
  gz: { sentiment: 55, label: "中性", signal: "观望", listings: 42300, sold: 4890, avgDOM: 58, pricecut: 28, newListings: 2134, absorb: "11.6%" },
  hz: { sentiment: 62, label: "偏强", signal: "观望", listings: 19800, sold: 3234, avgDOM: 45, pricecut: 22, newListings: 1023, absorb: "16.3%" },
  cd: { sentiment: 79, label: "强势", signal: "做多", listings: 56700, sold: 8920, avgDOM: 28, pricecut:  8, newListings: 3412, absorb: "15.7%" },
};
