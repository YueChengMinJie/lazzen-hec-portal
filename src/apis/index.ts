import { requestClient } from '@/utils/request';
import type { Api } from '@/types/api.ts';

export const getStatus = (params: Api.CommonParams) => {
  return requestClient.get<boolean>('/device/status', { params });
};

export const getCurrentData = (params: Api.CommonParams) => {
  return requestClient.get<Array<Api.GwmpcwgResult>>('/device/current/data', { params });
};

export const getSyb = (data: Api.SybData) => {
  return requestClient.post<Array<Api.SybResult> | null>('/device/current/water', data);
};

export const getSybPage = (data: Api.SybPage) => {
  return requestClient.post<Api.PageResult<Api.SybPageResult> | null>('/device/history/analysis', data);
};

export const exportSybPage = (data: Api.SybPageExport) => {
  return requestClient.download('/device/history/analysis/export', data);
};
