import { defineStore } from 'pinia';
import { getGwmpcwg } from '@/apis';

export const useGwmpcwg = defineStore('gwmpcwg', () => {
  async function loadGwmpcwg(domainCode: string) {
    try {
      return await getGwmpcwg({ domainCode });
    } catch (e) {
      console.warn('请求错误', e);
      return [];
    }
  }

  return {
    loadGwmpcwg,
  };
});
