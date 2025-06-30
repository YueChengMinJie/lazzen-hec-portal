import type { ECharts } from 'echarts';

export interface EChartExpose {
  chart: ECharts;
}

export interface ParamChartData {
  xAxisData: string[];
  seriesData: number[];
}

export interface CurveChartData {
  legendData: string[];
  xAxisData: string[];
  seriesData: string[][];
}

export interface SqYbAliasForm {
  type: number;
  idx: string;
  name: string;
}

export interface CurveForm {
  domainCode: string;
  deviceType: string;
}
