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
