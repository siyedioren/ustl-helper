/** 合并 className，过滤掉 falsy 值 */
export const cs = (...classes: (string | undefined | false | null)[]): string => {
  return classes.filter(Boolean).join(" ");
};
