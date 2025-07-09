<script setup lang="ts">
  import Point from '@/assets/svg/point.svg?component';

  const props = defineProps<{
    title: string;
    type: string;
  }>();
  const selectedItem = ref('3');
  const slotRef = ref<{ updateChart: (value: string) => void }>();

  const setSlotRef = (el: any) => {
    slotRef.value = el;
  };
  const handleDateChange = () => {
    slotRef.value?.updateChart(selectedItem.value);
  };
</script>

<template>
  <div class="w-[400px] h-[400px] p-[10px] chart rounded-xl">
    <div class="header h-[44px] pl-[90px] pr-[15px] flex flex-row justify-between items-center">
      <div class="flex flex-row h-full items-center">
        <Point />
        <span class="ml-[6px] font-medium text-[18px] leading-[18px] text-[#E9E9E9]"> {{ props.title }} </span>
      </div>
      <div>
        <a-select v-model:value="selectedItem" @change="handleDateChange">
          <a-select-option value="1">今日</a-select-option>
          <a-select-option value="2">近一周</a-select-option>
          <a-select-option value="3">近一月</a-select-option>
          <a-select-option value="4">本季度</a-select-option>
          <a-select-option value="5">近一年</a-select-option>
        </a-select>
      </div>
    </div>
    <div
      class="py-[10px] pr-[10px] cursor-pointer font-medium text-[16px] leading-[16px] text-[var(--primary-color)] text-right"
    >
      <span class="pb-[4px] border-b-2 border-b-solid border-b-[var(--primary-color)]">{{ type }}</span>
    </div>
    <slot name="chart" :setSlotRef="setSlotRef" />
  </div>
</template>

<style scoped>
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
