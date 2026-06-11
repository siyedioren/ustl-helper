import type { CommonEventFunction, PickerSelectorProps } from "@tarojs/components";
import { Picker, Text, View } from "@tarojs/components";
import React, { useState } from "react";

import { Dot } from "@/components/dot";
import { Icon } from "@/components/icon";
import { Layout } from "@/components/layout";
import { cs } from "laser-utils";

import { TODAY, WEEK_HEADER } from "./constant";
import type { CalendarData, TermData } from "./constant";
import { TERMS } from "./constant";
import styles from "./index.module.scss";

const pad2 = (n: number) => String(n).padStart(2, "0");

const fmt = (date: Date, pattern: string): string => {
  return pattern
    .replace("yyyy", String(date.getFullYear()))
    .replace("MM", pad2(date.getMonth() + 1))
    .replace("dd", pad2(date.getDate()));
};

const diffDays = (a: Date, b: Date): number => {
  const t1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const t2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((t1 - t2) / (1000 * 60 * 60 * 24));
};

const parseDate = (str: string): Date => {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const getDefaultDateForTerm = (item: TermData): Date => {
  const now = parseDate(TODAY);
  const start = parseDate(item.startdata);
  const end = new Date(start.getTime());
  end.setDate(start.getDate() + item.weekcount * 7 - 1);
  end.setHours(0, 0, 0, 0);
  if (now.getTime() >= start.getTime() && now.getTime() <= end.getTime()) {
    return now;
  }
  return start;
};

export default function CalendarIndex() {
  const [range] = useState(TERMS.map(t => t.term));
  const [index, setIndex] = useState(0);
  const [data] = useState<TermData[]>(TERMS);
  const [loaded, setLoaded] = useState(false);
  const [curTerm, setCurTerm] = useState("");
  const [curMonth, setCurMonth] = useState("");
  const [curYear, setCurYear] = useState("");
  const [weekCount, setWeekCount] = useState(0);
  const [termStart, setTermStart] = useState("");
  const [vacationDiff, setVacationDiff] = useState(0);
  const [vacationStart, setVacationStart] = useState("");
  const [vacationStartWeek, setVacationStartWeek] = useState(0);
  const [calendar, setCalendar] = useState<CalendarData[][]>([]);

  React.useEffect(() => {
    onDatePickerChange(TERMS[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deployCalendar = (origin: Date, item: TermData) => {
    const deliver = new Date(origin.getTime());
    deliver.setDate(1);
    deliver.setHours(0, 0, 0, 0);

    let monthStartWeekDay = deliver.getDay();
    monthStartWeekDay = monthStartWeekDay === 0 ? 7 : monthStartWeekDay;

    setCurYear(String(deliver.getFullYear()));
    setCurMonth(pad2(deliver.getMonth() + 1));
    deliver.setDate(deliver.getDate() - (monthStartWeekDay - 1));
    deliver.setHours(0, 0, 0, 0);

    const termStartDate = parseDate(item.startdata);
    const originMonth = origin.getMonth();
    const result: CalendarData[][] = [];

    for (let i = 0; i < 6; ++i) {
      const inside: CalendarData[] = [];
      let week = 0;
      for (let k = 0; k < 7; ++k) {
        const dateStr = fmt(deliver, "yyyy-MM-dd");
        const day = deliver.getDate();

        if (k === 0) {
          week = diffDays(deliver, termStartDate) / 7 + 1;
          week = deliver.getTime() >= termStartDate.getTime() ? week : 0;
          inside.push({ day: week, type: -1 });
        }

        const cell: CalendarData = { day, type: 0 };
        if (dateStr === TODAY) cell.today = true;
        if (dateStr === item.startdata) cell.start = true;
        if (week === item.vacationstart && k === 0) cell.vacationStart = true;
        if (deliver.getMonth() === originMonth) cell.currentMonth = true;

        if (k === 5 || k === 6) {
          cell.type = 2;
          cell.vacation = true;
        } else if (week && week <= item.weekcount) {
          cell.type = 1;
          if (week >= item.vacationstart) {
            cell.type = 3;
            cell.vacation = true;
          }
        }

        inside.push(cell);
        deliver.setDate(deliver.getDate() + 1);
        deliver.setHours(0, 0, 0, 0);
      }
      result.push(inside);
    }

    setCalendar(result);
    setLoaded(true);
  };

  const onDatePickerChange = (item: TermData, originDate?: Date) => {
    setCurTerm(item.term);
    setWeekCount(item.weekcount);
    setTermStart(item.startdata);
    setVacationStartWeek(item.vacationstart);

    const start = parseDate(item.startdata);
    start.setDate(start.getDate() + (item.vacationstart - 1) * 7);
    start.setHours(0, 0, 0, 0);
    setVacationStart(fmt(start, "yyyy-MM-dd"));

    const now = parseDate(TODAY);
    setVacationDiff(diffDays(start, now));

    const targetDate = originDate || getDefaultDateForTerm(item);
    deployCalendar(targetDate, item);
  };

  const onPickerChange: CommonEventFunction<PickerSelectorProps.ChangeEventDetail> = e => {
    const i = e.detail.value as number;
    setIndex(i);
    const item = data[i];
    const target = getDefaultDateForTerm(item);
    onDatePickerChange(item, target);
  };

  const onSwitchMonth = (next: number) => {
    const date = parseDate(`${curYear}-${curMonth}-01`);
    date.setMonth(date.getMonth() + next);
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    deployCalendar(date, data[index]);
  };

  return (
    <React.Fragment>
      <Layout title="校历查询">
        <View className={styles.selector}>
          <View>请选择学期</View>
          <Picker value={index} range={range} className="a-link" onChange={onPickerChange}>
            <View>{range[index]}</View>
          </Picker>
        </View>
      </Layout>
      {loaded && (
        <React.Fragment>
          <Layout>
            <View className="y-center a-flex-space-between">
              <View className={cs("y-center", styles.overview)}>
                <Icon type="arrow-lift" onClick={() => onSwitchMonth(-1)}></Icon>
                <View className={cs(styles.current)}>
                  {curYear}年 {curMonth}月
                </View>
                <Icon type="arrow-right" onClick={() => onSwitchMonth(1)}></Icon>
              </View>
              <View className={cs("y-center", styles.opContainer)}>
                <View
                  className="y-center x-center"
                  style={{ background: "rgb(var(--blue-6))" }}
                  onClick={() => deployCalendar(parseDate(TODAY), data[index])}
                >
                  <Text style={{ color: "#fff", fontSize: 12 }}>今</Text>
                </View>
              </View>
            </View>
            <View>
              <View className={styles.line}>
                {WEEK_HEADER.map((item, key) => (
                  <View key={key}>{item}</View>
                ))}
              </View>
              {calendar.map((row, rowIndex) => (
                <View key={rowIndex} className={styles.line}>
                  {row.map((item, columnIndex) => (
                    <View
                      key={columnIndex}
                      className={cs(
                        styles.day,
                        item.vacation && styles.vacation,
                        item.currentMonth && styles.currentMonth,
                        item.type === -1 && styles.order
                      )}
                    >
                      <View
                        className={cs(
                          styles.num,
                          item.today && styles.today,
                          item.start && styles.start,
                          item.vacationStart && styles.vacationStart
                        )}
                      >
                        <Text>{String(item.day)}</Text>
                      </View>
                      {item.type === 1 && (
                        <Text className={styles.type}>教学</Text>
                      )}
                      {item.type === 2 && (
                        <Text className={styles.type}>周末</Text>
                      )}
                      {item.type === 3 && (
                        <Text className={styles.type}>假期</Text>
                      )}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </Layout>
          <Layout>
            <View className={cs("y-center", styles.footerBanner)}>
              <View style={{ width: "40%" }}>
                <Dot background="#3cb371"></Dot>
                <View className="text">学期:{curTerm}</View>
              </View>
              <View style={{ width: "24%" }}>
                <Dot background="#9f8bec"></Dot>
                <View className="text">周次:{weekCount}</View>
              </View>
              <View style={{ width: "36%" }}>
                <Dot background="#ff6347"></Dot>
                <View className="text">开学:{termStart}</View>
              </View>
            </View>
          </Layout>
          <Layout>
            <View className={cs("y-center", styles.footerBanner)}>
              <View style={{ width: "40%" }}>
                <Dot background="#3cb371"></Dot>
                <View className="text">假期:{vacationStart}</View>
              </View>
              <View style={{ width: "24%" }}>
                <Dot background="#9f8bec"></Dot>
                <View className="text">周次:{vacationStartWeek}</View>
              </View>
              <View style={{ width: "36%" }}>
                <Dot background="#ff6347"></Dot>
                <View className="text">距离:{vacationDiff}天</View>
              </View>
            </View>
          </Layout>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

CalendarIndex.onShareAppMessage = () => ({
  title: "了科校历",
  path: "/pages/func/campus/calendar/index",
});
CalendarIndex.onShareTimeline = () => void 0;
