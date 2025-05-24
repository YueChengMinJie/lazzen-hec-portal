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

  export interface YbData extends CommonParams {
    link?: boolean;
    waterDeviceName?: string;
  }

  export interface YbDetailData extends CommonParams, PageParams {
    startDate?: string;
    endDate?: string;
    id: string;
    dataEnum: string;
    forwardPointCode: string;
    reversePointCode?: string;
  }

  export interface YbDetailExportData extends CommonParams {
    startDate?: string;
    endDate?: string;
    id: string;
  }

  export interface CurrentDataResult {
    id: number;
    name: string;
    value: string | null | undefined;
    unit: string;
  }

  export interface YbResult {
    id: string;
    name: string;
    link: boolean;
    value: string;
    totalValue: string;
    momentPointCode: string;
    forwardPointCode: string;
    reversePointCode?: string;
  }

  export interface YbDetailResult {
    id: string;
    date: string;
    value: string;
  }
}
