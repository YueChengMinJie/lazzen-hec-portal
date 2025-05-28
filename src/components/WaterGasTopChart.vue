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

  const updateChart = async (dateType: string = '3') => {
    const data = await loadData(dateType);
    // @ts-ignore
    echart.value?.chart.setOption(getOption(data));
  };

  const loadData = async (dateType: string = '3') => {
    const data = [];
    for (let i = 0; i < 5; ++i) {
      data.push(Math.round(Math.random() * 200 * +dateType));
    }
    data.sort((a, b) => b - a);
    return await Promise.resolve([data, ['5号楼', '4号楼', '3号楼', '2号楼', '1号楼']]);
  };

  const getOption = (data: any) => {
    const xData = data[0];
    const yData = data[1];
    return {
      backgroundColor: 'transparent',
      xAxis: {
        max: 'dataMax',
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'category',
        data: yData,
        inverse: true,
        animationDuration: 300,
        animationDurationUpdate: 300,
        max: 4,
        name: getUnit(),
        nameLocation: 'start',
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
      },
      series: [
        {
          barWidth: '30%',
          realtimeSort: true,
          type: 'bar',
          data: xData.map((value: number, idx: number) => {
            return {
              value,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 0,
                  colorStops: [
                    {
                      offset: 0,
                      color: idx % 2 === 0 ? '#274d4f' : '#1e314a',
                    },
                    {
                      offset: 1,
                      color: idx % 2 === 0 ? '#61d3c2' : '#377df3',
                    },
                  ],
                  global: false,
                },
                borderRadius: [2, 2, 2, 2],
                opacity: 0.8,
              },
            };
          }),
          label: {
            show: true,
            position: 'right',
            valueAnimation: true,
          },
        },
      ],
      legend: {
        show: false,
      },
      animationDuration: 0,
      animationDurationUpdate: 3000,
      animationEasing: 'linear',
      animationEasingUpdate: 'linear',
    };
  };

  const getUnit = () => {
    return isWater.value ? 'L' : 'KJ';
  };

  defineExpose({
    updateChart,
  });
</script>

<template>
  <EChart ref="echart" class="w-[460px] h-[315px]" />
</template>

<style scoped></style>
