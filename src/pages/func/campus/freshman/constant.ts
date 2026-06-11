export interface Section {
  title: string;
  content: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  sections: Section[];
}

export const FRESHMAN_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "防偷防骗",
    icon: "gonggao",
    color: "#F53F3F",
    sections: [
      { title: "寝室推销", content: "（具体内容待补充）" },
      { title: "谨慎办卡", content: "（具体内容待补充）" },
      { title: "防盗提醒", content: "（具体内容待补充）" },
      { title: "强制消费", content: "（具体内容待补充）" },
      { title: "账号安全", content: "（具体内容待补充）" },
    ],
  },
  {
    id: 2,
    name: "军训须知",
    icon: "banner",
    color: "#165DFF",
    sections: [
      { title: "准备工作", content: "（具体内容待补充）" },
      { title: "着装要求", content: "（具体内容待补充）" },
      { title: "补充水分", content: "（具体内容待补充）" },
      { title: "注意防晒", content: "（具体内容待补充）" },
      { title: "身体不适", content: "（具体内容待补充）" },
    ],
  },
  {
    id: 3,
    name: "缴费指南",
    icon: "account",
    color: "#00B42A",
    sections: [
      { title: "饭卡充值", content: "（具体内容待补充）" },
      { title: "水卡办理", content: "（具体内容待补充）" },
      { title: "水卡充值", content: "（具体内容待补充）" },
      { title: "电费充值", content: "（具体内容待补充）" },
      { title: "公交卡", content: "（具体内容待补充）" },
    ],
  },
  {
    id: 4,
    name: "校园生活",
    icon: "vacation",
    color: "#FF7D00",
    sections: [
      { title: "食堂", content: "（具体内容待补充）" },
      { title: "快递", content: "（具体内容待补充）" },
      { title: "网络", content: "（具体内容待补充）" },
      { title: "洗浴", content: "（具体内容待补充）" },
      { title: "就医", content: "（具体内容待补充）" },
    ],
  },
  {
    id: 5,
    name: "报到流程",
    icon: "schedule",
    color: "#9F8BEC",
    sections: [
      { title: "报到前准备", content: "（具体内容待补充）" },
      { title: "报到当天", content: "（具体内容待补充）" },
      { title: "入住宿舍", content: "（具体内容待补充）" },
      { title: "领取物品", content: "（具体内容待补充）" },
      { title: "银行卡", content: "（具体内容待补充）" },
    ],
  },
];

export const getCategoryById = (id: number): Category | undefined =>
  FRESHMAN_CATEGORIES.find(c => c.id === id);
