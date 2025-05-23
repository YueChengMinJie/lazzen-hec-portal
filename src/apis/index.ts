import { requestClient } from '@/utils/request';

export namespace Api {
  export interface CommonParams {
    domainCode: string;
    deviceType?: string;
  }

  export interface SybData extends CommonParams {
    link?: boolean;
    waterDeviceName?: string;
  }

  export interface GwmpcwgResult {
    id: number;
    name: string;
    value: number;
    unit: string;
  }

  export interface SybResult {
    name?: string;
    link?: boolean;
    value?: string;
    totalValue?: string;
    forwardPointCode?: string;
    momentPointCode?: string;
    reversePointCode?: string;
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
