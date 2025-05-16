import { requestClient } from '@/utils/request';

export namespace Api {
  export interface GwmpcwgParams {
    sn: string;
  }

  export interface GwmpcwgResult {
    val1: number;
    unit1: string;
    val2: number;
    unit2: string;
    val3: number;
    unit3: string;
    val4: number;
    unit4: string;
    val5: number;
    unit5: string;
    val6: number;
    unit6: string;
  }
}

export const getGwmpcwg = (params: Api.GwmpcwgParams) => {
  return requestClient.get<Api.GwmpcwgResult>('/gwmpcwg', { params });
};
