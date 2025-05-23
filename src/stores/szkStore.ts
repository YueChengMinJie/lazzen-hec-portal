import { defineStore } from 'pinia';
import { exportSybPage, getSyb, getSybPage } from '@/apis';
import type { RangeValue } from '@/types';
import fileDownload from 'js-file-download';

export const useSzk = defineStore('szk', () => {
  async function loadList(domainCode: string, status: undefined | string, name: string) {
    if (status === undefined) {
      return await getSyb({ domainCode, waterDeviceName: name });
    } else {
      return await getSyb({ domainCode, link: status === '1', waterDeviceName: name });
    }
  }

  async function loadPage(
    current: number,
    pageSize: number,
    dateTimeRange: RangeValue | undefined,
    selectId: string,
    domainCode: string,
  ) {
    const data = {
      page: current,
      size: pageSize,
      startDate: '',
      endDate: '',
      id: selectId,
      domainCode,
    };
    setDateTimeRange(dateTimeRange, data);
    return await getSybPage(data);
  }

  function setDateTimeRange(dateTimeRange: RangeValue | undefined, data: any) {
    if (dateTimeRange?.length === 2) {
      data.startDate = (dateTimeRange[0] && dateTimeRange[0].format('YYYY-MM-DDTHH:mm:ss')) ?? '';
      data.endDate = (dateTimeRange[1] && dateTimeRange[1].format('YYYY-MM-DDTHH:mm:ss')) ?? '';
    }
  }

  async function exportPage(dateTimeRange: RangeValue | undefined, selectId: string, domainCode: string) {
    const data = {
      startDate: '',
      endDate: '',
      id: selectId,
      domainCode,
    };
    setDateTimeRange(dateTimeRange, data);
    const response = await exportSybPage(data);
    const { data: resData, headers } = response;
    const fileName = window.decodeURI(headers['content-disposition']?.split('=')[1] ?? 'export.xlsx');
    fileDownload(resData, fileName);
  }

  return {
    loadList,
    loadPage,
    exportPage,
  };
});
