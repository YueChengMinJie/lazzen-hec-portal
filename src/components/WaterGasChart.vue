<script setup lang="ts">
  import type { EChartExpose } from '@/types/component.ts';
  import { chart } from '@/apis';

  const props = defineProps<{
    type: string;
  }>();

  const echart = ref<EChartExpose>();
  const isWater = computed(() => props.type === 'WATER');

  onMounted(async () => {
    await updateChart();
  });

  const updateChart = async (dateType: string = '3') => {
    const data = await loadData(dateType);
    echart.value?.chart.setOption(getOption(data));
  };

  const loadData = async (dateType: string = '3') => {
    try {
      const data = await chart({
        dateType,
        dataType: props.type,
      });
      return [
        data.map(item => item.xname),
        data.map(item => item.value),
        data.map(item => item.qoq || 0),
        data.map(item => item.yoy || 0),
      ];
    } catch (_) {
      return [[], [], [], []];
    }
  };

  const getOption = (data: any) => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#00D8C1',
          },
        },
      },
      legend: {
        data: [getName(), '环比', '同比'],
        bottom: 20,
      },
      xAxis: [
        {
          type: 'category',
          data: data[0],
          axisPointer: {
            type: 'shadow',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: getUnit(),
          splitLine: {
            show: false,
          },
        },
        {
          type: 'value',
          name: '%',
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: getName(),
          type: 'bar',
          tooltip: {
            valueFormatter: function (value: number) {
              return value + ' ' + getUnit();
            },
          },
          data: data[1],
          barWidth: '40%',
        },
        {
          name: '环比',
          type: 'line',
          tooltip: {
            valueFormatter: function (value: number) {
              return value + ' %';
            },
          },
          data: data[2],
          smooth: true,
        },
        {
          name: '同比',
          type: 'line',
          yAxisIndex: 1,
          tooltip: {
            valueFormatter: function (value: number) {
              return value + ' %';
            },
          },
          data: data[3],
          smooth: true,
        },
      ],
    };
  };

  const getName = () => {
    return isWater.value ? '用水量' : '用气量';
  };

  const getUnit = () => {
    return isWater.value ? 't/吨' : 'KJ';
  };

  defineExpose({
    updateChart,
  });
</script>

<template>
  <EChart ref="echart" class="w-[380px] h-[305px]" />
</template>

<style scoped></style>
