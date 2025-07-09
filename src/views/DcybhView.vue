<script setup lang="ts">
  import { useData, useDomainCode } from '@/utils/hook.ts';
  import { useDcybh } from '@/stores/dcybh.ts';
  import type { DcybhChild, OtherStatusList, StatusList } from '@/types';
  import type { CurveChartData } from '@/types/component.ts';

  const jxtxStore = useDcybh();
  const domainCode = useDomainCode();
  const { pause } = useData(domainCode, loadData);

  const headers = reactive<Record<string, string | null | undefined>>({});
  const curveData = ref<CurveChartData>({
    legendData: [],
    xAxisData: [],
    seriesData: [],
  });
  const chart = ref();

  const hystrixFilter = (val: string | null | undefined) => {
    if (val === '0') {
      return '正常';
    } else if (val === '1') {
      return '熔断';
    }
    return '--';
  };

  const statusFilter = (val: string | null | undefined) => {
    if (val === '0') {
      return '正常';
    } else if (val === '1') {
      return '合闸';
    }
    return '--';
  };

  const vFilter = (val: string | null | undefined) => {
    return val ? `${val}V` : '--';
  };

  const statusList = ref<Array<StatusList>>([
    {
      header: '熔丝状态',
      children: [
        { icon: 'yellow', name: 'A相熔丝状态', key: 'A相熔丝状态', filter: hystrixFilter },
        { icon: 'green', name: 'B相熔丝状态', key: 'B相熔丝状态', filter: hystrixFilter },
        { icon: 'red', name: 'C相熔丝状态', key: 'C相熔丝状态', filter: hystrixFilter },
      ],
    },
    {
      header: '接触器状态',
      children: [
        { icon: 'yellow', name: 'A相接触器状态', key: 'A相接触器状态', filter: statusFilter },
        { icon: 'green', name: 'B相接触器状态', key: 'B相接触器状态', filter: statusFilter },
        { icon: 'red', name: 'C相接触器状态', key: 'C相接触器状态', filter: statusFilter },
      ],
    },
    {
      header: '电压',
      children: [
        { icon: 'yellow', name: 'A相电压', key: 'A相电压', filter: vFilter },
        { icon: 'green', name: 'B相电压', key: 'B相电压', filter: vFilter },
        { icon: 'red', name: 'C相电压', key: 'C相电压', filter: vFilter },
        { icon: 'white', name: '开路电压', key: '开路电压', filter: vFilter },
      ],
    },
  ]);

  const openCloseFilter = (val: string | null | undefined, key: string) => {
    if (val === '0') {
      if (key === '隔离刀状态') {
        return '隔离刀分';
      } else if (key === '复位输入状态') {
        return '正常';
      } else if (key === '脉冲反馈状态') {
        return '正常';
      }
    } else if (val === '1') {
      if (key === '隔离刀状态') {
        return '隔离刀合';
      } else if (key === '复位输入状态') {
        return '复位状态';
      } else if (key === '脉冲反馈状态') {
        return '脉冲投入';
      }
    }
    return '--';
  };
  const otherStatusList = ref<Array<OtherStatusList>>([
    {
      name: '隔离刀状态',
      key: '隔离刀状态',
      filter: openCloseFilter,
    },
    {
      name: '复位输入状态',
      key: '复位输入状态',
      filter: openCloseFilter,
    },
    {
      name: '脉冲反馈状态',
      key: '脉冲反馈状态',
      filter: openCloseFilter,
    },
  ]);

  async function loadData() {
    if (domainCode) {
      try {
        const [data1, data2] = await Promise.all([jxtxStore.loadDcybh(domainCode), jxtxStore.loadCurve(domainCode)]);
        for (const currentDataResult of data1) {
          headers[currentDataResult.name] = currentDataResult.value;
        }
        curveData.value = {
          legendData: data2.legendData,
          xAxisData: data2.xaxisData,
          seriesData: data2.seriesData,
        };
        await nextTick(() => {
          chart.value?.updateChart();
        });
        return true;
      } catch (e) {
        console.error('请求错误', e);
        pause();
        return false;
      }
    }
    return false;
  }

  const callWithChildFilter = (child: DcybhChild) => {
    if (child.filter) {
      return child.filter(headers[child.key]);
    }
    return '--';
  };

  const otherCallWithChildFilter = (item: OtherStatusList) => {
    if (item.filter) {
      return item.filter(headers[item.key], item.key);
    }
    return '--';
  };

  const isOpen = (item: OtherStatusList) => {
    return headers[item.key] === '1';
  };

  const isClose = (item: OtherStatusList) => {
    return !isOpen(item);
  };
</script>

<template>
  <div class="h-screen flex flex-col">
    <div class="border border-[var(--color-border)] bg-[var(--bg-color)] p-[36px] flex flex-col">
      <div class="flex flex-row gap-[12px] items-end">
        <div class="font-medium text-[24px] text-[#E9E9E9]"> 低残压母线保护 </div>
        <div class="font-normal text-[16px] text-[#BCBCBE]">总称：低残压母线保护及全电压检测装置控制器</div>
      </div>

      <div class="h-[1px] bg-[var(--color-border)] my-[24px]" />

      <div class="flex flex-row flex-wrap gap-[36px]">
        <div
          class="w-[calc((100%-36px)/2)] border border-solid border-[var(--color-border)]"
          v-for="(item, idx) in statusList"
          :key="idx"
        >
          <div
            class="h-[60px] bg-[#292B38] rounded-t-[8px] font-medium text-[16px] leading-[16px] text-[#E9E9E9] pt-[22px] pl-[35px]"
          >
            {{ item.header }}
          </div>
          <div
            class="flex flex-row justify-between items-center px-[35px] py-[22px]"
            v-for="(child, childIdx) in item.children"
            :key="childIdx"
          >
            <div class="flex flex-row items-center">
              <div
                :class="{
                  'w-[10px] h-[10px] rounded-full mr-[16px] border-2 border-solid bg-transparent': true,
                  'border-[#DD9632]': child.icon === 'yellow',
                  'border-[#00CFBB]': child.icon === 'green',
                  'border-[#D12A38]': child.icon === 'red',
                }"
              />
              <div class="font-medium text-[16px] leading-[16px] text-[#E9E9E9]">{{ child.name }}</div>
            </div>
            <div class="font-medium text-[16px] leading-[16px] text-[#E9E9E9]">{{ callWithChildFilter(child) }}</div>
          </div>
        </div>
        <div class="w-[calc((100%-36px)/2)] flex flex-col gap-[16px]">
          <div
            class="h-[63px] border border-solid border-[var(--color-border)] flex flex-row justify-between items-center px-[35px] py-[22px]"
            v-for="(item, idx) in otherStatusList"
            :key="idx"
          >
            <div class="flex flex-row items-center">
              <div
                :class="{
                  'w-[10px] h-[10px] rounded-full mr-[16px] border-2 border-solid bg-transparent': true,
                  'border-[#00D8C3]': isOpen(item),
                  'border-[#FFFFFF]': isClose(item),
                }"
              />
              <div class="font-medium text-[16px] leading-[16px] text-[#E9E9E9]">{{ item.name }}</div>
            </div>
            <div class="font-medium text-[16px] leading-[16px] text-[#E9E9E9]">
              {{ otherCallWithChildFilter(item) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-8 p-8 border border-[var(--color-border)] bg-[var(--bg-color)] flex-1">
      <CurveChart
        ref="chart"
        :chart-data="curveData"
        class="h-[160px]"
        top="20%"
        bottom="0"
        :color="['#d89735', '#28867c', '#c9293b', '#c3c3c4']"
      />
    </div>
  </div>
</template>

<style lang="less" scoped></style>
