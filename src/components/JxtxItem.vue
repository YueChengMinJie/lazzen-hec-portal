<script setup lang="ts">
  import type { Api } from '@/types/api.ts';

  import Jxtx1 from '@/assets/svg/jxtx1.svg?component';
  import Jxtx2 from '@/assets/svg/jxtx2.svg?component';
  import Jxtx3 from '@/assets/svg/jxtx3.svg?component';
  import Jxtx4 from '@/assets/svg/jxtx4.svg?component';

  const props = defineProps<{
    headers: Api.CurrentDataResult[];
    list: string[];
  }>();

  const firstIcon = (item: Api.CurrentDataResult) => {
    return item.unit === 'A';
  };
  const secondIcon = (item: Api.CurrentDataResult) => {
    return item.name.indexOf('储能电机运行状态') !== -1;
  };
  const thirdIcon = (item: Api.CurrentDataResult) => {
    return item.name.indexOf('位') !== -1;
  };

  const filterVal = (item: Api.CurrentDataResult) => {
    if (item.name.indexOf('报警') !== -1) {
      return item.value === '1' ? '报警' : '正常';
    } else if (item.name === '采集通讯状态异常') {
      if (item.value === '0') {
        return '正常';
      } else if (item.value === '1') {
        return '通讯异常';
      }
    } else if (item.name.indexOf('系统运行状态') !== -1 || item.name.indexOf('分合闸线圈状态') !== -1) {
      return item.value === '1' ? '异常' : '正常';
    } else if (item.name === '机构状态异常') {
      if (item.value === '0') {
        return '正常';
      } else if (item.value === '1') {
        return '弹簧疲劳、机构卡涩、传动润滑缺陷';
      }
    } else if (item.name === '辅助开关状态异常') {
      if (item.value === '0') {
        return '正常';
      } else if (item.value === '1') {
        return '辅助触点切换异常';
      }
    } else if (item.name === '分闸回路短路' || item.name === '合闸回路短路' || item.name === '副分闸回路短路') {
      if (item.value === '0') {
        return '正常';
      } else if (item.value === '1') {
        return '回路短路';
      }
    } else if (item.name.indexOf('储能电机运行状态') !== -1) {
      return item.value === '1' ? '异常' : '正常';
    } else if (item.name === '储能电机回路短路') {
      if (item.value === '0') {
        return '正常';
      } else if (item.value === '1') {
        return '回路短路';
      }
    } else if (item.name === '断路器合闸位置') {
      if (item.value === '0') {
        return '分';
      } else if (item.value === '1') {
        return '合';
      } else if (item.value === '2') {
        return '异常分闸';
      } else if (item.value === '3') {
        return '未知';
      }
    } else if (item.name === '电机已储能') {
      if (item.value === '0') {
        return '已储能';
      } else if (item.value === '1') {
        return '未储能';
      }
    } else {
      return `${item.value}${item.unit}`;
    }
  };
</script>

<template>
  <div
    class="flex flex-row flex-wrap justify-start items-center content-start right-bottom h-[calc(100vh-388px-40px-59px-59px-10px-60px)] overflow-y-auto"
  >
    <div
      v-for="item in props.headers.filter(v => props.list.includes(v.code))"
      :key="item.id"
      class="w-[33%] h-[80px] px-[14px] py-[18px] flex flex-row gap-[16px] right-bottom-child"
    >
      <div class="flex justify-center items-center">
        <Jxtx1 v-if="firstIcon(item)" />
        <Jxtx2 v-else-if="secondIcon(item)" />
        <Jxtx3 v-else-if="thirdIcon(item)" />
        <Jxtx4 v-else />
      </div>
      <div class="flex flex-col">
        <div class="value">{{ filterVal(item) }}</div>
        <div>{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .right-bottom {
    .right-bottom-child:nth-child(3n + 1) {
      border-right: 1px solid var(--color-border);
      border-bottom: 1px solid var(--color-border);
    }

    .right-bottom-child:nth-child(3n + 2) {
      border-right: 1px solid var(--color-border);
      border-bottom: 1px solid var(--color-border);
    }

    .right-bottom-child:nth-child(3n + 3) {
      border-bottom: 1px solid var(--color-border);
    }
  }
</style>
