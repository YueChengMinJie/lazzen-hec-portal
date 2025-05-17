import { defineStore } from 'pinia';
import { getStatus } from '@/apis';

export const useDevice = defineStore('device', () => {
  async function loadStatus(domainCode: string) {
    try {
      return await getStatus({ domainCode });
    } catch (e) {
      console.warn('请求错误', e);
      return false;
    }
  }

  return {
    loadStatus,
  };
});
