import { defineStore } from 'pinia';
import { getStatus } from '@/apis';

export const useDevice = defineStore('device', () => {
  async function loadStatus(domainCode: string) {
    return await getStatus({ domainCode });
  }

  return {
    loadStatus,
  };
});
