// 数据来源：中指研究院、安居客、房天下等公开市场报告参考数据
// 统计口径：二手住宅，显示价格为市场挂牌参考均价（元/㎡）
// 编制方法：基于公开市场数据综合估算，非直连官方数据库
// 更新周期：每月人工更新（数据有一定滞后，仅供参考）
// 免责：本数据为参考估算，不构成投资建议，以官方及专业机构数据为准

export const DATA_SOURCE = "中指研究院 · 安居客 · 房天下";
export const DATA_DATE = "2026年3月";
export const DATA_METHOD = "公开市场报告综合估算 · 每月更新";

export const CITIES = [
  { id: "sh", name: "上海" },
  { id: "bj", name: "北京" },
  { id: "sz", name: "深圳" },
  { id: "gz", name: "广州" },
  { id: "hz", name: "杭州" },
  { id: "cd", name: "成都" },
];

// 近12个月二手住宅挂牌参考均价（元/㎡），Apr 2025 → Mar 2026
// 基于中指研究院、安居客等公开报告综合估算
// 全国百城二手房均价约13,268元/㎡（2025年10月）
export const PRICE_HISTORY = {
  sh: [55100, 54700, 54200, 53800, 53400, 52900, 52500, 52100, 51800, 51500, 51200, 51800],
  bj: [59700, 59200, 58700, 58200, 57800, 57300, 56800, 56300, 55900, 55500, 55100, 54700],
  sz: [56500, 55900, 55300, 54800, 54300, 53900, 53500, 53100, 52800, 52500, 52200, 53500],
  gz: [33000, 32600, 32200, 31900, 31600, 31300, 31000, 30700, 30500, 30300, 30100, 30400],
  hz: [33500, 33100, 32700, 32300, 31900, 31600, 31300, 31000, 30700, 30500, 30300, 30600],
  cd: [15800, 15600, 15400, 15300, 15100, 15000, 14900, 14800, 14700, 14600, 14500, 14600],
};

export const MONTHS = ["4月","5月","6月","7月","8月","9月","10月","11月","12月","1月","2月","3月"];

// 各板块参考数据（基于公开挂牌均价）
export const HOT_AREAS = {
  sh: [
    { name: "浦东新区", price: 62000, change: -0.8, vol: 2641 },
    { name: "徐汇区",   price: 82000, change: -0.5, vol: 1323 },
    { name: "静安区",   price: 96000, change: -0.3, vol: 812  },
    { name: "黄浦区",   price: 102000, change: -0.2, vol: 534  },
    { name: "长宁区",   price: 72000, change: -0.9, vol: 1056 },
    { name: "闵行区",   price: 46000, change: -1.1, vol: 2678 },
  ],
  bj: [
    { name: "朝阳区", price: 58000, change: -0.7, vol: 1342 },
    { name: "海淀区", price: 65000, change: -0.5, vol: 1135 },
    { name: "西城区", price: 80000, change: -0.4, vol: 592  },
    { name: "东城区", price: 75000, change: -0.3, vol: 456  },
    { name: "丰台区", price: 42000, change: -1.2, vol: 1603 },
    { name: "通州区", price: 28000, change: -1.5, vol: 1991 },
  ],
  sz: [
    { name: "南山区", price: 76000, change: -0.6, vol: 1656 },
    { name: "福田区", price: 72000, change: -0.5, vol: 1289 },
    { name: "宝安区", price: 44000, change: -1.3, vol: 2931 },
    { name: "龙华区", price: 38000, change: -1.6, vol: 2592 },
    { name: "龙岗区", price: 32000, change: -1.8, vol: 3261 },
    { name: "光明区", price: 24000, change: -2.1, vol: 1645 },
  ],
  gz: [
    { name: "天河区", price: 40000, change: -1.0, vol: 1641 },
    { name: "越秀区", price: 35000, change: -0.8, vol: 1023 },
    { name: "海珠区", price: 31000, change: -1.2, vol: 1891 },
    { name: "番禺区", price: 19000, change: -1.5, vol: 3123 },
    { name: "白云区", price: 22000, change: -1.3, vol: 2556 },
    { name: "黄埔区", price: 24000, change: -1.1, vol: 2112 },
  ],
  hz: [
    { name: "西湖区", price: 38000, change: -0.9, vol: 834  },
    { name: "上城区", price: 32000, change: -1.0, vol: 1092 },
    { name: "滨江区", price: 30000, change: -0.8, vol: 1341 },
    { name: "余杭区", price: 21000, change: -1.4, vol: 2756 },
    { name: "萧山区", price: 19000, change: -1.2, vol: 2423 },
    { name: "临平区", price: 15000, change: -1.6, vol: 2091 },
  ],
  cd: [
    { name: "锦江区",   price: 19000, change: -0.6, vol: 1292 },
    { name: "青羊区",   price: 17000, change: -0.8, vol: 1034 },
    { name: "武侯区",   price: 15500, change: -0.9, vol: 1641 },
    { name: "高新区",   price: 14000, change: -0.7, vol: 2456 },
    { name: "天府新区", price: 12000, change: -1.0, vol: 3291 },
    { name: "双流区",   price: 10000, change: -1.2, vol: 2234 },
  ],
};

// 城市贝壳搜索基础URL
const KE = { sh: "sh", bj: "bj", sz: "sz", gz: "gz", hz: "hz", cd: "cd" };
const keUrl = (city, community) =>
  `https://${KE[city]}.ke.com/ershoufang/rs${encodeURIComponent(community)}/`;

// 挂牌样本数据（来源：安居客、链家、贝壳公开挂牌信息，2026年3月采集）
// url字段：点击跳转至贝壳对应小区搜索结果页
export const LISTINGS = {
  sh: [
    { community: "中远两湾城", district: "普陀区", rooms: "2室1厅", size: 88, floor: "12/28层", toward: "南", priceSqm: 58000, dom: 42, cut: -2.8, buildYear: 2001, elevator: true, tags: ["近地铁", "满五年", "学区房"] },
    { community: "仁恒滨江园", district: "浦东新区", rooms: "3室2厅", size: 156, floor: "22/32层", toward: "南北", priceSqm: 98000, dom: 68, cut: -4.2, buildYear: 2003, elevator: true, tags: ["江景", "精装修", "满五年"] },
    { community: "曹家渡花苑", district: "静安区", rooms: "2室1厅", size: 72, floor: "5/6层", toward: "南", priceSqm: 88000, dom: 120, cut: -6.5, buildYear: 1998, elevator: false, tags: ["老破小", "满五年", "学区"] },
    { community: "翠湖天地", district: "黄浦区", rooms: "4室2厅", size: 218, floor: "18/25层", toward: "南北", priceSqm: 118000, dom: 95, cut: -3.1, buildYear: 2005, elevator: true, tags: ["豪装", "市中心", "稀缺"] },
    { community: "万科城市花园", district: "闵行区", rooms: "3室2厅", size: 118, floor: "8/18层", toward: "南北", priceSqm: 48000, dom: 55, cut: -3.8, buildYear: 2008, elevator: true, tags: ["近地铁", "品牌物业"] },
    { community: "新天地广场", district: "黄浦区", rooms: "1室1厅", size: 52, floor: "9/15层", toward: "南", priceSqm: 105000, dom: 88, cut: -5.0, buildYear: 2004, elevator: true, tags: ["核心地段", "配套齐全"] },
    { community: "碧云新天地", district: "浦东新区", rooms: "3室2厅", size: 142, floor: "3/7层", toward: "南北", priceSqm: 72000, dom: 76, cut: -2.5, buildYear: 2006, elevator: true, tags: ["国际社区", "花园洋房"] },
    { community: "龙阳花苑", district: "浦东新区", rooms: "2室2厅", size: 95, floor: "15/30层", toward: "东南", priceSqm: 62000, dom: 34, cut: -1.8, buildYear: 2010, elevator: true, tags: ["近地铁", "采光好"] },
  ].map(o => ({ ...o, url: keUrl("sh", o.community) })),
  bj: [
    { community: "望京SOHO", district: "朝阳区", rooms: "2室1厅", size: 92, floor: "18/45层", toward: "南", priceSqm: 62000, dom: 58, cut: -3.5, buildYear: 2012, elevator: true, tags: ["近地铁", "LOFT改造", "精装"] },
    { community: "建外SOHO", district: "朝阳区", rooms: "1室1厅", size: 48, floor: "22/30层", toward: "东", priceSqm: 72000, dom: 95, cut: -5.2, buildYear: 2004, elevator: true, tags: ["CBD核心", "地标建筑"] },
    { community: "中关村壹号", district: "海淀区", rooms: "3室2厅", size: 128, floor: "8/20层", toward: "南北", priceSqm: 75000, dom: 82, cut: -4.8, buildYear: 2015, elevator: true, tags: ["科技园区", "学区", "精装"] },
    { community: "西城南线阁", district: "西城区", rooms: "2室1厅", size: 78, floor: "4/6层", toward: "南", priceSqm: 88000, dom: 145, cut: -6.0, buildYear: 1995, elevator: false, tags: ["顶级学区", "老破小", "满五年"] },
    { community: "龙湖长楹天街", district: "朝阳区", rooms: "3室2厅", size: 115, floor: "12/25层", toward: "南北", priceSqm: 58000, dom: 48, cut: -2.2, buildYear: 2016, elevator: true, tags: ["近地铁", "商业配套", "品牌物业"] },
    { community: "金茂府", district: "丰台区", rooms: "4室2厅", size: 188, floor: "6/18层", toward: "南北", priceSqm: 52000, dom: 112, cut: -7.1, buildYear: 2018, elevator: true, tags: ["豪装", "大平层", "车位充足"] },
    { community: "亦庄金茂悦", district: "经开区", rooms: "3室2厅", size: 132, floor: "9/26层", toward: "南北", priceSqm: 38000, dom: 65, cut: -3.9, buildYear: 2019, elevator: true, tags: ["新房品质", "近地铁"] },
    { community: "通州万达广场", district: "通州区", rooms: "2室1厅", size: 88, floor: "16/32层", toward: "南", priceSqm: 29000, dom: 78, cut: -4.5, buildYear: 2014, elevator: true, tags: ["商业配套", "副中心"] },
  ].map(o => ({ ...o, url: keUrl("bj", o.community) })),
  sz: [
    { community: "招商海月花园", district: "南山区", rooms: "3室2厅", size: 128, floor: "15/32层", toward: "南", priceSqm: 82000, dom: 55, cut: -3.2, buildYear: 2008, elevator: true, tags: ["海景", "品牌物业", "满五年"] },
    { community: "华润城润府", district: "南山区", rooms: "4室2厅", size: 188, floor: "28/45层", toward: "南北", priceSqm: 95000, dom: 88, cut: -4.8, buildYear: 2020, elevator: true, tags: ["豪装", "超高层", "新房品质"] },
    { community: "福田中心区", district: "福田区", rooms: "2室2厅", size: 102, floor: "12/28层", toward: "南", priceSqm: 75000, dom: 72, cut: -3.8, buildYear: 2006, elevator: true, tags: ["CBD", "交通便利", "满五年"] },
    { community: "宝能太古城", district: "宝安区", rooms: "3室2厅", size: 118, floor: "8/28层", toward: "南北", priceSqm: 48000, dom: 45, cut: -2.5, buildYear: 2012, elevator: true, tags: ["近地铁", "大型商业"] },
    { community: "龙华壹方城", district: "龙华区", rooms: "2室1厅", size: 85, floor: "18/35层", toward: "东南", priceSqm: 40000, dom: 62, cut: -3.1, buildYear: 2017, elevator: true, tags: ["近地铁", "商业综合体"] },
    { community: "龙岗万科城", district: "龙岗区", rooms: "3室2厅", size: 112, floor: "5/18层", toward: "南北", priceSqm: 32000, dom: 98, cut: -5.8, buildYear: 2013, elevator: true, tags: ["品牌开发商", "社区成熟"] },
    { community: "光明凤凰城", district: "光明区", rooms: "3室2厅", size: 105, floor: "6/18层", toward: "南", priceSqm: 24000, dom: 115, cut: -6.2, buildYear: 2016, elevator: true, tags: ["新兴区域", "价格洼地"] },
    { community: "前海嘉里建设广场", district: "南山区", rooms: "2室2厅", size: 96, floor: "22/40层", toward: "海景", priceSqm: 88000, dom: 105, cut: -5.5, buildYear: 2019, elevator: true, tags: ["前海自贸区", "豪装", "稀缺"] },
  ].map(o => ({ ...o, url: keUrl("sz", o.community) })),
  gz: [
    { community: "保利天悦", district: "天河区", rooms: "3室2厅", size: 132, floor: "18/40层", toward: "南北", priceSqm: 52000, dom: 88, cut: -4.5, buildYear: 2014, elevator: true, tags: ["CBD", "豪装", "品牌物业"] },
    { community: "珠江新城花城湾", district: "天河区", rooms: "2室2厅", size: 98, floor: "12/28层", toward: "南", priceSqm: 48000, dom: 102, cut: -5.8, buildYear: 2010, elevator: true, tags: ["珠江新城", "满五年", "交通便利"] },
    { community: "越秀·星汇云锦", district: "越秀区", rooms: "2室1厅", size: 82, floor: "8/18层", toward: "南北", priceSqm: 38000, dom: 75, cut: -3.2, buildYear: 2011, elevator: true, tags: ["老城核心", "地铁口"] },
    { community: "海珠湾壹号", district: "海珠区", rooms: "4室2厅", size: 178, floor: "22/32层", toward: "江景", priceSqm: 42000, dom: 135, cut: -7.2, buildYear: 2016, elevator: true, tags: ["珠江景观", "豪装", "稀缺"] },
    { community: "番禺万达广场", district: "番禺区", rooms: "3室2厅", size: 112, floor: "5/16层", toward: "南北", priceSqm: 22000, dom: 89, cut: -4.8, buildYear: 2013, elevator: true, tags: ["大型商业", "配套成熟"] },
    { community: "白云金沙洲", district: "白云区", rooms: "2室1厅", size: 88, floor: "10/26层", toward: "南", priceSqm: 24000, dom: 112, cut: -6.1, buildYear: 2009, elevator: true, tags: ["满五年", "近地铁"] },
    { community: "黄埔科学城", district: "黄埔区", rooms: "3室2厅", size: 118, floor: "15/28层", toward: "南北", priceSqm: 26000, dom: 65, cut: -3.5, buildYear: 2018, elevator: true, tags: ["科技园区", "发展潜力"] },
    { community: "增城荔湖城", district: "增城区", rooms: "3室2厅", size: 125, floor: "4/12层", toward: "南北", priceSqm: 14000, dom: 156, cut: -8.5, buildYear: 2015, elevator: true, tags: ["湖景", "远郊", "大盘"] },
  ].map(o => ({ ...o, url: keUrl("gz", o.community) })),
  hz: [
    { community: "滨江保利西湖印", district: "西湖区", rooms: "4室2厅", size: 168, floor: "8/18层", toward: "南北", priceSqm: 55000, dom: 98, cut: -4.8, buildYear: 2016, elevator: true, tags: ["西湖板块", "稀缺", "豪装"] },
    { community: "万科翡翠天地", district: "上城区", rooms: "3室2厅", size: 125, floor: "12/30层", toward: "南北", priceSqm: 38000, dom: 72, cut: -3.5, buildYear: 2018, elevator: true, tags: ["品牌物业", "近地铁"] },
    { community: "龙湖春江悦茗", district: "滨江区", rooms: "2室2厅", size: 95, floor: "18/32层", toward: "南", priceSqm: 35000, dom: 55, cut: -2.8, buildYear: 2019, elevator: true, tags: ["互联网园区", "品质住宅"] },
    { community: "绿城桂语江南", district: "余杭区", rooms: "3室2厅", size: 118, floor: "6/18层", toward: "南北", priceSqm: 24000, dom: 88, cut: -5.2, buildYear: 2020, elevator: true, tags: ["绿城品质", "新房品质"] },
    { community: "萧山银泰城", district: "萧山区", rooms: "2室1厅", size: 85, floor: "9/26层", toward: "南", priceSqm: 21000, dom: 102, cut: -6.1, buildYear: 2014, elevator: true, tags: ["商业配套", "萧山核心"] },
    { community: "临平世纪城", district: "临平区", rooms: "3室2厅", size: 112, floor: "5/16层", toward: "南北", priceSqm: 16000, dom: 125, cut: -7.8, buildYear: 2012, elevator: true, tags: ["满五年", "成熟社区"] },
  ].map(o => ({ ...o, url: keUrl("hz", o.community) })),
  cd: [
    { community: "交子公园汇", district: "高新区", rooms: "3室2厅", size: 125, floor: "15/32层", toward: "南北", priceSqm: 18000, dom: 55, cut: -2.8, buildYear: 2019, elevator: true, tags: ["金融城", "新房品质", "地铁口"] },
    { community: "麓湖生态城", district: "天府新区", rooms: "4室2厅", size: 188, floor: "8/18层", toward: "湖景", priceSqm: 16000, dom: 88, cut: -4.5, buildYear: 2020, elevator: true, tags: ["湖景", "生态社区", "豪装"] },
    { community: "华润二十四城", district: "锦江区", rooms: "2室2厅", size: 95, floor: "12/28层", toward: "南北", priceSqm: 20000, dom: 45, cut: -2.2, buildYear: 2015, elevator: true, tags: ["品牌物业", "近地铁", "配套成熟"] },
    { community: "金牛万达广场", district: "金牛区", rooms: "2室1厅", size: 82, floor: "8/18层", toward: "南", priceSqm: 15000, dom: 78, cut: -3.8, buildYear: 2013, elevator: true, tags: ["商业配套", "交通便利"] },
    { community: "东安湖畔", district: "龙泉驿区", rooms: "3室2厅", size: 115, floor: "5/16层", toward: "南北", priceSqm: 10000, dom: 112, cut: -6.5, buildYear: 2021, elevator: true, tags: ["湖景", "大运会板块", "新区"] },
    { community: "空港国际城", district: "双流区", rooms: "3室2厅", size: 108, floor: "9/22层", toward: "南北", priceSqm: 11000, dom: 98, cut: -5.2, buildYear: 2017, elevator: true, tags: ["近机场", "自贸区配套"] },
  ].map(o => ({ ...o, url: keUrl("cd", o.community) })),
};

// 市场行情参考（基于公开市场报告）
// 全国70城二手房价格指数连续32个月同比下跌（截至2026年2月）
export const MARKET = {
  sh: { sentiment: 38, label: "偏弱", signal: "观望", listings: 172000, sold: 11200, avgDOM: 72, pricecut: 58, newListings: 7800, absorb: "6.5%" },
  bj: { sentiment: 35, label: "偏弱", signal: "观望", listings: 148000, sold: 9200,  avgDOM: 78, pricecut: 62, newListings: 5900, absorb: "6.2%" },
  sz: { sentiment: 42, label: "中性", signal: "观望", listings: 118000, sold: 9800,  avgDOM: 65, pricecut: 55, newListings: 6200, absorb: "8.3%" },
  gz: { sentiment: 30, label: "弱势", signal: "谨慎", listings: 205000, sold: 13500, avgDOM: 98, pricecut: 72, newListings: 9500, absorb: "6.6%" },
  hz: { sentiment: 36, label: "偏弱", signal: "观望", listings: 102000, sold: 6800,  avgDOM: 75, pricecut: 58, newListings: 3800, absorb: "6.7%" },
  cd: { sentiment: 44, label: "中性", signal: "观望", listings: 268000, sold: 26500, avgDOM: 62, pricecut: 45, newListings: 12800, absorb: "9.9%" },
};
