import { defineStore } from 'pinia';
import { getCurrentData } from '@/apis';

export const useGwmpcwg = defineStore('gwmpcwg', () => {
  async function loadGwmpcwg(domainCode: string) {
    return await getCurrentData({ domainCode, deviceType: 'GWMPCW' });
  }

  return {
    loadGwmpcwg,
  };
});
