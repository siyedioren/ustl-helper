const pad2 = (n: number) => String(n).padStart(2, "0");
const d = new Date();

export const WEEK_HEADER = ["周", "一", "二", "三", "四", "五", "六", "日"];
export const TODAY = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

export const CALENDAR_TYPE: Record<string, string> = {
  "-1": "周次",
  "0": "--",
  "1": "教学",
  "2": "周末",
  "3": "假期",
};

export interface TermData {
  term: string;
  shortName: string;
  weekcount: number;
  startdata: string;
  vacationstart: number;
}

export interface CalendarData {
  day: number | string;
  today?: boolean;
  start?: boolean;
  vacation?: boolean;
  currentMonth?: boolean;
  vacationStart?: boolean;
  type: -1 | 0 | 1 | 2 | 3;
}

export const TERMS: TermData[] = [
  { term: "2025-2026学年第一学期", shortName: "第一学期", weekcount: 20, startdata: "2025-09-01", vacationstart: 19 },
  { term: "2025-2026学年第二学期", shortName: "第二学期", weekcount: 23, startdata: "2026-03-02", vacationstart: 18 },
];
