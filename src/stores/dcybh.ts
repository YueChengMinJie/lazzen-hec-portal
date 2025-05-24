import { defineStore } from 'pinia';
import { getCurrentData } from '@/apis';

export const useDcybh = defineStore('dcybh', () => {
  async function loadDcybh(domainCode: string) {
    return await getCurrentData({ domainCode, deviceType: 'DCYMXBH' });
  }

  return {
    loadDcybh,
  };
});
