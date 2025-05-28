<script setup lang="ts">
  import * as echarts from 'echarts';
  import type { EChartsType } from 'echarts';

  const chart = ref<EChartsType>();
  const chartRef = ref<HTMLElement>();

  onMounted(() => {
    chart.value = echarts.init(chartRef.value, 'dark');
  });

  defineExpose({
    chart,
  });
</script>

<template>
  <div ref="chartRef" class="p-[10px]" />
</template>

<style scoped></style>
