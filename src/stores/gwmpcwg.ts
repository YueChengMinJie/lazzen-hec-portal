import { defineStore } from 'pinia';
import { curve, getCurrentData } from '@/apis';

export const useGwmpcwg = defineStore('gwmpcwg', () => {
  async function loadGwmpcwg(domainCode: string) {
    return await getCurrentData({ domainCode, deviceType: 'GWMPCW' });
  }

  async function loadCurve(domainCode: string) {
    return await curve({ domainCode, deviceType: 'GWMPCW' });
  }

  return {
    loadGwmpcwg,
    loadCurve,
  };
});
