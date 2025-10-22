import type { ChartData } from './types';

export const generateSampleData = (days: number = 100): ChartData[] => {
  const data: ChartData[] = [];
  let price = 45000; // Starting price
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // Generate random price movement
    const change = price * (Math.random() * 0.04 - 0.02); // 2% random movement
    price += change;

    const dailyHigh = price * (1 + Math.random() * 0.01);
    const dailyLow = price * (1 - Math.random() * 0.01);

    data.push({
      time: date.toISOString().split('T')[0],
      open: price - change,
      high: dailyHigh,
      low: dailyLow,
      close: price,
      volume: Math.floor(Math.random() * 1000000 + 500000),
    });
  }

  return data;
};