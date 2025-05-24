<script setup lang="ts">
  import { useData, useDomainCode } from '@/utils/hook.ts';
  import { useDcybh } from '@/stores/dcybh.ts';
  import type { DcybhChild, OtherStatusList, StatusList } from '@/types';

  const jxtxStore = useDcybh();
  const domainCode = useDomainCode();
  const { pause } = useData(domainCode, loadData);

  const headers = reactive<Record<string, string | null | undefined>>({});

  const hystrixFilter = (val: string | null | undefined) => {
    if (val === '0') {
      return '正常';
    } else if (val === '1') {
      return '熔断';
    }
    return '--';
  };

  const statusFilter = (val: string | null | undefined) => {
    if (val === '0') {
      return '正常';
    } else if (val === '1') {
      return '合闸';
    }
    return '--';
  };
  const statusList = ref<Array<StatusList>>([
    {
      header: '熔丝状态',
      children: [
        { icon: 'yellow', name: 'A相熔丝状态', key: 'A相熔丝状态', filter: hystrixFilter },
        { icon: 'green', name: 'B相熔丝状态', key: 'B相熔丝状态', filter: hystrixFilter },
        { icon: 'red', name: 'C相熔丝状态', key: 'C相熔丝状态', filter: hystrixFilter },
      ],
    },
    {
      header: '接触器状态',
      children: [
        { icon: 'yellow', name: 'A相接触器状态', key: 'A相接触器状态', filter: statusFilter },
        { icon: 'green', name: 'B相接触器状态', key: 'B相接触器状态', filter: statusFilter },
        { icon: 'red', name: 'C相接触器状态', key: 'C相接触器状态', filter: statusFilter },
      ],
    },
  ]);

  const openCloseFilter = (val: string | null | undefined, key: string) => {
    if (val === '0') {
      if (key === '隔离刀状态') {
        return '隔离刀分';
      } else if (key === '复位输入状态') {
        return '正常';
      } else if (key === '脉冲反馈状态') {
        return '正常';
      }
    } else if (val === '1') {
      if (key === '隔离刀状态') {
        return '隔离刀合';
      } else if (key === '复位输入状态') {
        return '复位状态';
      } else if (key === '脉冲反馈状态') {
        return '脉冲投入';
      }
    }
    return '--';
  };
  const otherStatusList = ref<Array<OtherStatusList>>([
    {
      name: '隔离刀状态',
      key: '隔离刀状态',
      filter: openCloseFilter,
    },
    {
      name: '复位输入状态',
      key: '复位输入状态',
      filter: openCloseFilter,
    },
    {
      name: '脉冲反馈状态',
      key: '脉冲反馈状态',
      filter: openCloseFilter,
    },
  ]);

  async function loadData() {
    if (domainCode) {
      try {
        const [data1] = await Promise.all([jxtxStore.loadDcybh(domainCode)]);
        for (const currentDataResult of data1) {
          headers[currentDataResult.name] = currentDataResult.value;
        }
        return true;
      } catch (e) {
        console.error('请求错误', e);
        pause();
        return false;
      }
    }
    return false;
  }

  const callWithChildFilter = (child: DcybhChild) => {
    if (child.filter) {
      return child.filter(headers[child.key]);
    }
    return '--';
  };

  const otherCallWithChildFilter = (item: OtherStatusList) => {
    if (item.filter) {
      return item.filter(headers[item.key], item.key);
    }
    return '--';
  };

  const isOpen = (item: OtherStatusList) => {
    return headers[item.key] === '1';
  };

  const isClose = (item: OtherStatusList) => {
    return !isOpen(item);
  };
</script>

<template>
  <div class="p-8 h-screen flex flex-col">
    <div class="border border-[var(--color-border)] bg-[var(--bg-color)] p-[36px] flex flex-col">
      <div class="flex flex-row gap-[12px] items-end">
        <div class="font-medium text-[24px] text-[#E9E9E9]"> 低残压母线保护 </div>
        <div class="font-normal text-[16px] text-[#BCBCBE]">总称：低残压母线保护及全电压检测装置控制器</div>
      </div>

      <div class="h-[1px] bg-[var(--color-border)] my-[24px]" />

      <div class="flex flex-row flex-wrap gap-[36px]">
        <div
          class="w-[calc((100%-36px)/2)] h-[246px] border border-solid border-[var(--color-border)]"
          v-for="(item, idx) in statusList"
          :key="idx"
        >
          <div
            class="h-[60px] bg-[#292B38] rounded-t-[8px] font-medium text-[16px] leading-[16px] text-[#E9E9E9] pt-[22px] pl-[35px]"
          >
            {{ item.header }}
          </div>
          <div
            class="flex flex-row justify-between items-center px-[35px] py-[22px]"
            v-for="(child, childIdx) in item.children"
            :key="childIdx"
          >
            <div class="flex flex-row items-center">
              <div
                :class="{
                  'w-[10px] h-[10px] rounded-full mr-[16px] border-2 border-solid bg-transparent': true,
                  'border-[#DD9632]': child.icon === 'yellow',
                  'border-[#00CFBB]': child.icon === 'green',
                  'border-[#D12A38]': child.icon === 'red',
                }"
              />
              <div class="font-medium text-[16px] leading-[16px] text-[#E9E9E9]">{{ child.name }}</div>
            </div>
            <div class="font-medium text-[16px] leading-[16px] text-[#E9E9E9]">{{ callWithChildFilter(child) }}</div>
          </div>
        </div>
        <div
          class="w-[calc((100%-36px)/2)] h-[63px] border border-solid border-[var(--color-border)] flex flex-row justify-between items-center px-[35px] py-[22px]"
          v-for="(item, idx) in otherStatusList"
          :key="idx"
        >
          <div class="flex flex-row items-center">
            <div
              :class="{
                'w-[10px] h-[10px] rounded-full mr-[16px] border-2 border-solid bg-transparent': true,
                'border-[#00D8C3]': isOpen(item),
                'border-[#FFFFFF]': isClose(item),
              }"
            />
            <div class="font-medium text-[16px] leading-[16px] text-[#E9E9E9]">{{ item.name }}</div>
          </div>
          <div class="font-medium text-[16px] leading-[16px] text-[#E9E9E9]">{{ otherCallWithChildFilter(item) }}</div>
        </div>
      </div>
    </div>
    <div
      class="mt-8 p-8 border border-[var(--color-border)] bg-[var(--bg-color)] flex-1 flex justify-center items-center"
    >
      <div class="text-[#8F8F92]">暂无数据</div>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
