import { defineStore } from 'pinia';
import { getCurrentData, paramExport } from '@/apis';
import dayjs from 'dayjs';
import type { Api } from '@/types/api.ts';
import fileDownload from 'js-file-download';

export const useJxtx = defineStore('jxtx', () => {
  const dataRef = ref<Array<Api.CurrentDataResult>>([]);

  async function loadJxtx(domainCode: string) {
    const data = await getCurrentData({ domainCode, deviceType: 'JXTX3' });
    dataRef.value = data;

    let filter = data.filter(item => item.name.indexOf('波形') === -1);
    filter = filter.reduce((acc, cur) => {
      if (cur.name.indexOf('高二字节') !== -1) {
        const otherName = cur.name.replace('高', '低');
        const otherItem = filter.find(item => item.name === otherName);
        cur.name = cur.name.substring(0, cur.name.indexOf('（'));
        const high = +(cur.value || '0');
        let low;
        if (otherItem) {
          low = +(otherItem.value || '0');
        } else {
          low = 0;
        }
        const t = (high << 16) | (low >>> 0);
        if (t) {
          cur.value = dayjs.unix(t).format('YYYY-MM-DD HH:mm:ss');
        } else {
          cur.value = '0';
        }
        acc.push(cur);
      } else if (cur.name.indexOf('低二字节') === -1) {
        acc.push(cur);
      }
      return acc;
    }, [] as Array<Api.CurrentDataResult>);

    const param = '分闸波形';
    const [x, y] = changeParam(param);

    return [filter, x, y];
  }

  function changeParam(param: string) {
    let filter2 = dataRef.value.filter(item => item.name.indexOf(param) !== -1);
    filter2 = filter2.sort();
    const x = [] as Array<string>;
    const y = [] as Array<number>;
    for (const f of filter2) {
      x.push(f.name.substring(f.name.indexOf(param) + 4));
      y.push(+(f.value || '0'));
    }
    return [x, y];
  }

  async function exportParam(domainCode: string, param: string) {
    const response = await paramExport({ domainCode, param });
    const { data: resData, headers } = response;
    const fileName = window.decodeURI(headers['content-disposition']?.split('=')[1] ?? 'export.xlsx');
    fileDownload(resData, fileName);
  }

  return {
    dataRef,
    loadJxtx,
    changeParam,
    exportParam,
  };
});
