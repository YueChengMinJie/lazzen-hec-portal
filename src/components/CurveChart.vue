<script setup lang="ts">
  import type { CurveChartData, EChartExpose } from '@/types/component.ts';

  const props = defineProps<{
    chartData: CurveChartData;
  }>();

  const echart = ref<EChartExpose>();

  onMounted(() => {
    updateChart();
  });

  const updateChart = () => {
    echart.value?.chart.setOption(getOption(props.chartData));
  };

  const getOption = (data: CurveChartData) => {
    const option = {
      backgroundColor: 'transparent',
      grid: {
        top: '10%',
        bottom: '10%',
        left: '70px',
        right: '70px',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: data.legendData,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.xAxisData,
      },
      yAxis: {
        type: 'value',
      },
      series: [] as any[],
    };
    for (let i = 0; i < data.seriesData.length; i++) {
      const seriesDatum = data.seriesData[i];
      option.series.push({
        name: data.legendData[i],
        type: 'line',
        stack: 'Total',
        data: seriesDatum,
      });
    }
    return option;
  };

  defineExpose({
    updateChart,
  });
</script>

<template>
  <EChart ref="echart" class="w-[calc(100vw-40px)] h-[400px]" />
</template>

<style scoped></style>
