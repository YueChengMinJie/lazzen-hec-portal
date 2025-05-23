import { defineStore } from 'pinia';
import { getSyb, getSybPage } from '@/apis';
import type { RangeValue } from '@/types';

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
    if (dateTimeRange?.length === 2) {
      data.startDate = (dateTimeRange[0] && dateTimeRange[0].format('YYYY-MM-DD  HH:mm:ss')) ?? '';
      data.endDate = (dateTimeRange[1] && dateTimeRange[1].format('YYYY-MM-DD  HH:mm:ss')) ?? '';
    }
    return await getSybPage(data);
  }

  return {
    loadList,
    loadPage,
  };
});
