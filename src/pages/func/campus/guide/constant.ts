/** 卫星地图背景图 URL，支持 cloud://fileID 或 https:// 链接，上传后替换 */
export const MAP_BG_URL = "";

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
  /** 在地图占位图上的横向百分比坐标（0-100） */
  x: number;
  /** 在地图占位图上的纵向百分比坐标（0-100） */
  y: number;
  latitude: number;
  longitude: number;
}

export const BUILDINGS: Building[] = [
  { id: 1, name: "龙源公寓G座", category: Category.DORM, description: "学生宿舍", x: 68.4, y: 2.2, latitude: 41.107618, longitude: 123.061842 },
  { id: 2, name: "龙源公寓H座", category: Category.DORM, description: "学生宿舍", x: 66.9, y: 4.0, latitude: 41.107402, longitude: 123.061385 },
  { id: 3, name: "龙源公寓M座", category: Category.DORM, description: "学生宿舍", x: 69.7, y: 5.8, latitude: 41.107187, longitude: 123.062279 },
  { id: 4, name: "龙源食堂", category: Category.DINING, description: "餐饮服务", x: 70.7, y: 7.1, latitude: 41.107025, longitude: 123.0626 },
  { id: 5, name: "龙源公寓A座", category: Category.DORM, description: "学生宿舍", x: 76.3, y: 2.4, latitude: 41.107592, longitude: 123.064391 },
  { id: 6, name: "龙源公寓F座", category: Category.DORM, description: "学生宿舍", x: 70.1, y: 2.9, latitude: 41.107531, longitude: 123.062405 },
  { id: 7, name: "龙源公寓B座", category: Category.DORM, description: "学生宿舍", x: 78.3, y: 4.5, latitude: 41.107339, longitude: 123.065008 },
  { id: 8, name: "龙源公寓C座", category: Category.DORM, description: "学生宿舍", x: 76.3, y: 6.3, latitude: 41.107117, longitude: 123.064374 },
  { id: 9, name: "龙源公寓D座", category: Category.DORM, description: "学生宿舍", x: 77.9, y: 8.6, latitude: 41.10685, longitude: 123.064884 },
  { id: 10, name: "龙源公寓E座", category: Category.DORM, description: "学生宿舍", x: 75.8, y: 10.1, latitude: 41.106664, longitude: 123.06422 },
  { id: 11, name: "龙源公寓2A座", category: Category.DORM, description: "学生宿舍", x: 81.0, y: 3.7, latitude: 41.107436, longitude: 123.065888 },
  { id: 12, name: "龙源公寓2B座", category: Category.DORM, description: "学生宿舍", x: 82.5, y: 6.0, latitude: 41.107157, longitude: 123.066354 },
  { id: 13, name: "龙源公寓2C座", category: Category.DORM, description: "学生宿舍", x: 80.3, y: 7.7, latitude: 41.106954, longitude: 123.065656 },
  { id: 14, name: "龙源公寓2D座", category: Category.DORM, description: "学生宿舍", x: 82.3, y: 9.8, latitude: 41.106697, longitude: 123.066281 },
  { id: 15, name: "龙源公寓2E座", category: Category.DORM, description: "学生宿舍", x: 79.9, y: 11.2, latitude: 41.106534, longitude: 123.065543 },
  { id: 16, name: "辽宁科技大学研究生教学楼", category: Category.TEACHING, description: "教学楼", x: 36.5, y: 30.6, latitude: 41.104209, longitude: 123.051643 },
  { id: 17, name: "辽宁科技大学3号宿舍楼", category: Category.DORM, description: "学生宿舍", x: 38.0, y: 36.2, latitude: 41.103545, longitude: 123.052134 },
  { id: 18, name: "春华居", category: Category.DORM, description: "学生宿舍", x: 36.2, y: 39.1, latitude: 41.103199, longitude: 123.051557 },
  { id: 19, name: "博远楼（29号楼）", category: Category.TEACHING, description: "教学楼", x: 38.4, y: 37.8, latitude: 41.103347, longitude: 123.052258 },
  { id: 20, name: "致远楼（13舍)", category: Category.DORM, description: "学生宿舍", x: 35.6, y: 43.1, latitude: 41.102723, longitude: 123.051353 },
  { id: 21, name: "15舍", category: Category.DORM, description: "学生宿舍", x: 35.9, y: 44.9, latitude: 41.1025, longitude: 123.051474 },
  { id: 22, name: "11舍", category: Category.DORM, description: "学生宿舍", x: 37.9, y: 44.2, latitude: 41.102584, longitude: 123.052088 },
  { id: 23, name: "辽宁科技大学研究生公寓", category: Category.DORM, description: "学生宿舍", x: 35.9, y: 44.9, latitude: 41.1025, longitude: 123.051474 },
  { id: 24, name: "莘园餐厅", category: Category.DINING, description: "餐饮服务", x: 40.0, y: 36.3, latitude: 41.103535, longitude: 123.052757 },
  { id: 25, name: "27舍", category: Category.DORM, description: "学生宿舍", x: 40.5, y: 37.4, latitude: 41.103401, longitude: 123.052928 },
  { id: 26, name: "29舍", category: Category.DORM, description: "学生宿舍", x: 41.0, y: 43.0, latitude: 41.102733, longitude: 123.053085 },
  { id: 27, name: "21舍", category: Category.DORM, description: "学生宿舍", x: 42.6, y: 36.1, latitude: 41.103553, longitude: 123.053602 },
  { id: 28, name: "23舍", category: Category.DORM, description: "学生宿舍", x: 42.8, y: 39.2, latitude: 41.103187, longitude: 123.053671 },
  { id: 29, name: "25舍", category: Category.DORM, description: "学生宿舍", x: 43.1, y: 42.4, latitude: 41.102808, longitude: 123.053768 },
  { id: 30, name: "西篮球场", category: Category.SPORTS, description: "体育场馆", x: 40.9, y: 31.9, latitude: 41.104056, longitude: 123.053044 },
  { id: 31, name: "训练馆（23号楼）", category: Category.SPORTS, description: "体育场馆", x: 46.8, y: 39.0, latitude: 41.103206, longitude: 123.054959 },
  { id: 32, name: "网球馆（25号楼）", category: Category.SPORTS, description: "体育场馆", x: 45.1, y: 44.0, latitude: 41.102614, longitude: 123.054394 },
  { id: 33, name: "蓝球馆", category: Category.SPORTS, description: "体育场馆", x: 50.1, y: 40.9, latitude: 41.102987, longitude: 123.056002 },
  { id: 34, name: "羽毛球馆（21号楼）", category: Category.SPORTS, description: "体育场馆", x: 48.5, y: 37.4, latitude: 41.103401, longitude: 123.055476 },
  { id: 35, name: "博闻楼（11号楼）电子与信息工程学院", category: Category.TEACHING, description: "教学楼", x: 49.7, y: 31.7, latitude: 41.104087, longitude: 123.055875 },
  { id: 36, name: "博艺楼（13号楼）", category: Category.TEACHING, description: "教学楼", x: 48.7, y: 22.9, latitude: 41.10513, longitude: 123.055546 },
  { id: 37, name: "博爱楼（9号楼 矿业工程学院）", category: Category.TEACHING, description: "教学楼", x: 52.6, y: 23.3, latitude: 41.105092, longitude: 123.056804 },
  { id: 38, name: "博彩楼（7号楼）", category: Category.TEACHING, description: "教学楼", x: 55.2, y: 22.3, latitude: 41.105212, longitude: 123.05764 },
  { id: 39, name: "思贤居（7舍）", category: Category.DORM, description: "学生宿舍", x: 55.3, y: 27.0, latitude: 41.104642, longitude: 123.057662 },
  { id: 40, name: "新建宿舍（天猫超市）", category: Category.DORM, description: "学生宿舍", x: 54.1, y: 29.2, latitude: 41.104387, longitude: 123.057272 },
  { id: 41, name: "新建宿舍2", category: Category.DORM, description: "学生宿舍", x: 53.5, y: 33.6, latitude: 41.10386, longitude: 123.057094 },
  { id: 42, name: "体育中心", category: Category.SPORTS, description: "体育场馆", x: 54.3, y: 39.7, latitude: 41.103124, longitude: 123.057354 },
  { id: 43, name: "棒垒球场", category: Category.SPORTS, description: "体育场馆", x: 54.0, y: 47.0, latitude: 41.102255, longitude: 123.057241 },
  { id: 44, name: "弘毅居（5舍）", category: Category.DORM, description: "学生宿舍", x: 56.0, y: 34.3, latitude: 41.103776, longitude: 123.057898 },
  { id: 45, name: "知行居（3舍）", category: Category.DORM, description: "学生宿舍", x: 56.6, y: 32.9, latitude: 41.103943, longitude: 123.058069 },
  { id: 46, name: "逸兴居（1舍）", category: Category.DORM, description: "学生宿舍", x: 57.7, y: 29.4, latitude: 41.104358, longitude: 123.058444 },
  { id: 47, name: "桃园餐厅", category: Category.DINING, description: "餐饮服务", x: 58.2, y: 25.4, latitude: 41.104831, longitude: 123.058578 },
  { id: 48, name: "校医院", category: Category.OTHER, description: "校园设施", x: 58.9, y: 22.3, latitude: 41.10521, longitude: 123.058814 },
  { id: 49, name: "主体育场", category: Category.SPORTS, description: "体育场馆", x: 58.7, y: 46.8, latitude: 41.102278, longitude: 123.058751 },
  { id: 50, name: "博学楼（1号楼)", category: Category.TEACHING, description: "教学楼", x: 64.9, y: 27.8, latitude: 41.104546, longitude: 123.060732 },
  { id: 51, name: "博识楼（5号楼 外国语学院 机算机与软件工程学院 经济与法律学院）", category: Category.TEACHING, description: "教学楼", x: 62.7, y: 39.8, latitude: 41.103111, longitude: 123.06003 },
  { id: 52, name: "博观楼（3号楼）", category: Category.TEACHING, description: "教学楼", x: 65.4, y: 46.1, latitude: 41.102354, longitude: 123.060878 },
  { id: 53, name: "明信楼（4号楼 机械工程与自动化学院 工商管理学院）", category: Category.TEACHING, description: "教学楼", x: 69.9, y: 48.7, latitude: 41.102046, longitude: 123.062339 },
  { id: 54, name: "明贤楼（6号楼 材料与冶金学院）", category: Category.TEACHING, description: "教学楼", x: 74.3, y: 44.4, latitude: 41.102567, longitude: 123.063733 },
  { id: 55, name: "辽宁科技大学图书馆", category: Category.OTHER, description: "校园设施", x: 68.1, y: 41.4, latitude: 41.102925, longitude: 123.061763 },
  { id: 56, name: "博雅广场", category: Category.OTHER, description: "校园设施", x: 69.4, y: 29.4, latitude: 41.10436, longitude: 123.062184 },
  { id: 57, name: "明德楼（2号楼）", category: Category.TEACHING, description: "教学楼", x: 72.6, y: 32.4, latitude: 41.103997, longitude: 123.063198 },
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
