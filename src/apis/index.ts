import { requestClient } from '@/utils/request';
import type { Api } from '@/types/api.ts';

export const getStatus = (params: Api.CommonParams) => {
  return requestClient.get<boolean>('/device/status', { params });
};

export const getCurrentData = (params: Api.CommonParams) => {
  return requestClient.get<Array<Api.CurrentDataResult>>('/device/current/data', { params });
};

export const getSybList = (data: Api.YbData) => {
  return requestClient.post<Array<Api.YbResult> | null>('/device/current/water', data);
};

export const getQybList = (data: Api.YbData) => {
  return requestClient.post<Array<Api.YbResult> | null>('/device/current/steam', data);
};

export const getYbDetailPage = (data: Api.YbDetailData) => {
  return requestClient.post<Api.PageResult<Api.YbDetailResult> | null>('/device/history/analysis', data);
};

export const exportYbDetail = (data: Api.YbDetailExportData) => {
  return requestClient.download('/device/history/analysis/export', data);
};

export const chart = (data: Api.ChartData) => {
  return requestClient.post<Array<Api.ChartResult>>('/device/chart', data);
};

export const top = (data: Api.ChartTopData) => {
  return requestClient.post<Array<Api.ChartTopResult>>('/device/top', data);
};
