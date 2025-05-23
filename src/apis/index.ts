import { requestClient } from '@/utils/request';

export namespace Api {
  export interface CommonParams {
    domainCode: string;
    deviceType?: string;
  }

  export interface PageParams {
    page: number;
    size: number;
  }

  export interface PageResult<T> {
    records: Array<T>;
    total: number;
    size: number;
    current: number;
    pages: number;
  }

  export interface SybData extends CommonParams {
    link?: boolean;
    waterDeviceName?: string;
  }

  export interface SybPage extends CommonParams, PageParams {
    startDate?: string;
    endDate?: string;
    id: string;
  }

  export interface SybPageExport extends CommonParams {
    startDate?: string;
    endDate?: string;
    id: string;
  }

  export interface GwmpcwgResult {
    id: number;
    name: string;
    value: number;
    unit: string;
  }

  export interface SybResult {
    id: string;
    name: string;
    link: boolean;
    value: string;
    totalValue: string;
  }

  export interface SybPageResult {
    id: string;
    date: string;
    value: string;
  }
}

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
