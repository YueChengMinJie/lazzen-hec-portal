<script setup lang="ts">
  import type { Api } from '@/apis';
  import gwmpcwgData from '@/data/gwmpcwg';
  import { useDevice } from '@/stores/device';
  import { useGwmpcwg } from '@/stores/gwmpcwg';
  import Gygmpcw1 from '@/assets/svg/gygmpcw1.svg?component';
  import Gygmpcw2 from '@/assets/svg/gygmpcw2.svg?component';
  import Gygmpcw3 from '@/assets/svg/gygmpcw3.svg?component';
  import Gygmpcw4 from '@/assets/svg/gygmpcw4.svg?component';
  import Gygmpcw5 from '@/assets/svg/gygmpcw5.svg?component';
  import Gygmpcw6 from '@/assets/svg/gygmpcw6.svg?component';

  const deviceStore = useDevice();
  const gwmpcwgStore = useGwmpcwg();
  const route = useRoute();
  const domainCode = route.query.domainCode as string;

  const headers = ref<Array<Api.GwmpcwgResult>>([]);
  const online = ref(false);
  const params = reactive(gwmpcwgData);

  onMounted(async () => {
    if (domainCode) {
      const [data1, data2] = await Promise.all([
        deviceStore.loadStatus(domainCode),
        gwmpcwgStore.loadGwmpcwg(domainCode),
      ]);
      online.value = data1;
      headers.value = data2;
    }
  });
</script>

<template>
  <div class="p-8 h-screen flex flex-col">
    <div class="border border-[#303440] bg-[#1E1F25] h-[340px] p-8 flex flex-row gap-[9px]">
      <div class="border border-[#303440] h-full w-1/5 bg">
        <div :class="online ? 'status-c-online' : 'status-c'">
          <em :class="online ? 'status-online' : 'status'" />
          {{ online ? '在线' : '离线' }}
        </div>
      </div>
      <div class="h-full w-4/5">
        <div class="right-top"> 高压柜母排测温</div>
        <div class="ml-[15px]">
          <div class="right-middle">运行参数</div>
          <div class="pt-[10px] flex flex-row flex-wrap right-bottom">
            <div
              v-for="(item, idx) in headers"
              :key="item.id"
              class="w-[33%] px-[14px] py-[18px] flex flex-row gap-[16px] right-bottom-child"
            >
              <div class="flex justify-center items-center">
                <Gygmpcw1 v-if="idx === 0" />
                <Gygmpcw2 v-if="idx === 1" />
                <Gygmpcw3 v-if="idx === 2" />
                <Gygmpcw4 v-if="idx === 3" />
                <Gygmpcw5 v-if="idx === 4" />
                <Gygmpcw6 v-if="idx === 5" />
              </div>
              <div class="flex flex-col">
                <div class="value">{{ item.val }}</div>
                <div>{{ item.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-8 p-8 border border-[#303440] bg-[#1E1F25] flex-1 overflow-y-auto">
      <div class="bottom-top">产品参数</div>
      <div class="flex flex-row flex-wrap param">
        <div v-for="item in params" :key="item.id" class="w-1/2 flex flex-row param-child">
          <div class="param-label">{{ item.label }}</div>
          <div class="param-value" :title="item.value">{{ item.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .bg {
    background-image: url('src/assets/image/gygmpcw.png');
    background-repeat: no-repeat;
    background-position: center;
  }

  .status-c {
    display: inline-block;
    background: var(--offline-bg-color);
    color: var(--offline-color);
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
    background: var(--offline-color);
    margin-right: 5px;
  }

  .status-c-online {
    display: inline-block;
    background: var(--online-bg-color);
    color: var(--online-color);
    border-radius: 31px;
    font-size: 14px;
    padding: 6px 18px;
    position: absolute;
    left: 12px;
    top: 12px;
  }

  .status-online {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--online-color);
    margin-right: 5px;
  }

  .right-top {
    margin-left: 15px;
    padding: 5px 15px 19px 0;
    font-size: 24px;
    font-weight: 600;
    line-height: 34px;
    color: var(--color-heading);
    border-bottom: 1px solid var(--color-border);
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
    .right-bottom-child:nth-child(2) {
      border-left: 1px solid var(--color-border);
    }

    .right-bottom-child:nth-child(3) {
      border-left: 1px solid var(--color-border);
    }

    .right-bottom-child:nth-child(4) {
      border-top: 1px solid var(--color-border);
    }

    .right-bottom-child:nth-child(5) {
      border-top: 1px solid var(--color-border);
      border-left: 1px solid var(--color-border);
    }

    .right-bottom-child:nth-child(6) {
      border-top: 1px solid var(--color-border);
      border-left: 1px solid var(--color-border);
    }
  }

  .bottom-top {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-heading);
    padding-bottom: 16px;
  }

  .param {
    .param-child:nth-child(2n - 1) {
      padding-right: 50px;
      margin-bottom: 15px;
    }
  }

  .param-label {
    font-size: 16px;
    color: var(--color-heading);
    font-weight: 600;
    width: 50%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-image: linear-gradient(to bottom, #283a3f, #1e1f27);
  }

  .param-value {
    font-size: 16px;
    color: var(--color-heading);
    font-weight: 600;
    width: 50%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-color: #151516;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
