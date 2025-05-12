<script setup lang="ts">
  import { reactive } from 'vue';
  import Temperature from '@/assets/svg/temperature.svg?component';

  const headers = reactive([
    {
      id: 1,
      icon: 'icon',
      label: '温度',
      value: '0.4 kV',
    },
    {
      id: 2,
      icon: 'icon',
      label: '温度',
      value: '0.4 kV',
    },
    {
      id: 3,
      icon: 'icon',
      label: '温度',
      value: '0.4 kV',
    },
    {
      id: 4,
      icon: 'icon',
      label: '温度',
      value: '0.4 kV',
    },
    {
      id: 5,
      icon: 'icon',
      label: '温度',
      value: '0.4 kV',
    },
    {
      id: 6,
      icon: 'icon',
      label: '温度',
      value: '0.4 kV',
    },
  ]);
</script>

<template>
  <div class="p-8 h-screen flex flex-col">
    <div class="border border-[#303440] bg-[#1E1F25] h-[32%] p-8 flex flex-row gap-[9px]">
      <div class="border border-[#303440] h-full w-1/5 bg">
        <div class="status-c">
          <em class="status" />
          离线
        </div>
      </div>
      <div class="h-full w-4/5">
        <div class="right-top"> 高压柜母排测温</div>
        <div class="ml-[15px]">
          <div class="right-middle">运行参数</div>
          <div class="pt-[10px] flex flex-row flex-wrap right-bottom">
            <div v-for="item in headers" :key="item.id" class="w-[33%] px-[14px] py-[18px] flex flex-row gap-[16px]">
              <div class="flex justify-center items-center">
                <Temperature class="w-[50px] h-[50px]" />
              </div>
              <div class="flex flex-col">
                <div class="value">{{ item.value }}</div>
                <div>{{ item.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-8 border border-[#303440] bg-[#1E1F25] flex-1" />
  </div>
</template>

<style lang="less" scoped>
  .bg {
    background-image: url('src/assets/image/bg.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }

  .status-c {
    display: inline-block;
    background: hsla(0, 0%, 80%, 0.1);
    border-radius: 31px;
    font-size: 14px;
    padding: 6px 18px;
    position: absolute;
    left: 12px;
    top: 12px;
  }

  .status {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #fff;
    margin-right: 5px;
  }

  .right-top {
    margin-left: 15px;
    padding: 5px 15px 19px 0;
    font-size: 24px;
    font-weight: 600;
    line-height: 34px;
    color: var(--color-heading);
    border-bottom: 1px solid #303440;
  }

  .right-middle {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-heading);
    padding-bottom: 16px;
    padding-top: 14px;
  }

  .value {
    font-size: 16px;
    color: var(--color-heading);
    font-weight: 600;
  }

  .right-bottom {
    :nth-child(2) {
      border-left: 1px solid #303440;
    }

    :nth-child(3) {
      border-left: 1px solid #303440;
    }

    :nth-child(4) {
      border-top: 1px solid #303440;
    }

    :nth-child(5) {
      border-top: 1px solid #303440;
      border-left: 1px solid #303440;
    }

    :nth-child(6) {
      border-top: 1px solid #303440;
      border-left: 1px solid #303440;
    }
  }
</style>
