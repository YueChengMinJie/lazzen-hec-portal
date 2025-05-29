<script setup lang="ts">
  import ChartItem from '@/components/ChartItem.vue';
</script>

<template>
  <div class="relative w-full h-[100vh] jsc p-[38px] flex flex-col gap-4">
    <div class="flex flex-row justify-between">
      <ChartItem title="水流量耗能环比" type="水">
        <template #chart="{ setSlotRef }">
          <WaterGasChart :ref="setSlotRef" :type="'WATER'" />
        </template>
      </ChartItem>
      <ChartItem title="用水排行榜TOP5" type="水">
        <template #chart="{ setSlotRef }">
          <WaterGasTopChart :ref="setSlotRef" :type="'WATER'" />
        </template>
      </ChartItem>
    </div>
    <div class="flex flex-row justify-between">
      <ChartItem title="汽流量耗能环比" type="汽">
        <template #chart="{ setSlotRef }">
          <WaterGasChart :ref="setSlotRef" :type="'STEAM'" />
        </template>
      </ChartItem>
      <ChartItem title="用汽排行榜TOP5" type="汽">
        <template #chart="{ setSlotRef }">
          <WaterGasTopChart :ref="setSlotRef" :type="'STEAM'" />
        </template>
      </ChartItem>
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

  :deep(.ant-select-selector) {
    border: none !important;
  }
</style>
