import { requestClient } from '@/utils/request';

export namespace Api {
  export interface CommonParams {
    domainCode: string;
  }

  export interface GwmpcwgResult {
    id: number;
    label: string;
    val: number;
    unit: string;
  }
}

export const getStatus = (params: Api.CommonParams) => {
  return requestClient.get<boolean>('/device/status', { params });
};

export const getGwmpcwg = (params: Api.CommonParams) => {
  return requestClient.get<Array<Api.GwmpcwgResult>>('/gwmpcwg', { params });
};
