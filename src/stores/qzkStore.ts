import { defineStore } from 'pinia';
import { exportYbDetail, getQybList, getYbDetailPage, querySqYbAlias, saveSqYbAlias } from '@/apis';
import type { RangeValue } from '@/types';
import fileDownload from 'js-file-download';
import type { Api } from '@/types/api.ts';
import type { SqYbAliasForm } from '@/types/component.ts';

export const useQzk = defineStore('qzk', () => {
  async function loadList(domainCode: string, status: undefined | string, name: string) {
    if (status === undefined) {
      return await getQybList({ domainCode, steamDeviceName: name });
    } else {
      return await getQybList({ domainCode, link: status === '1', steamDeviceName: name });
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
      dataEnum: 'STEAM',
      forwardPointCode: selectItem.forwardPointCode,
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
      dataEnum: 'STEAM',
      forwardPointCode: selectItem.forwardPointCode,
    };
    setDateTimeRange(dateTimeRange, data);
    const response = await exportYbDetail(data);
    const { data: resData, headers } = response;
    const fileName = window.decodeURI(headers['content-disposition']?.split('=')[1] ?? 'export.xlsx');
    fileDownload(resData, fileName);
  }

  async function loadAlias() {
    return await querySqYbAlias({ type: 2 });
  }

  async function saveAlias(form: SqYbAliasForm) {
    return await saveSqYbAlias({ ...form, type: 2 });
  }

  return {
    loadList,
    loadPage,
    exportPage,
    loadAlias,
    saveAlias,
  };
});
