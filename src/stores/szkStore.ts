import { defineStore } from 'pinia';
import { exportYbDetail, getSybList, getYbDetailPage, querySqYbAlias, saveSqYbAlias } from '@/apis';
import type { RangeValue } from '@/types';
import fileDownload from 'js-file-download';
import type { Api } from '@/types/api.ts';
import type { SqYbAliasForm } from '@/types/component.ts';

export const useSzk = defineStore('szk', () => {
  async function loadList(domainCode: string, status: undefined | string, name: string) {
    if (status === undefined) {
      return await getSybList({ domainCode, waterDeviceName: name });
    } else {
      return await getSybList({ domainCode, link: status === '1', waterDeviceName: name });
    }
  }

  async function loadPage(
    current: number,
    pageSize: number,
    dateTimeRange: RangeValue | undefined,
    selectId: string,
    domainCode: string,
    selectItem: Api.YbResult,
  ) {
    const data = {
      page: current,
      size: pageSize,
      startDate: '',
      endDate: '',
      id: selectId,
      domainCode,
      dataEnum: 'WATER',
      forwardPointCode: selectItem.forwardPointCode,
      reversePointCode: selectItem.reversePointCode,
    };
    setDateTimeRange(dateTimeRange, data);
    return await getYbDetailPage(data);
  }

  function setDateTimeRange(dateTimeRange: RangeValue | undefined, data: any) {
    if (dateTimeRange?.length === 2) {
      data.startDate = dateTimeRange[0].format('YYYY-MM-DDTHH:mm:ss') ?? '';
      data.endDate = dateTimeRange[1].format('YYYY-MM-DDTHH:mm:ss') ?? '';
    }
  }

  async function exportPage(
    dateTimeRange: RangeValue | undefined,
    selectId: string,
    domainCode: string,
    selectItem: Api.YbResult,
  ) {
    const data = {
      startDate: '',
      endDate: '',
      id: selectId,
      domainCode,
      dataEnum: 'WATER',
      forwardPointCode: selectItem.forwardPointCode,
      reversePointCode: selectItem.reversePointCode,
    };
    setDateTimeRange(dateTimeRange, data);
    const response = await exportYbDetail(data);
    const { data: resData, headers } = response;
    const fileName = window.decodeURI(headers['content-disposition']?.split('=')[1] ?? 'export.xlsx');
    fileDownload(resData, fileName);
  }

  async function loadAlias() {
    return await querySqYbAlias({ type: 1 });
  }

  async function saveAlias(form: SqYbAliasForm) {
    return await saveSqYbAlias({ ...form, type: 1 });
  }

  return {
    loadList,
    loadPage,
    exportPage,
    loadAlias,
    saveAlias,
  };
});
