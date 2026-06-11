import type { BookType } from "@/pages/func/information/library/model";

export interface GlobalData {
  url: string;
  curTerm: string;
  curWeek: number;
  project: string;
  tmp: {
    book: BookType | null;
  };
}

export const GLOBAL_DATA: GlobalData = {
  url: "",
  curTerm: "",
  curWeek: 0,
  project: "了科小站",
  tmp: {
    book: null,
  },
};
