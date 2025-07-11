<script setup lang="ts">
  import type { Api } from '@/types/api';

  import Download from '@/assets/svg/download.svg?component';
  import { useData, useDomainCode } from '@/utils/hook.ts';
  import { useJxtx } from '@/stores/jxtx.ts';
  import ParamChart from '@/components/ParamChart.vue';
  import type { ParamChartData } from '@/types/component.ts';

  const jxtxStore = useJxtx();
  const domainCode = useDomainCode();
  const { pause } = useData(domainCode, loadData);

  const headers = ref<Array<Api.CurrentDataResult>>([]);
  const chart = ref();
  const data = reactive({
    list: ['分闸波形', '合闸波形', '储能波形'],
    current: 0,
    chartData: {
      xAxisData: [],
      seriesData: [],
    } as ParamChartData,
  });
  const activeKey = ref('1');
  const activeKey2 = ref('1');
  const activeKey3 = ref('1');

  function updateChart(x: Array<string>, y: Array<number>) {
    data.chartData.xAxisData = x;
    data.chartData.seriesData = y;
    chart.value.updateChart();
  }

  async function loadData() {
    if (domainCode) {
      try {
        const [[filter, x, y]] = await Promise.all([jxtxStore.loadJxtx(domainCode)]);
        headers.value = filter as Array<Api.CurrentDataResult>;
        updateChart(x as Array<string>, y as Array<number>);
        return true;
      } catch (e) {
        console.error('请求错误', e);
        pause();
        return false;
      }
    }
    return false;
  }

  const handleDownloadClick = async () => {
    await jxtxStore.exportParam(domainCode, data.list[data.current]);
  };
  const handleParamClick = (item: string, idx: number) => {
    data.current = idx;
    const [x, y] = jxtxStore.changeParam(item);
    updateChart(x as Array<string>, y as Array<number>);
  };
</script>

<template>
  <div class="h-screen flex flex-col">
    <div class="border border-[var(--color-border)] bg-[var(--bg-color)] p-8 flex flex-row gap-[9px]">
      <div class="w-full">
        <div class="right-top"> 机械特性 </div>
        <div class="ml-[15px]">
          <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" tab="运行信息">
              <JxtxItem :headers="headers" :list="['002A', '002B', '002C', '002D', '4044', '4045', '4046']" />
            </a-tab-pane>
            <a-tab-pane key="2" tab="动作数据">
              <a-tabs v-model:activeKey="activeKey2">
                <a-tab-pane key="1" tab="分闸报警">
                  <JxtxItem
                    :headers="headers"
                    :list="['0006', '0007', '0008', '0009', '000A', '000B', '000C', '000D', '000E', '000F']"
                  />
                </a-tab-pane>
                <a-tab-pane key="2" tab="储能报警">
                  <JxtxItem :headers="headers" :list="['001A', '001B', '001C']" />
                </a-tab-pane>
                <a-tab-pane key="3" tab="合闸报警">
                  <JxtxItem
                    :headers="headers"
                    :list="['0010', '0011', '0012', '0013', '0014', '0015', '0016', '0017', '0018', '0019']"
                  />
                </a-tab-pane>
              </a-tabs>
            </a-tab-pane>
            <a-tab-pane key="3" tab="告警数据">
              <a-tabs v-model:activeKey="activeKey3">
                <a-tab-pane key="1" tab="分闸数据">
                  <JxtxItem
                    :headers="headers"
                    :list="['4004', '400B', '4003', '4014', '4017', '4019', '4013', '4018']"
                  />
                </a-tab-pane>
                <a-tab-pane key="2" tab="储能数据">
                  <JxtxItem :headers="headers" :list="['403B', '403C', '403F', '403D']" />
                </a-tab-pane>
                <a-tab-pane key="3" tab="合闸数据">
                  <JxtxItem
                    :headers="headers"
                    :list="['4020', '4027', '401F', '4030', '4033', '4035', '402F', '4034']"
                  />
                </a-tab-pane>
              </a-tabs>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </div>
    <div class="mt-8 p-8 border border-[var(--color-border)] bg-[var(--bg-color)] h-[388px]">
      <div class="text-[16px] font-semibold flex flex-row justify-between items-center">
        <span class="border-b-2 border-b-[var(--primary-color)] pb-[6px] text-[#FFF]">波形参数</span>
        <div class="flex flex-row gap-[10px]">
          <div
            v-for="(item, idx) in data.list"
            :key="item"
            :class="{
              'text-[#FFF]': data.current === idx,
              'param-item': true,
            }"
            @click="handleParamClick(item, idx)"
          >
            {{ item }}
          </div>
          <Download class="cursor-pointer self-center" @click="handleDownloadClick" />
        </div>
      </div>
      <div class="overflow-x-auto">
        <ParamChart ref="chart" :chartData="data.chartData" />
      </div>
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

  .value {
    font-size: 16px;
    color: var(--color-heading);
    font-weight: 600;
  }

  .param-item {
    cursor: pointer;
    padding-right: 10px;
    border-right: 1px solid var(--color-border);
  }
</style>
