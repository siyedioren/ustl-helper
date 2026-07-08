const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

// 管理员 openid（私有信息，提交前请删除真实值）
const ADMINS = [
  { openid: 'YOUR_OPENID_HERE' },
];

const ANNOUNCEMENTS = [
  {
    title: "新生来校路线指南",
    source: "运营团队",
    category: "通知",
    isTop: true,
    date: "2026-06-23",
    summary: "点击查看从鞍山火车站、鞍山西站到辽宁科技大学的公交路线与打车建议。",
    content: "新生报到期间，从鞍山火车站和鞍山西站均可乘坐公交到达学校东门，具体路线请点击查看。",
    url: "/pages/func/campus/freshman/pages/detail/index?id=5",
    type: "announcement",
  },
];

const EXAMS = [
  { name: '英语四六级（上半年）', month: 6, day: 14, sort: 1 },
  { name: '英语四六级（下半年）', month: 12, day: 14, sort: 2 },
  { name: '全国计算机等级考试', month: 9, day: 21, sort: 3 },
  { name: '考研初试', month: 12, day: 21, sort: 4 },
];

const BUILDINGS = [
{ id: 1, name: "龙源公寓G座", category: "其他", description: "校园建筑", latitude: 41.107618, longitude: 123.061842 },
  { id: 2, name: "龙源公寓H座", category: "其他", description: "校园建筑", latitude: 41.107402, longitude: 123.061385 },
  { id: 3, name: "龙源公寓M座", category: "其他", description: "校园建筑", latitude: 41.107187, longitude: 123.062279 },
  { id: 4, name: "龙源食堂", category: "其他", description: "校园建筑", latitude: 41.107025, longitude: 123.0626 },
  { id: 5, name: "龙源公寓A座", category: "其他", description: "校园建筑", latitude: 41.107592, longitude: 123.064391 },
  { id: 6, name: "龙源公寓F座", category: "其他", description: "校园建筑", latitude: 41.107531, longitude: 123.062405 },
  { id: 7, name: "龙源公寓B座", category: "其他", description: "校园建筑", latitude: 41.107339, longitude: 123.065008 },
  { id: 8, name: "龙源公寓C座", category: "其他", description: "校园建筑", latitude: 41.107117, longitude: 123.064374 },
  { id: 9, name: "龙源公寓D座", category: "其他", description: "校园建筑", latitude: 41.10685, longitude: 123.064884 },
  { id: 10, name: "龙源公寓E座", category: "其他", description: "校园建筑", latitude: 41.106664, longitude: 123.06422 },
  { id: 11, name: "龙源公寓2A座", category: "其他", description: "校园建筑", latitude: 41.107436, longitude: 123.065888 },
  { id: 12, name: "龙源公寓2B座", category: "其他", description: "校园建筑", latitude: 41.107157, longitude: 123.066354 },
  { id: 13, name: "龙源公寓2C座", category: "其他", description: "校园建筑", latitude: 41.106954, longitude: 123.065656 },
  { id: 14, name: "龙源公寓2D座", category: "其他", description: "校园建筑", latitude: 41.106697, longitude: 123.066281 },
  { id: 15, name: "龙源公寓2E座", category: "其他", description: "校园建筑", latitude: 41.106534, longitude: 123.065543 },
  { id: 16, name: "辽宁科技大学研究生教学楼", category: "其他", description: "校园建筑", latitude: 41.104209, longitude: 123.051643 },
  { id: 17, name: "辽宁科技大学3号宿舍楼", category: "其他", description: "校园建筑", latitude: 41.103545, longitude: 123.052134 },
  { id: 18, name: "春华居", category: "其他", description: "校园建筑", latitude: 41.103199, longitude: 123.051557 },
  { id: 19, name: "博远楼（29号楼）", category: "其他", description: "校园建筑", latitude: 41.103347, longitude: 123.052258 },
  { id: 20, name: "致远楼（13舍)", category: "其他", description: "校园建筑", latitude: 41.102723, longitude: 123.051353 },
  { id: 21, name: "15舍", category: "其他", description: "校园建筑", latitude: 41.1025, longitude: 123.051474 },
  { id: 22, name: "11舍", category: "其他", description: "校园建筑", latitude: 41.102584, longitude: 123.052088 },
  { id: 23, name: "辽宁科技大学研究生公寓", category: "其他", description: "校园建筑", latitude: 41.1025, longitude: 123.051474 },
  { id: 24, name: "莘园餐厅", category: "其他", description: "校园建筑", latitude: 41.103535, longitude: 123.052757 },
  { id: 25, name: "27舍", category: "其他", description: "校园建筑", latitude: 41.103401, longitude: 123.052928 },
  { id: 26, name: "29舍", category: "其他", description: "校园建筑", latitude: 41.102733, longitude: 123.053085 },
  { id: 27, name: "21舍", category: "其他", description: "校园建筑", latitude: 41.103553, longitude: 123.053602 },
  { id: 28, name: "23舍", category: "其他", description: "校园建筑", latitude: 41.103187, longitude: 123.053671 },
  { id: 29, name: "25舍", category: "其他", description: "校园建筑", latitude: 41.102808, longitude: 123.053768 },
  { id: 30, name: "西篮球场", category: "其他", description: "校园建筑", latitude: 41.104056, longitude: 123.053044 },
  { id: 31, name: "训练馆（23号楼）", category: "其他", description: "校园建筑", latitude: 41.103206, longitude: 123.054959 },
  { id: 32, name: "网球馆（25号楼）", category: "其他", description: "校园建筑", latitude: 41.102614, longitude: 123.054394 },
  { id: 33, name: "蓝球馆", category: "其他", description: "校园建筑", latitude: 41.102987, longitude: 123.056002 },
  { id: 34, name: "羽毛球馆（21号楼）", category: "其他", description: "校园建筑", latitude: 41.103401, longitude: 123.055476 },
  { id: 35, name: "博闻楼（11号楼）电子与信息工程学院", category: "其他", description: "校园建筑", latitude: 41.104087, longitude: 123.055875 },
  { id: 36, name: "博艺楼（13号楼）", category: "其他", description: "校园建筑", latitude: 41.10513, longitude: 123.055546 },
  { id: 37, name: "博爱楼（9号楼 矿业工程学院）", category: "其他", description: "校园建筑", latitude: 41.105092, longitude: 123.056804 },
  { id: 38, name: "博彩楼（7号楼）", category: "其他", description: "校园建筑", latitude: 41.105212, longitude: 123.05764 },
  { id: 39, name: "思贤居（7舍）", category: "其他", description: "校园建筑", latitude: 41.104642, longitude: 123.057662 },
  { id: 40, name: "新建宿舍（天猫超市）", category: "其他", description: "校园建筑", latitude: 41.104387, longitude: 123.057272 },
  { id: 41, name: "新建宿舍2", category: "其他", description: "校园建筑", latitude: 41.10386, longitude: 123.057094 },
  { id: 42, name: "体育中心", category: "其他", description: "校园建筑", latitude: 41.103124, longitude: 123.057354 },
  { id: 43, name: "棒垒球场", category: "其他", description: "校园建筑", latitude: 41.102255, longitude: 123.057241 },
  { id: 44, name: "弘毅居（5舍）", category: "其他", description: "校园建筑", latitude: 41.103776, longitude: 123.057898 },
  { id: 45, name: "知行居（3舍）", category: "其他", description: "校园建筑", latitude: 41.103943, longitude: 123.058069 },
  { id: 46, name: "逸兴居（1舍）", category: "其他", description: "校园建筑", latitude: 41.104358, longitude: 123.058444 },
  { id: 47, name: "桃园餐厅", category: "其他", description: "校园建筑", latitude: 41.104831, longitude: 123.058578 },
  { id: 48, name: "校医院", category: "其他", description: "校园建筑", latitude: 41.10521, longitude: 123.058814 },
  { id: 49, name: "主体育场", category: "其他", description: "校园建筑", latitude: 41.102278, longitude: 123.058751 },
  { id: 50, name: "博学楼（1号楼)", category: "其他", description: "校园建筑", latitude: 41.104546, longitude: 123.060732 },
  { id: 51, name: "博识楼（5号楼 外国语学院 机算机与软件工程学院 经济与法律学院）", category: "其他", description: "校园建筑", latitude: 41.103111, longitude: 123.06003 },
  { id: 52, name: "博观楼（3号楼）", category: "其他", description: "校园建筑", latitude: 41.102354, longitude: 123.060878 },
  { id: 53, name: "明信楼（4号楼 机械工程与自动化学院 工商管理学院）", category: "其他", description: "校园建筑", latitude: 41.102046, longitude: 123.062339 },
  { id: 54, name: "明贤楼（6号楼 材料与冶金学院）", category: "其他", description: "校园建筑", latitude: 41.102567, longitude: 123.063733 },
  { id: 55, name: "辽宁科技大学图书馆", category: "其他", description: "校园建筑", latitude: 41.102925, longitude: 123.061763 },
  { id: 56, name: "博雅广场", category: "其他", description: "校园建筑", latitude: 41.10436, longitude: 123.062184 },
  { id: 57, name: "明德楼（2号楼）", category: "其他", description: "校园建筑", latitude: 41.103997, longitude: 123.063198 },
  { id: 58, name: "东校门", category: "其他", description: "校园建筑", latitude: 41.104607, longitude: 123.067023 },
  { id: 59, name: "东体育场", category: "其他", description: "校园建筑", latitude: 41.103495, longitude: 123.067725 },
  { id: 60, name: "东篮球场", category: "其他", description: "校园建筑", latitude: 41.104037, longitude: 123.069324 },
  { id: 61, name: "12号楼校部校机关楼", category: "其他", description: "校园建筑", latitude: 41.1038, longitude: 123.066238 },
  { id: 62, name: "14号楼明睿楼", category: "其他", description: "校园建筑", latitude: 41.103258, longitude: 123.066143 },
  { id: 63, name: "16号楼特种实验楼", category: "其他", description: "校园建筑", latitude: 41.102363, longitude: 123.065496 },
  { id: 64, name: "18号楼绿茵餐厅", category: "其他", description: "校园建筑", latitude: 41.102482, longitude: 123.066829 },
  { id: 65, name: "20号楼煤化工实验室", category: "其他", description: "校园建筑", latitude: 41.102482, longitude: 123.066829 },
  { id: 66, name: "22号楼明远楼", category: "其他", description: "校园建筑", latitude: 41.104093, longitude: 123.070247 },
  { id: 67, name: "26号楼明礼楼", category: "其他", description: "校园建筑", latitude: 41.10348, longitude: 123.068875 },
  { id: 68, name: "28号楼分离技术中心", category: "其他", description: "校园建筑", latitude: 41.103251, longitude: 123.069889 },
  { id: 69, name: "30号楼纳米材料研究中心", category: "其他", description: "校园建筑", latitude: 41.102843, longitude: 123.069185 },
  { id: 70, name: "32号楼印刷厂", category: "其他", description: "校园建筑", latitude: 41.102279, longitude: 123.069622 },
  { id: 71, name: "34号楼创新创业学院工程训练中心", category: "其他", description: "校园建筑", latitude: 41.101716, longitude: 123.069388 },
  { id: 72, name: "36号楼", category: "其他", description: "校园建筑", latitude: 41.10168, longitude: 123.067201 },
  { id: 73, name: "38号楼", category: "其他", description: "校园建筑", latitude: 41.101685, longitude: 123.067773 },
  { id: 74, name: "40号楼", category: "其他", description: "校园建筑", latitude: 41.101252, longitude: 123.067876 },
  { id: 75, name: "42号楼工程实训楼", category: "其他", description: "校园建筑", latitude: 41.100445, longitude: 123.067511 },
  { id: 76, name: "6号房", category: "其他", description: "校园建筑", latitude: 41.101891, longitude: 123.066474 },
  { id: 77, name: "16号房土木结构实验室", category: "其他", description: "校园建筑", latitude: 41.102243, longitude: 123.070092 },
  { id: 78, name: "18号房", category: "其他", description: "校园建筑", latitude: 41.102249, longitude: 123.067699 },
  { id: 79, name: "20号房", category: "其他", description: "校园建筑", latitude: 41.102158, longitude: 123.068503 },
  { id: 80, name: "危废暂存间", category: "其他", description: "校园建筑", latitude: 41.101657, longitude: 123.066407 },
  { id: 81, name: "二舍勤学居", category: "其他", description: "校园建筑", latitude: 41.102657, longitude: 123.067812 },
  { id: 82, name: "四舍慎思居", category: "其他", description: "校园建筑", latitude: 41.10248, longitude: 123.068881 },
  { id: 83, name: "六舍明辨居", category: "其他", description: "校园建筑", latitude: 41.102267, longitude: 123.067667 },
  { id: 84, name: "八舍笃行居", category: "其他", description: "校园建筑", latitude: 41.102172, longitude: 123.068505 },
];

// 如需初始化轮播图或每日一句数据，请在这里补充真实内容
const SWIPER = [];
const DAILY_SENTENCE = [];

async function hasData(collection) {
  const { total } = await db.collection(collection).count();
  return total > 0;
}

async function batchAdd(collection, docs) {
  const tasks = docs.map((doc) =>
    db.collection(collection).add({ data: { ...doc, createTime: db.serverDate() } })
  );
  await Promise.all(tasks);
}

exports.main = async () => {
  const results = [];

  try {
    if (!(await hasData('posts'))) {
      await batchAdd('posts', ANNOUNCEMENTS);
      results.push('posts: imported');
    } else {
      results.push('posts: already has data');
    }

    if (!(await hasData('admins'))) {
      await batchAdd('admins', ADMINS);
      results.push('admins: imported');
    } else {
      results.push('admins: already has data');
    }

    if (!(await hasData('buildings'))) {
      await batchAdd('buildings', BUILDINGS);
      results.push('buildings: imported');
    } else {
      results.push('buildings: already has data');
    }

    if (!(await hasData('exams'))) {
      await batchAdd('exams', EXAMS);
      results.push('exams: imported');
    } else {
      results.push('exams: already has data');
    }

    if (SWIPER.length > 0) {
      if (!(await hasData('swiper'))) {
        await batchAdd('swiper', SWIPER);
        results.push('swiper: imported');
      } else {
        results.push('swiper: already has data');
      }
    } else {
      results.push('swiper: skipped');
    }

    if (DAILY_SENTENCE.length > 0) {
      if (!(await hasData('daily_sentence'))) {
        await batchAdd('daily_sentence', DAILY_SENTENCE);
        results.push('daily_sentence: imported');
      } else {
        results.push('daily_sentence: already has data');
      }
    } else {
      results.push('daily_sentence: skipped');
    }

    return { code: 0, data: results, message: 'success' };
  } catch (err) {
    return { code: -1, data: results, message: String(err) };
  }
};
