<script setup lang="ts">
  import type { Api } from '@/types/api';

  import Jxtx1 from '@/assets/svg/jxtx1.svg?component';
  import Jxtx2 from '@/assets/svg/jxtx2.svg?component';
  import Jxtx3 from '@/assets/svg/jxtx3.svg?component';
  import Jxtx4 from '@/assets/svg/jxtx4.svg?component';
  import { useData, useDomainCode } from '@/utils/hook.ts';
  import { useJxtx } from '@/stores/jxtx.ts';

  const jxtxStore = useJxtx();
  const domainCode = useDomainCode();
  const { pause } = useData(domainCode, loadData);

  const headers = ref<Array<Api.CurrentDataResult>>([]);

  async function loadData() {
    if (domainCode) {
      try {
        const [data1] = await Promise.all([jxtxStore.loadJxtx(domainCode)]);
        headers.value = data1;
        return true;
      } catch (e) {
        console.error('请求错误', e);
        pause();
        return false;
      }
    }
    return false;
  }

  const filterVal = (idx: number, val: string | null | undefined) => {
    if (idx === 0) {
      return val ? `${val}A` : '';
    } else if (idx === 1) {
      return val === '0' ? '已储能' : '未储能';
    } else if (idx === 2 || idx === 5) {
      if (val === '0') {
        return '分闸';
      } else if (val === '1') {
        return '合闸';
      } else if (val === '2') {
        return '分闸中';
      } else if (val === '3') {
        return '合闸中';
      } else if (val === '4') {
        return '中间位置';
      } else if (val === '5') {
        return '操作过程中';
      } else {
        return '待机';
      }
    } else if (idx === 4) {
      if (val === '0') {
        return '试验位';
      } else if (val === '1') {
        return '工作位';
      } else if (val === '2') {
        return '出车中';
      } else if (val === '3') {
        return '进车中';
      } else if (val === '4') {
        return '中间位置';
      } else if (val === '5') {
        return '操作过程中';
      } else {
        return '待机';
      }
    }
    return val;
  };
</script>

<template>
  <div class="p-8 h-screen flex flex-col">
    <div class="border border-[var(--color-border)] bg-[var(--bg-color)] h-[340px] p-8 flex flex-row gap-[9px]">
      <div class="h-full">
        <div class="right-top"> 机械特性 </div>
        <div class="ml-[15px]">
          <div class="right-middle">参数</div>
          <div class="pt-[10px] flex flex-row flex-wrap right-bottom">
            <div
              v-for="(item, idx) in headers"
              :key="item.id"
              class="w-[33%] px-[14px] py-[18px] flex flex-row gap-[16px] right-bottom-child"
            >
              <div class="flex justify-center items-center">
                <Jxtx1 v-if="idx === 0" />
                <Jxtx2 v-else-if="idx === 1" />
                <Jxtx3 v-else-if="idx === 2" />
                <Jxtx4 v-else />
              </div>
              <div class="flex flex-col">
                <div class="value">{{ filterVal(idx, item.value) }}</div>
                <div>{{ item.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="mt-8 p-8 border border-[var(--color-border)] bg-[var(--bg-color)] flex-1 flex justify-center items-center"
    >
      <div class="text-[#8F8F92]">暂无数据</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .right-top {
    margin-left: 15px;
    padding: 5px 15px 19px 0;
    font-size: 24px;
    font-weight: 600;
    line-height: 34px;
    color: var(--color-heading);
    border-bottom: 1px solid var(--color-border);
  }

  .right-middle {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-heading);
    padding-bottom: 16px;
    padding-top: 14px;
  }

  .value {
    font-size: 16px;
    color: var(--color-heading);
    font-weight: 600;
  }

  .right-bottom {
    .right-bottom-child:nth-child(2) {
      border-left: 1px solid var(--color-border);
    }

    .right-bottom-child:nth-child(3) {
      border-left: 1px solid var(--color-border);
    }

    .right-bottom-child:nth-child(4) {
      border-top: 1px solid var(--color-border);
    }

    .right-bottom-child:nth-child(5) {
      border-top: 1px solid var(--color-border);
      border-left: 1px solid var(--color-border);
    }

    .right-bottom-child:nth-child(6) {
      border-top: 1px solid var(--color-border);
      border-left: 1px solid var(--color-border);
    }
  }
</style>
