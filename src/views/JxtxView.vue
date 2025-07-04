<script setup lang="ts">
  import type { Api } from '@/types/api';

  import Jxtx1 from '@/assets/svg/jxtx1.svg?component';
  import Jxtx2 from '@/assets/svg/jxtx2.svg?component';
  import Jxtx3 from '@/assets/svg/jxtx3.svg?component';
  import Jxtx4 from '@/assets/svg/jxtx4.svg?component';
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

  const filterVal = (item: Api.CurrentDataResult) => {
    if (item.name === '断路器合闸位置') {
      if (item.value === '0') {
        return '分';
      } else if (item.value === '1') {
        return '合';
      } else if (item.value === '2') {
        return '异常分闸';
      } else if (item.value === '3') {
        return '未知';
      }
    } else if (item.name === '电机已储能') {
      if (item.value === '0') {
        return '已储能';
      } else if (item.value === '1') {
        return '未储能';
      }
    } else {
      return `${item.value}${item.unit}`;
    }
  };

  const filterVal2 = (item: Api.CurrentDataResult) => {
    if (item.name.indexOf('报警') !== -1) {
      return item.value === '1' ? '报警' : '正常';
    } else if (item.name === '采集通讯状态异常') {
      if (item.value === '0') {
        return '正常';
      } else if (item.value === '1') {
        return '通讯异常';
      }
    } else if (item.name.indexOf('系统运行状态') !== -1 || item.name.indexOf('分合闸线圈状态') !== -1) {
      return item.value === '1' ? '异常' : '正常';
    } else if (item.name === '机构状态异常') {
      if (item.value === '0') {
        return '正常';
      } else if (item.value === '1') {
        return '弹簧疲劳、机构卡涩、传动润滑缺陷';
      }
    } else if (item.name === '辅助开关状态异常') {
      if (item.value === '0') {
        return '正常';
      } else if (item.value === '1') {
        return '辅助触点切换异常';
      }
    } else if (item.name === '分闸回路短路' || item.name === '合闸回路短路' || item.name === '副分闸回路短路') {
      if (item.value === '0') {
        return '正常';
      } else if (item.value === '1') {
        return '回路短路';
      }
    } else if (item.name.indexOf('储能电机运行状态') !== -1) {
      return item.value === '1' ? '异常' : '正常';
    } else if (item.name === '储能电机回路短路') {
      if (item.value === '0') {
        return '正常';
      } else if (item.value === '1') {
        return '回路短路';
      }
    }
    return `${item.value}`;
  };

  const firstIcon = (item: Api.CurrentDataResult) => {
    return item.unit === 'A';
  };
  const secondIcon = (item: Api.CurrentDataResult) => {
    return item.name.indexOf('储能电机运行状态') !== -1;
  };
  const thirdIcon = (item: Api.CurrentDataResult) => {
    return item.name.indexOf('位') !== -1;
  };

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
            <a-tab-pane key="1" tab="运行数据">
              <div
                class="flex flex-row flex-wrap right-bottom h-[calc(100vh-388px-40px-59px-59px-10px)] overflow-y-auto"
              >
                <div
                  v-for="item in headers.filter(
                    v => v.code.startsWith('4') || v.name === '断路器合闸位置' || v.name === '电机已储能',
                  )"
                  :key="item.id"
                  class="w-[33%] px-[14px] py-[18px] flex flex-row gap-[16px] right-bottom-child"
                >
                  <div class="flex justify-center items-center">
                    <Jxtx1 v-if="firstIcon(item)" />
                    <Jxtx2 v-else-if="secondIcon(item)" />
                    <Jxtx3 v-else-if="thirdIcon(item)" />
                    <Jxtx4 v-else />
                  </div>
                  <div class="flex flex-col">
                    <div class="value">{{ filterVal(item) }}</div>
                    <div>{{ item.name }}</div>
                  </div>
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="报警数据">
              <div
                class="flex flex-row flex-wrap right-bottom h-[calc(100vh-388px-40px-59px-59px-10px)] overflow-y-auto"
              >
                <div
                  v-for="item in headers.filter(
                    v => v.code.startsWith('0') && v.name !== '断路器合闸位置' && v.name !== '电机已储能',
                  )"
                  :key="item.id"
                  class="w-[33%] px-[14px] py-[18px] flex flex-row gap-[16px] right-bottom-child"
                >
                  <div class="flex justify-center items-center">
                    <Jxtx1 v-if="firstIcon(item)" />
                    <Jxtx2 v-else-if="secondIcon(item)" />
                    <Jxtx3 v-else-if="thirdIcon(item)" />
                    <Jxtx4 v-else />
                  </div>
                  <div class="flex flex-col">
                    <div class="value">{{ filterVal2(item) }}</div>
                    <div>{{ item.name }}</div>
                  </div>
                </div>
              </div>
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

  .right-bottom {
    .right-bottom-child:nth-child(3n + 1) {
      border-right: 1px solid var(--color-border);
      border-bottom: 1px solid var(--color-border);
    }

    .right-bottom-child:nth-child(3n + 2) {
      border-right: 1px solid var(--color-border);
      border-bottom: 1px solid var(--color-border);
    }

    .right-bottom-child:nth-child(3n + 3) {
      border-bottom: 1px solid var(--color-border);
    }
  }

  .param-item {
    cursor: pointer;
    padding-right: 10px;
    border-right: 1px solid var(--color-border);
  }
</style>
