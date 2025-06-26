<script setup lang="ts">
  import type { EChartExpose, ParamChartData } from '@/types/component.ts';

  const props = defineProps<{
    chartData: ParamChartData;
  }>();

  const echart = ref<EChartExpose>();

  onMounted(() => {
    updateChart();
  });

  const updateChart = () => {
    echart.value?.chart.setOption(getOption(props.chartData));
  };

  const getOption = (data: ParamChartData) => {
    return {
      backgroundColor: 'transparent',
      grid: {
        top: '10%',
        bottom: '10%',
        left: '0%',
        right: '10px',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: data.xAxisData,
        axisLabel: {
          interval: 0, // 显示所有标签
          formatter: (value: string) => {
            return value === '1' || +value % 50 === 0 ? value : '';
          },
        },
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: false,
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      series: [
        {
          data: data.seriesData,
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#00D8C3',
            width: 2,
          },
          symbol: 'none',
        },
      ],
    };
  };

  defineExpose({
    updateChart,
  });
</script>

<template>
  <EChart ref="echart" class="w-[calc(100vw-40px)] h-[300px]" />
</template>

<style scoped></style>
