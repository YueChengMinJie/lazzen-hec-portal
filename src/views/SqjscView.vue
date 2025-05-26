<script setup lang="ts">
  import ChartItem from '@/components/ChartItem.vue';
</script>

<template>
  <div class="relative w-full h-[100vh] jsc p-[38px] flex flex-col gap-4">
    <div class="flex flex-row justify-between">
      <ChartItem title="水流量耗能环比" type="水" />
      <ChartItem title="用水排行榜TOP5" type="水" />
    </div>
    <div class="flex flex-row justify-between">
      <ChartItem title="汽流量耗能环比" type="汽" />
      <ChartItem title="用汽排行榜TOP5" type="汽" />
    </div>
  </div>
</template>

<style scoped>
  .jsc {
    background-image: url(@/assets/image/background.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: center;
  }

  .header {
    background-image: url(@/assets/image/header.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: center;
  }

  .chart {
    background-image: url(@/assets/image/chart-bg.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: center;
  }

  :deep(.ant-select-selector) {
    border: none !important;
  }
</style>
