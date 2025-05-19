import { requestClient } from '@/utils/request';

export namespace Api {
  export interface CommonParams {
    domainCode: string;
    deviceType?: string;
  }

  export interface GwmpcwgResult {
    id: number;
    name: string;
    value: number;
    unit: string;
  }
}

export const getStatus = (params: Api.CommonParams) => {
  return requestClient.get<boolean>('/device/status', { params });
};

export const getCurrentData = (params: Api.CommonParams) => {
  return requestClient.get<Array<Api.GwmpcwgResult>>('/device/current/data', { params });
};
