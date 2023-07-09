export const calcAverage = (items: number[]) => {
  if (!items || items.length === 0) {
    return 0;
  }

  return items.reduce((sum, item) => sum + item) / items.length;
};
