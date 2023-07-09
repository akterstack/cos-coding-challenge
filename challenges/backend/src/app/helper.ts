export const calcAverage = (items: number[]) =>
  items.reduce((sum, item) => sum + item) / items.length;
