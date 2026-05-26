import { LocalStorage } from "@/utils/storage";

export type SentenceType = {
  image: string;
  note: string;
  content: string;
};

const CACHE_KEY = "DAILY_SENTENCE";

/** 本地每日金句库 */
const SENTENCES: SentenceType[] = [
  { content: "星光不问赶路人，时光不负有心人。", note: "—— 致每一个早起学习的你", image: "" },
  { content: "你背不下来的书，总有人能背下来。", note: "—— 那么不好意思，你想去的学校也只能别人去了", image: "" },
  { content: "种一棵树最好的时间是十年前，其次是现在。", note: "—— 任何时候开始都不晚", image: "" },
  { content: "没有醒不来的早晨，没有熬不过的迷茫。", note: "—— 只有不想追的梦想", image: "" },
  { content: "努力的意义，就是以后的日子里，放眼望去，全都是自己喜欢的人和事。", note: "—— 今日共勉", image: "" },
  { content: "图书馆的座位永远留给最早到的人。", note: "—— 辽科大图书馆", image: "" },
  { content: "不要假装努力，结果不会陪你演戏。", note: "—— 期末考试前的提醒", image: "" },
  { content: "耐得住寂寞，才守得住繁华。", note: "—— 考研路上", image: "" },
  { content: "那些看似不起波澜的日复一日，会在某天让你看到坚持的意义。", note: "—— 相信自己", image: "" },
  { content: "今天的你，是三年前你的决定；三年后的你，是今天你的决定。", note: "—— 珍惜当下", image: "" },
  { content: "路虽远，行则将至；事虽难，做则必成。", note: "—— 古语", image: "" },
  { content: "每一个优秀的人都有一段沉默的时光，那是付出了很多努力却得不到结果的日子。", note: "—— 我们把它叫做扎根", image: "" },
  { content: "当你觉得为时已晚的时候，恰恰是最早的时候。", note: "—— 哈佛校训", image: "" },
  { content: "生活原本沉闷，但跑起来就有风。", note: "—— 去操场跑两圈吧", image: "" },
  { content: "你的负担将变成礼物，你受的苦将照亮你的路。", note: "—— 泰戈尔", image: "" },
  { content: "优于别人并不高贵，真正的高贵是优于过去的自己。", note: "—— 海明威", image: "" },
  { content: "世界上只有一种真正的英雄主义，那就是认清生活的真相后依然热爱生活。", note: "—— 罗曼·罗兰", image: "" },
  { content: "既然选择了远方，便只顾风雨兼程。", note: "—— 汪国真", image: "" },
  { content: "少年不惧岁月长，彼方尚有荣光在。", note: "—— 致青春", image: "" },
  { content: "追风赶月莫停留，平芜尽处是春山。", note: "—— 古诗", image: "" },
  { content: "努力只能及格，拼命才能优秀。", note: "—— 期末冲刺", image: "" },
  { content: "乾坤未定，你我皆是黑马。", note: "—— 高考/考研", image: "" },
  { content: "将来的你，一定会感谢现在拼命的自己。", note: "—— 送给深夜复习的你", image: "" },
  { content: "别说读书苦，那是你看世界的路。", note: "—— 共勉", image: "" },
  { content: "不积跬步，无以至千里；不积小流，无以成江海。", note: "—— 荀子", image: "" },
  { content: "书山有路勤为径，学海无涯苦作舟。", note: "—— 韩愈", image: "" },
  { content: "千里之行，始于足下。", note: "—— 老子", image: "" },
  { content: "业精于勤，荒于嬉；行成于思，毁于随。", note: "—— 韩愈", image: "" },
  { content: "博学之，审问之，慎思之，明辨之，笃行之。", note: "—— 《礼记》", image: "" },
  { content: "纸上得来终觉浅，绝知此事要躬行。", note: "—— 陆游", image: "" },
  { content: "青春须早为，岂能长少年。", note: "—— 孟郊", image: "" },
  { content: "黑发不知勤学早，白首方悔读书迟。", note: "—— 颜真卿", image: "" },
  { content: "莫等闲，白了少年头，空悲切。", note: "—— 岳飞", image: "" },
  { content: "一万年太久，只争朝夕。", note: "—— 毛泽东", image: "" },
  { content: "天行健，君子以自强不息。", note: "—— 《周易》", image: "" },
  { content: "宝剑锋从磨砺出，梅花香自苦寒来。", note: "—— 古诗", image: "" },
  { content: "长风破浪会有时，直挂云帆济沧海。", note: "—— 李白", image: "" },
  { content: "千淘万漉虽辛苦，吹尽狂沙始到金。", note: "—— 刘禹锡", image: "" },
  { content: "山重水复疑无路，柳暗花明又一村。", note: "—— 陆游", image: "" },
  { content: "不经一番寒彻骨，怎得梅花扑鼻香。", note: "—— 黄蘖禅师", image: "" },
  { content: "志不强者智不达，言不信者行不果。", note: "—— 墨子", image: "" },
  { content: "锲而舍之，朽木不折；锲而不舍，金石可镂。", note: "—— 荀子", image: "" },
  { content: "知之者不如好之者，好之者不如乐之者。", note: "—— 孔子", image: "" },
  { content: "学而不思则罔，思而不学则殆。", note: "—— 孔子", image: "" },
  { content: "温故而知新，可以为师矣。", note: "—— 孔子", image: "" },
  { content: "三人行，必有我师焉。", note: "—— 孔子", image: "" },
  { content: "己所不欲，勿施于人。", note: "—— 孔子", image: "" },
  { content: "工欲善其事，必先利其器。", note: "—— 孔子", image: "" },
  { content: "道阻且长，行则将至。", note: "—— 《诗经》", image: "" },
  { content: "青春是一场大雨，即使感冒了，还盼望回头再淋一次。", note: "—— 致大学时光", image: "" },
  { content: "食堂的饭会吃腻，但图书馆的座位永远抢不到。", note: "—— 辽科大日常", image: "" },
  { content: "最慢的步伐不是跬步，而是徘徊；最快的脚步不是冲刺，而是坚持。", note: "—— 人民日报", image: "" },
  { content: "愿你以渺小启程，以伟大结束。", note: "—— BTS", image: "" },
  { content: "你要悄悄拔尖，然后惊艳所有人。", note: "—— 送给正在努力的你", image: "" },
  { content: "纵有疾风起，人生不言弃。", note: "—— 宫崎骏", image: "" },
  { content: "半山腰总是最挤的，你得去山顶看看。", note: "—— 加油", image: "" },
  { content: "所有的幸运，其实都是厚积薄发。", note: "—— 相信过程", image: "" },
  { content: "我们终将上岸，阳光万里。", note: "—— 致考研人", image: "" },
  { content: "那些杀不死你的，终将使你变得更强大。", note: "—— 尼采", image: "" },
  { content: "成功的路上并不拥挤，因为坚持的人不多。", note: "—— 再坚持一下", image: "" },
  { content: "你现在的态度，决定你十年后是人物还是废物。", note: "—— 警醒", image: "" },
  { content: "没有什么能信手拈来，你必须非常努力，才能看起来毫不费力。", note: "—— 朱广权", image: "" },
  { content: "抱怨身处黑暗，不如提灯前行。", note: "—— 刘同", image: "" },
  { content: "越努力，越幸运。", note: "—— 简单却真实", image: "" },
  { content: "别在最好的年纪，辜负了最好的自己。", note: "—— 早安", image: "" },
  { content: "你所热爱的，就是你的生活。", note: "—— 后浪", image: "" },
  { content: "愿中国青年都摆脱冷气，只是向上走。", note: "—— 鲁迅", image: "" },
  { content: "无穷的远方，无数的人们，都和我有关。", note: "—— 鲁迅", image: "" },
  { content: "真的猛士，敢于直面惨淡的人生。", note: "—— 鲁迅", image: "" },
  { content: "其实地上本没有路，走的人多了，也便成了路。", note: "—— 鲁迅", image: "" },
  { content: "时间就像海绵里的水，只要愿挤，总还是有的。", note: "—— 鲁迅", image: "" },
  { content: "不驰于空想，不骛于虚声。", note: "—— 李大钊", image: "" },
  { content: "以青春之我，创建青春之国家。", note: "—— 李大钊", image: "" },
  { content: "为中华之崛起而读书。", note: "—— 周恩来", image: "" },
  { content: "博学笃行，报效祖国。", note: "—— 辽科大风", image: "" },
  { content: "今天不想跑，所以才去跑。", note: "—— 村上春树", image: "" },
  { content: "你要忍，忍到春暖花开；你要走，走到灯火通明。", note: "—— 卢思浩", image: "" },
  { content: "愿你出走半生，归来仍是少年。", note: "—— 致毕业生", image: "" },
  { content: "人生没有白走的路，每一步都算数。", note: "—— 李宗盛", image: "" },
  { content: "Stay hungry, stay foolish.", note: "—— 乔布斯", image: "" },
  { content: "你的时间有限，不要为别人而活。", note: "—— 乔布斯", image: "" },
  { content: "求知若饥，虚心若愚。", note: "—— 乔布斯", image: "" },
  { content: "只有那些疯狂到以为自己能够改变世界的人，才能真正改变世界。", note: "—— 乔布斯", image: "" },
  { content: "昨夜西风凋碧树，独上高楼，望尽天涯路。", note: "—— 王国维·第一境界", image: "" },
  { content: "衣带渐宽终不悔，为伊消得人憔悴。", note: "—— 王国维·第二境界", image: "" },
  { content: "众里寻他千百度，蓦然回首，那人却在灯火阑珊处。", note: "—— 王国维·第三境界", image: "" },
  { content: "生活不是等待暴风雨过去，而是学会在雨中跳舞。", note: "——  Vivian Greene", image: "" },
  { content: "预测未来的最好方式就是去创造它。", note: "—— 亚伯拉罕·林肯", image: "" },
  { content: "不要因为走得太远，而忘记为什么出发。", note: "—— 纪伯伦", image: "" },
  { content: "如果你瞄准月亮，即使迷失也是落在星辰之间。", note: "—— 莱斯·布朗", image: "" },
];

/** 获取今日金句（按日期轮播，缓存一天） */
export const requestOneSentence = (): Promise<SentenceType | null> => {
  return LocalStorage.getPromise<SentenceType>(CACHE_KEY).then(cached => {
    if (cached) return cached;

    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const index = dayOfYear % SENTENCES.length;
    const sentence = SENTENCES[index];

    // 缓存到当天 24:00
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    LocalStorage.setPromise(CACHE_KEY, sentence, tomorrow);

    return sentence;
  });
};
