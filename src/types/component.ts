import type { ECharts } from 'echarts';

export interface EChartExpose {
  chart: ECharts;
}

export interface ParamChartData {
  xAxisData: string[];
  seriesData: number[];
}
