import { defineStore } from 'pinia';
import { curve, getCurrentData } from '@/apis';

export const useDcybh = defineStore('dcybh', () => {
  async function loadDcybh(domainCode: string) {
    return await getCurrentData({ domainCode, deviceType: 'DCYMXBH' });
  }

  async function loadCurve(domainCode: string) {
    return await curve({ domainCode, deviceType: 'DCYMXBH' });
  }

  return {
    loadDcybh,
    loadCurve,
  };
});
