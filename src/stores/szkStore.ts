import { defineStore } from 'pinia';
import { getSyb } from '@/apis';

export const useSzk = defineStore('gwmpcwg', () => {
  async function loadList(domainCode: string, status: undefined | string, name: string) {
    if (status === undefined) {
      return await getSyb({ domainCode, waterDeviceName: name });
    } else {
      return await getSyb({ domainCode, link: status === '1', waterDeviceName: name });
    }
  }

  return {
    loadList,
  };
});
