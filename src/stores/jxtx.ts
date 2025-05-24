import { defineStore } from 'pinia';
import { getCurrentData } from '@/apis';

export const useJxtx = defineStore('jxtx', () => {
  async function loadJxtx(domainCode: string) {
    return await getCurrentData({ domainCode, deviceType: 'JXTX3' });
  }

  return {
    loadJxtx,
  };
});
