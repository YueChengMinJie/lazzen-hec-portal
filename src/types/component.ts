import type { ECharts } from 'echarts';
import type { Api } from '@/types/api.ts';

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

export interface AnalyseForm {
  dateType: number;
  domainCode: string;
  dataType: string;
  forwardPointCode: string;
  reversePointCode?: string;
}

export interface DetailData {
  open: boolean;
  selectItem: Api.YbFeResult;
  current: number;
  value1: string;
  unit1: string;
  text1: string;
  value2: string;
  unit2: string;
  text2: string;
  value3: string;
  unit3: string;
  text3: string;
}
