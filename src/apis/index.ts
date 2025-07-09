import { requestClient } from '@/utils/request';
import type { Api } from '@/types/api.ts';
import type { CurveForm, SqYbAliasForm } from '@/types/component.ts';

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
  return requestClient.post<Api.YbDetailResult[]>('/device/history/analysis', data);
};

export const exportYbDetail = (data: Api.YbDetailData) => {
  return requestClient.download('/device/history/analysis/export', data, {
    timeout: 5 * 60 * 1000,
  });
};

export const chart = (data: Api.ChartData) => {
  return requestClient.post<Array<Api.ChartResult>>('/device/chart', data);
};

export const top = (data: Api.ChartTopData) => {
  return requestClient.post<Array<Api.ChartTopResult>>('/device/top', data);
};

export const paramExport = (data: Api.ParamExportParams) => {
  return requestClient.download('/device/param/export', data, {
    timeout: 5 * 60 * 1000,
  });
};

export const querySqYbAlias = (params: Api.SqYbAliasParams) => {
  return requestClient.get<Array<Api.SqYbAliasDto>>('/device/sq/yb/alias', { params });
};

export const saveSqYbAlias = (form: SqYbAliasForm) => {
  return requestClient.post<boolean>('/device/sq/yb/alias', form);
};

export const curve = (form: CurveForm) => {
  return requestClient.post<Api.CurveDto>('/device/curve', form);
};
