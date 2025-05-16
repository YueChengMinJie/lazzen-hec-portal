import { defineStore } from 'pinia';
import { getGwmpcwg } from '@/apis';

export const useGwmpcwg = defineStore('gwmpcwg', () => {
  async function loadGwmpcwg(sn: string) {
    try {
      await getGwmpcwg({ sn });
    } catch (e) {
      console.warn('请求错误', e);
    }
  }

  return {
    loadGwmpcwg,
  };
});
