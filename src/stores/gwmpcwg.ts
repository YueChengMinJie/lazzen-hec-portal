import { defineStore } from 'pinia';

export const useGwmpcwg = defineStore('gwmpcwg', () => {
  async function loadGwmpcwg(sn: string) {
    console.log('zxj', sn);
    await Promise.resolve();
  }

  return {
    loadGwmpcwg,
  };
});
