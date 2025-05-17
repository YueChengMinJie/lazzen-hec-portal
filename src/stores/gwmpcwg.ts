import { defineStore } from 'pinia';
import { getGwmpcwg } from '@/apis';

export const useGwmpcwg = defineStore('gwmpcwg', () => {
  async function loadGwmpcwg(domainCode: string) {
    return await getGwmpcwg({ domainCode });
  }

  return {
    loadGwmpcwg,
  };
});
