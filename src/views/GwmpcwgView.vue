<script setup lang="ts">
  import type { Api } from '@/types/api';

  import gwmpcwgData from '@/data/gwmpcwg';
  import { useDevice } from '@/stores/device';
  import { useGwmpcwg } from '@/stores/gwmpcwg';
  import Gygmpcw1 from '@/assets/svg/gygmpcw1.svg?component';
  import Gygmpcw2 from '@/assets/svg/gygmpcw2.svg?component';
  import Gygmpcw3 from '@/assets/svg/gygmpcw3.svg?component';
  import Gygmpcw4 from '@/assets/svg/gygmpcw4.svg?component';
  import Gygmpcw5 from '@/assets/svg/gygmpcw5.svg?component';
  import Gygmpcw6 from '@/assets/svg/gygmpcw6.svg?component';
  import OnlineStatus from '@/components/OnlineStatus.vue';
  import { useDomainCode, useData } from '@/utils/hook.ts';
  import type { CurveChartData } from '@/types/component.ts';

  const deviceStore = useDevice();
  const gwmpcwgStore = useGwmpcwg();
  const domainCode = useDomainCode();
  const { pause } = useData(domainCode, loadData);

  const headers = ref<Array<Api.CurrentDataResult>>([]);
  const online = ref(false);
  const curveData = ref<CurveChartData>({
    legendData: [],
    xAxisData: [],
    seriesData: [],
  });
  const params = reactive(gwmpcwgData);
  const activeKey = ref('1');

  async function loadData() {
    if (domainCode) {
      try {
        const [data1, data2, data3] = await Promise.all([
          deviceStore.loadStatus(domainCode),
          gwmpcwgStore.loadGwmpcwg(domainCode),
          gwmpcwgStore.loadCurve(domainCode),
        ]);
        online.value = data1;
        headers.value = data2.filter(item => item.name.indexOf('报警') === -1);
        curveData.value = {
          legendData: data3.legendData,
          xAxisData: data3.xaxisData,
          seriesData: data3.seriesData,
        };
        return true;
      } catch (e) {
        console.error('请求错误', e);
        pause();
        return false;
      }
    }
    return false;
  }
</script>

<template>
  <div class="h-screen flex flex-col">
    <div class="border border-[var(--color-border)] bg-[var(--bg-color)] h-[340px] p-8 flex flex-row gap-[9px]">
      <div class="border border-[var(--color-border)] h-full w-1/5 bg">
        <OnlineStatus :online="online" />
      </div>
      <div class="h-full w-4/5">
        <div class="right-top"> 高压柜母排测温</div>
        <div class="ml-[15px]">
          <div class="right-middle">运行参数</div>
          <div class="pt-[10px] flex flex-row flex-wrap right-bottom">
            <div
              v-for="(item, idx) in headers"
              :key="item.id"
              class="w-[33%] px-[14px] py-[18px] flex flex-row gap-[16px] right-bottom-child"
            >
              <div class="flex justify-center items-center">
                <Gygmpcw1 v-if="idx === 0" />
                <Gygmpcw2 v-if="idx === 1" />
                <Gygmpcw3 v-if="idx === 2" />
                <Gygmpcw4 v-if="idx === 3" />
                <Gygmpcw5 v-if="idx === 4" />
                <Gygmpcw6 v-if="idx === 5" />
              </div>
              <div class="flex flex-col">
                <div class="value">{{ item.value }}{{ item.unit }}</div>
                <div>{{ item.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-8 p-8 border border-[var(--color-border)] bg-[var(--bg-color)] flex-1 overflow-y-auto">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="产品参数">
          <div class="flex flex-row flex-wrap param">
            <div v-for="item in params" :key="item.id" class="w-1/2 flex flex-row param-child">
              <div class="param-label">{{ item.label }}</div>
              <div class="param-value" :title="item.value">{{ item.value }}</div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="历史数据">
          <CurveChart :chart-data="curveData" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .bg {
    background-image: url('@/assets/image/gygmpcw.png');
    background-repeat: no-repeat;
    background-position: center;
  }

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

  .param {
    .param-child:nth-child(2n - 1) {
      padding-right: 50px;
      margin-bottom: 15px;
    }
  }

  .param-label {
    font-size: 16px;
    color: var(--color-heading);
    font-weight: 600;
    width: 50%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-image: linear-gradient(to bottom, #283a3f, #1e1f27);
  }

  .param-value {
    font-size: 16px;
    color: var(--color-heading);
    font-weight: 600;
    width: 50%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-color: #151516;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
