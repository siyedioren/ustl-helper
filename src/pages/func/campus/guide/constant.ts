export enum Category {
  TEACHING = "教学楼",
  DORM = "宿舍",
  DINING = "食堂",
  SPORTS = "体育",
  OTHER = "其他",
}

export interface Building {
  id: number;
  name: string;
  category: Category;
  description: string;
  latitude: number;
  longitude: number;
  content?: string; // 建筑详情内容，支持多行
  busStops?: string[]; // 关联的公交站点名称
}

export interface BusSchedule {
  period: "高峰期" | "平峰期";
  startTime: string;
  endTime: string;
  line: string;
  route: string[];
}

export const DEFAULT_LATITUDE = 41.1097;
export const DEFAULT_LONGITUDE = 123.0675;

/** 自定义卫星图地理边界（根据 Excel 坐标范围+padding，匹配图片比例） */
export const MAP_BOUNDS = {
  north: 41.1146,
  south: 41.1047,
  west: 123.0566,
  east: 123.0783,
};

/** 经纬度 → 图片百分比坐标 */
export const latLonToPercent = (lat: number, lon: number) => ({
  x: ((lon - MAP_BOUNDS.west) / (MAP_BOUNDS.east - MAP_BOUNDS.west)) * 100,
  y: ((MAP_BOUNDS.north - lat) / (MAP_BOUNDS.north - MAP_BOUNDS.south)) * 100,
});

export const BUILDINGS: Building[] = [
  { id: 1, name: "龙源公寓G座", category: Category.DORM, description: "学生宿舍", latitude: 41.113248, longitude: 123.068458 },
  { id: 2, name: "龙源公寓H座", category: Category.DORM, description: "学生宿舍", latitude: 41.113032, longitude: 123.068001 },
  { id: 3, name: "龙源公寓M座", category: Category.DORM, description: "学生宿舍", latitude: 41.112818, longitude: 123.068895 },
  { id: 4, name: "龙源食堂", category: Category.DINING, description: "餐饮服务", latitude: 41.112657, longitude: 123.069216 },
  { id: 5, name: "龙源公寓A座", category: Category.DORM, description: "学生宿舍", latitude: 41.113231, longitude: 123.071004 },
  { id: 6, name: "龙源公寓F座", category: Category.DORM, description: "学生宿舍", latitude: 41.113163, longitude: 123.069020 },
  { id: 7, name: "龙源公寓B座", category: Category.DORM, description: "学生宿舍", latitude: 41.112981, longitude: 123.071620 },
  { id: 8, name: "龙源公寓C座", category: Category.DORM, description: "学生宿舍", latitude: 41.112756, longitude: 123.070987 },
  { id: 9, name: "龙源公寓D座", category: Category.DORM, description: "学生宿舍", latitude: 41.112491, longitude: 123.071497 },
  { id: 10, name: "龙源公寓E座", category: Category.DORM, description: "学生宿舍", latitude: 41.112302, longitude: 123.070834 },
  { id: 11, name: "龙源公寓2A座", category: Category.DORM, description: "学生宿舍", latitude: 41.113083, longitude: 123.072498 },
  { id: 12, name: "龙源公寓2B座", category: Category.DORM, description: "学生宿舍", latitude: 41.112807, longitude: 123.072964 },
  { id: 13, name: "龙源公寓2C座", category: Category.DORM, description: "学生宿舍", latitude: 41.112599, longitude: 123.072267 },
  { id: 14, name: "龙源公寓2D座", category: Category.DORM, description: "学生宿舍", latitude: 41.112346, longitude: 123.072891 },
  { id: 15, name: "龙源公寓2E座", category: Category.DORM, description: "学生宿舍", latitude: 41.112179, longitude: 123.072155 },
  { id: 16, name: "辽宁科技大学研究生教学楼", category: Category.TEACHING, description: "教学楼", latitude: 41.109872, longitude: 123.058251 },
  { id: 17, name: "辽宁科技大学3号宿舍楼", category: Category.DORM, description: "学生宿舍", latitude: 41.109205, longitude: 123.058744 },
  { id: 18, name: "春华居", category: Category.DORM, description: "学生宿舍", latitude: 41.108863, longitude: 123.058166 },
  { id: 19, name: "博远楼（29号楼）", category: Category.TEACHING, description: "教学楼", latitude: 41.109006, longitude: 123.058869 },
  { id: 20, name: "致远楼（13舍)", category: Category.DORM, description: "学生宿舍", latitude: 41.108389, longitude: 123.057962 },
  { id: 21, name: "15舍", category: Category.DORM, description: "学生宿舍", latitude: 41.108165, longitude: 123.058083 },
  { id: 22, name: "11舍", category: Category.DORM, description: "学生宿舍", latitude: 41.108244, longitude: 123.058699 },
  { id: 23, name: "辽宁科技大学研究生公寓", category: Category.DORM, description: "学生宿舍", latitude: 41.108165, longitude: 123.058083 },
  { id: 24, name: "莘园餐厅", category: Category.DINING, description: "餐饮服务", latitude: 41.109190, longitude: 123.059369 },
  { id: 25, name: "27舍", category: Category.DORM, description: "学生宿舍", latitude: 41.109055, longitude: 123.059540 },
  { id: 26, name: "29舍", category: Category.DORM, description: "学生宿舍", latitude: 41.108386, longitude: 123.059698 },
  { id: 27, name: "21舍", category: Category.DORM, description: "学生宿舍", latitude: 41.109203, longitude: 123.060216 },
  { id: 28, name: "23舍", category: Category.DORM, description: "学生宿舍", latitude: 41.108836, longitude: 123.060285 },
  { id: 29, name: "25舍", category: Category.DORM, description: "学生宿舍", latitude: 41.108457, longitude: 123.060383 },
  { id: 30, name: "西篮球场", category: Category.SPORTS, description: "体育场馆", latitude: 41.109709, longitude: 123.059656 },
  { id: 31, name: "训练馆（23号楼）", category: Category.SPORTS, description: "体育场馆", latitude: 41.108848, longitude: 123.061575 },
  { id: 32, name: "网球馆（25号楼）", category: Category.SPORTS, description: "体育场馆", latitude: 41.108259, longitude: 123.061010 },
  { id: 33, name: "蓝球馆", category: Category.SPORTS, description: "体育场馆", latitude: 41.108625, longitude: 123.062620 },
  { id: 34, name: "羽毛球馆（21号楼）", category: Category.SPORTS, description: "体育场馆", latitude: 41.109041, longitude: 123.062093 },
  { id: 35, name: "博闻楼（11号楼）电子与信息工程学院", category: Category.TEACHING, description: "教学楼", latitude: 41.109725, longitude: 123.062492 },
  { id: 36, name: "博艺楼（13号楼）", category: Category.TEACHING, description: "教学楼", latitude: 41.110769, longitude: 123.062161 },
  { id: 37, name: "博爱楼（9号楼 矿业工程学院）", category: Category.TEACHING, description: "教学楼", latitude: 41.110726, longitude: 123.063421 },
  { id: 38, name: "博彩楼（7号楼）", category: Category.TEACHING, description: "教学楼", latitude: 41.110844, longitude: 123.064258 },
  { id: 39, name: "思贤居（7舍）", category: Category.DORM, description: "学生宿舍", latitude: 41.110274, longitude: 123.064280 },
  { id: 40, name: "新建宿舍（天猫超市）", category: Category.DORM, description: "学生宿舍", latitude: 41.110020, longitude: 123.063890, busStops: ["天猫超市"] },
  { id: 41, name: "新建宿舍2", category: Category.DORM, description: "学生宿舍", latitude: 41.109494, longitude: 123.063713 },
  { id: 42, name: "体育中心", category: Category.SPORTS, description: "体育场馆", latitude: 41.108757, longitude: 123.063974, busStops: ["体育中心"] },
  { id: 43, name: "棒垒球场", category: Category.SPORTS, description: "体育场馆", latitude: 41.107889, longitude: 123.063861 },
  { id: 44, name: "弘毅居（5舍）", category: Category.DORM, description: "学生宿舍", latitude: 41.109408, longitude: 123.064517 },
  { id: 45, name: "知行居（3舍）", category: Category.DORM, description: "学生宿舍", latitude: 41.109574, longitude: 123.064688 },
  { id: 46, name: "逸兴居（1舍）", category: Category.DORM, description: "学生宿舍", latitude: 41.109989, longitude: 123.065063 },
  { id: 47, name: "桃园餐厅", category: Category.DINING, description: "餐饮服务", latitude: 41.110461, longitude: 123.065197 },
  { id: 48, name: "校医院", category: Category.OTHER, description: "校园设施", latitude: 41.110840, longitude: 123.065432, busStops: ["校医院"] },
  { id: 49, name: "主体育场", category: Category.SPORTS, description: "体育场馆", latitude: 41.107909, longitude: 123.065372 },
  { id: 50, name: "博学楼（1号楼)", category: Category.TEACHING, description: "教学楼", latitude: 41.110176, longitude: 123.067351, busStops: ["博学楼"] },
  { id: 51, name: "博识楼（5号楼 外国语学院 机算机与软件工程学院 经济与法律学院）", category: Category.TEACHING, description: "教学楼", latitude: 41.108741, longitude: 123.066651 },
  { id: 52, name: "博观楼（3号楼）", category: Category.TEACHING, description: "教学楼", latitude: 41.107985, longitude: 123.067499 },
  { id: 53, name: "明信楼（4号楼 机械工程与自动化学院 工商管理学院）", category: Category.TEACHING, description: "教学楼", latitude: 41.107679, longitude: 123.068960 },
  { id: 54, name: "明贤楼（6号楼 材料与冶金学院）", category: Category.TEACHING, description: "教学楼", latitude: 41.108205, longitude: 123.070352 },
  { id: 55, name: "辽宁科技大学图书馆", category: Category.OTHER, description: "校园设施", latitude: 41.108557, longitude: 123.068383, busStops: ["图书馆"] },
  { id: 56, name: "博雅广场", category: Category.OTHER, description: "校园设施", latitude: 41.109992, longitude: 123.068802, busStops: ["博雅广场"] },
  { id: 57, name: "明德楼（2号楼）", category: Category.TEACHING, description: "教学楼", latitude: 41.109632, longitude: 123.069816, busStops: ["明德楼"] },

  // 东侧新增建筑
  { id: 58, name: "东校门", category: Category.OTHER, description: "校园出入口", latitude: 41.110249, longitude: 123.073638 },
  { id: 59, name: "东体育场", category: Category.SPORTS, description: "体育场馆", latitude: 41.109137, longitude: 123.074340 },
  { id: 60, name: "东篮球场", category: Category.SPORTS, description: "体育场馆", latitude: 41.109679, longitude: 123.075939 },
  { id: 61, name: "12号楼校部校机关楼", category: Category.TEACHING, description: "教学楼", latitude: 41.109442, longitude: 123.072853 },
  { id: 62, name: "14号楼明睿楼", category: Category.TEACHING, description: "教学楼", latitude: 41.108900, longitude: 123.072758 },
  { id: 63, name: "16号楼特种实验楼", category: Category.TEACHING, description: "教学楼", latitude: 41.108005, longitude: 123.072111 },
  { id: 64, name: "18号楼绿茵餐厅", category: Category.DINING, description: "餐饮服务", latitude: 41.108124, longitude: 123.073444 },
  { id: 65, name: "20号楼煤化工实验室", category: Category.TEACHING, description: "教学楼", latitude: 41.108124, longitude: 123.073444 },
  { id: 66, name: "22号楼明远楼", category: Category.TEACHING, description: "教学楼", latitude: 41.109735, longitude: 123.076862 },
  { id: 67, name: "26号楼明礼楼", category: Category.TEACHING, description: "教学楼", latitude: 41.109122, longitude: 123.075490 },
  { id: 68, name: "28号楼分离技术中心", category: Category.TEACHING, description: "教学楼", latitude: 41.108893, longitude: 123.076504 },
  { id: 69, name: "30号楼纳米材料研究中心", category: Category.TEACHING, description: "教学楼", latitude: 41.108485, longitude: 123.075800 },
  { id: 70, name: "32号楼印刷厂", category: Category.OTHER, description: "校园设施", latitude: 41.107921, longitude: 123.076237 },
  { id: 71, name: "34号楼创新创业学院工程训练中心", category: Category.TEACHING, description: "教学楼", latitude: 41.107358, longitude: 123.076003 },
  { id: 72, name: "36号楼", category: Category.TEACHING, description: "教学楼", latitude: 41.107322, longitude: 123.073816 },
  { id: 73, name: "38号楼", category: Category.TEACHING, description: "教学楼", latitude: 41.107327, longitude: 123.074388 },
  { id: 74, name: "40号楼", category: Category.TEACHING, description: "教学楼", latitude: 41.106894, longitude: 123.074491 },
  { id: 75, name: "42号楼工程实训楼", category: Category.TEACHING, description: "教学楼", latitude: 41.106087, longitude: 123.074126 },
  { id: 76, name: "6号房", category: Category.OTHER, description: "校园设施", latitude: 41.107533, longitude: 123.073089 },
  { id: 77, name: "16号房土木结构实验室", category: Category.OTHER, description: "校园设施", latitude: 41.107885, longitude: 123.076707 },
  { id: 78, name: "18号房", category: Category.OTHER, description: "校园设施", latitude: 41.107891, longitude: 123.074314 },
  { id: 79, name: "20号房", category: Category.OTHER, description: "校园设施", latitude: 41.107800, longitude: 123.075118 },
  { id: 80, name: "危废暂存间", category: Category.OTHER, description: "校园设施", latitude: 41.107299, longitude: 123.073022 },
  { id: 81, name: "二舍勤学居", category: Category.DORM, description: "学生宿舍", latitude: 41.108299, longitude: 123.074427 },
  { id: 82, name: "四舍慎思居", category: Category.DORM, description: "学生宿舍", latitude: 41.108122, longitude: 123.075496 },
  { id: 83, name: "六舍明辨居", category: Category.DORM, description: "学生宿舍", latitude: 41.107909, longitude: 123.074282 },
  { id: 84, name: "八舍笃行居", category: Category.DORM, description: "学生宿舍", latitude: 41.107814, longitude: 123.075120 },
];

export const BUS_SCHEDULE: BusSchedule[] = [
  { period: "高峰期", startTime: "07:20", endTime: "08:10", line: "大环线", route: ["博智楼", "体育中心", "天猫超市", "博学楼", "图书馆", "明德楼", "绿茵餐厅", "东门", "明德楼", "图书馆", "博学楼", "天猫超市", "体育中心", "博智楼"] },
  { period: "高峰期", startTime: "09:20", endTime: "10:10", line: "大环线", route: ["博智楼", "体育中心", "天猫超市", "博学楼", "图书馆", "明德楼", "绿茵餐厅", "东门", "明德楼", "图书馆", "博学楼", "天猫超市", "体育中心", "博智楼"] },
  { period: "高峰期", startTime: "11:20", endTime: "12:00", line: "东环线", route: ["东门", "明德楼", "图书馆", "博学楼", "图书馆", "明德楼", "绿茵餐厅", "东门"] },
  { period: "高峰期", startTime: "13:10", endTime: "13:40", line: "东环线", route: ["东门", "明德楼", "图书馆", "博学楼", "图书馆", "明德楼", "绿茵餐厅", "东门"] },
  { period: "高峰期", startTime: "14:50", endTime: "15:25", line: "西环线", route: ["博智楼", "体育中心", "天猫超市", "博学楼", "图书馆", "明德楼", "图书馆", "博学楼", "天猫超市", "体育中心", "博智楼"] },
  { period: "高峰期", startTime: "16:35", endTime: "17:20", line: "西环线", route: ["博智楼", "体育中心", "天猫超市", "博学楼", "图书馆", "明德楼", "图书馆", "博学楼", "天猫超市", "体育中心", "博智楼"] },
  { period: "平峰期", startTime: "08:10", endTime: "09:20", line: "大环线 A", route: ["博智楼", "体育中心", "天猫超市", "博学楼", "图书馆", "明德楼", "绿茵餐厅", "印刷厂", "东门", "博雅广场", "校医院", "体育中心", "博智楼"] },
  { period: "平峰期", startTime: "10:10", endTime: "11:20", line: "大环线 B", route: ["东门", "博雅广场", "校医院", "体育中心", "博智楼", "体育中心", "天猫超市", "博学楼", "图书馆", "明德楼", "绿茵餐厅", "印刷厂", "东门"] },
  { period: "平峰期", startTime: "13:40", endTime: "14:50", line: "大环线", route: ["博智楼", "体育中心", "天猫超市", "博学楼", "图书馆", "明德楼", "绿茵餐厅", "印刷厂", "东门", "博雅广场", "校医院", "体育中心", "博智楼"] },
  { period: "平峰期", startTime: "15:25", endTime: "16:35", line: "大环线", route: ["东门", "博雅广场", "校医院", "体育中心", "博智楼", "体育中心", "天猫超市", "博学楼", "图书馆", "明德楼", "绿茵餐厅", "印刷厂", "东门"] },
];

export const BUS_LINES = ["大环线", "东环线", "西环线", "大环线 A", "大环线 B"];

/** 从教学楼名称中提取楼号，用于排序 */
const extractTeachingNumber = (name: string) => {
  const match = name.match(/(\d+)\s*号楼/);
  return match ? parseInt(match[1], 10) : Infinity;
};

/** 从宿舍名称中提取排序 key：龙源公寓最前，其次几舍几舍，最后其他 */
const extractDormSortKey = (name: string) => {
  const longyuanMatch = name.match(/龙源公寓(\d?)([A-Z])座/);
  if (longyuanMatch) {
    const prefix = longyuanMatch[1] || "0";
    const letter = longyuanMatch[2];
    return `0_${prefix}_${letter}`;
  }
  const sheMatch = name.match(/(\d+)\s*舍/);
  if (sheMatch) {
    return `1_${sheMatch[1].padStart(4, "0")}`;
  }
  return `2_${name}`;
};

/** 统一建筑排序：按类别分组，再按各自规则排序 */
const sortBuildings = (buildings: Building[]) => {
  const categoryOrder = [Category.TEACHING, Category.DORM, Category.DINING, Category.SPORTS, Category.OTHER];
  return [...buildings].sort((a, b) => {
    const orderA = categoryOrder.indexOf(a.category);
    const orderB = categoryOrder.indexOf(b.category);
    if (orderA !== orderB) return orderA - orderB;

    if (a.category === Category.TEACHING) {
      return extractTeachingNumber(a.name) - extractTeachingNumber(b.name);
    }
    if (a.category === Category.DORM) {
      const keyA = extractDormSortKey(a.name);
      const keyB = extractDormSortKey(b.name);
      return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
    }
    return a.name.localeCompare(b.name, "zh-CN");
  });
};

export const GUIDE_CONFIG = [
  { name: "全部", scale: 15, data: sortBuildings(BUILDINGS) },
  { name: "教学楼", scale: 16, data: sortBuildings(BUILDINGS.filter(b => b.category === Category.TEACHING)) },
  { name: "宿舍", scale: 16, data: sortBuildings(BUILDINGS.filter(b => b.category === Category.DORM)) },
  { name: "食堂", scale: 16, data: sortBuildings(BUILDINGS.filter(b => b.category === Category.DINING)) },
  { name: "体育", scale: 16, data: sortBuildings(BUILDINGS.filter(b => b.category === Category.SPORTS)) },
  { name: "其他", scale: 16, data: sortBuildings(BUILDINGS.filter(b => b.category === Category.OTHER)) },
];

export const categoryColor: Record<Category, string> = {
  [Category.TEACHING]: "#165DFF",
  [Category.DORM]: "#00B42A",
  [Category.DINING]: "#FF7D00",
  [Category.SPORTS]: "#F53F3F",
  [Category.OTHER]: "#86909C",
};

export const categoryLabel: Record<Category, string> = {
  [Category.TEACHING]: "教学楼",
  [Category.DORM]: "宿舍",
  [Category.DINING]: "食堂",
  [Category.SPORTS]: "体育",
  [Category.OTHER]: "其他",
};
