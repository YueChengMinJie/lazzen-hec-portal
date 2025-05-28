<script setup lang="ts">
  import type { EChartExpose } from '@/types/component.ts';

  const props = defineProps<{
    type: string;
  }>();

  const echart = ref<EChartExpose>();
  const isWater = computed(() => props.type === 'water');

  onMounted(async () => {
    await updateChart();
  });

  const loadData = async (dateType: string = '3') => {
    return await Promise.resolve([
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6].map(item => item * +dateType),
      [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6].map(item => item * +dateType),
      [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3].map(item => item * +dateType),
    ]);
  };
  const updateChart = async (dateType: string = '3') => {
    const data = await loadData(dateType);
    echart.value?.chart.setOption(getOption(data));
  };

  const getName = () => {
    return isWater.value ? '用水量' : '用气量';
  };

  const getUnit = () => {
    return isWater.value ? 'L' : 'KJ';
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
              return value + ' °%';
            },
          },
          data: data[3],
          smooth: true,
        },
      ],
    };
  };

  defineExpose({
    updateChart,
  });
</script>

<template>
  <EChart ref="echart" class="w-[460px] h-[315px]" />
</template>

<style scoped></style>
