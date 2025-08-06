<script setup lang="ts">
  import type { RangeValue } from '@/types';
  import type { FormInstance } from 'ant-design-vue';
  import type { Api } from '@/types/api';
  import type { CurveChartData, DetailData, SqYbAliasForm } from '@/types/component.ts';

  import { useData, useDomainCode } from '@/utils/hook';
  import Syb from '@/assets/svg/syb.svg?component';
  import Zll from '@/assets/svg/zll.svg?component';
  import ZllExport from '@/assets/svg/zll-export.svg?component';
  import Ssll from '@/assets/svg/ssll.svg?component';
  import Ysfx from '@/assets/svg/ysfx.svg?component';
  import YsfxOn from '@/assets/svg/ysfx-on.svg?component';
  import OnlineStatus from '@/components/OnlineStatus.vue';
  import Download from '@/assets/svg/download.svg?component';
  import { useQzk } from '@/stores/qzkStore';
  import dayjs from 'dayjs';
  import html2canvas from 'html2canvas';

  const qzkStore = useQzk();
  const domainCode = useDomainCode();
  const { pause } = useData(domainCode, loadData);

  const formRef = ref<FormInstance>();
  const formState = reactive({ status: undefined, name: '' });
  const list = ref<Array<Api.YbFeResult>>([]);
  const open = ref(false);
  const loading = ref(false);
  const cb = reactive({
    show: false,
    selectIds: [] as string[],
    selectItems: [] as Api.YbFeResult[],
  });
  const dateTimeRange = ref<RangeValue>([dayjs().subtract(1, 'month').startOf('day'), dayjs().endOf('day')]);
  const dataSource = ref<Array<Api.YbDetailResult>>([]);
  const sqYbAlias = reactive({
    list: [] as Array<Api.SqYbAliasDto>,
    form: {
      idx: '0',
      name: '',
    } as SqYbAliasForm,
    open: false,
    confirmLoading: false,
    current: {} as Api.YbResult,
  });
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '起始时间值',
      dataIndex: 'start',
      key: 'start',
      width: 200,
    },
    {
      title: '结束时间值',
      dataIndex: 'end',
      key: 'end',
      width: 200,
    },
    {
      title: '差值',
      dataIndex: 'gap',
      key: 'gap',
      width: 200,
    },
  ];
  const detailData = reactive<DetailData>({
    open: false,
    selectItem: {} as Api.YbFeResult,
    current: 1,
    value1: '',
    unit1: 't',
    text1: '',
    value2: '',
    unit2: 't',
    text2: '',
    value3: '',
    unit3: 't',
    text3: '',
  });
  const chart = ref();
  const curveData = ref<CurveChartData>({
    legendData: [],
    xAxisData: [],
    seriesData: [],
  });

  async function loadData() {
    if (domainCode) {
      try {
        const [data1, data2] = await Promise.all([
          qzkStore.loadList(domainCode, formState.status, formState.name),
          qzkStore.loadAlias(),
        ]);
        if (list.value?.length) {
          const map = list.value.reduce((previousValue, currentValue) => {
            previousValue[currentValue.id] = currentValue;
            return previousValue;
          }, {} as any);
          list.value =
            data1?.map(v => {
              return { ...v, checked: map[v.id]?.checked || false };
            }) || [];
        } else {
          list.value =
            data1?.map(v => {
              return { ...v, checked: false };
            }) || [];
        }
        sqYbAlias.list = data2 || [];
        return true;
      } catch (e) {
        console.error('请求错误', e);
        pause();
        return false;
      }
    }
    return false;
  }

  async function loadPage() {
    try {
      let [data1] = await Promise.all([
        qzkStore.loadDetail(dateTimeRange.value, cb.selectIds, domainCode, cb.selectItems),
      ]);
      dataSource.value = data1 || [];
      return true;
    } catch (e) {
      console.error('请求错误', e);
      return false;
    }
  }

  async function loadDetail() {
    try {
      let [data1] = await Promise.all([qzkStore.analyse(detailData.selectItem, detailData.current, domainCode)]);
      curveData.value.legendData = data1.legendData;
      curveData.value.xAxisData = data1.xaxisData;
      curveData.value.seriesData = data1.seriesData;
      detailData.value1 = data1.value1;
      detailData.text1 = data1.text1;
      detailData.value2 = data1.value2;
      detailData.text2 = data1.text2;
      detailData.value3 = data1.value3;
      detailData.text3 = data1.text3;
      await nextTick(() => {
        chart.value?.updateChart();
      });
      return true;
    } catch (e) {
      console.error('请求错误', e);
      return false;
    }
  }

  const onFinish = async () => {
    await loadData();
  };
  const resetForm = async () => {
    formRef.value?.resetFields();
    await loadData();
  };
  const handleAnalyzeClick = async (items: Api.YbFeResult[]) => {
    cb.selectIds = items.map(item => item.id);
    cb.selectItems = items;
    await loadPage();
    open.value = true;
  };
  const handleDateRangeChange = async () => {
    await loadPage();
  };
  const handleDownloadClick = async () => {
    loading.value = true;
    try {
      await qzkStore.exportPage(dateTimeRange.value, cb.selectIds, domainCode, cb.selectItems);
    } finally {
      loading.value = false;
    }
  };
  const handleNameClick = (item: Api.YbResult, name: string) => {
    sqYbAlias.open = true;
    sqYbAlias.current = item;
    sqYbAlias.form.name = name;
    sqYbAlias.form.idx = item.id;
  };
  const getName = (item: Api.YbResult) => {
    const alias = sqYbAlias.list.find((i: Api.SqYbAliasDto) => i.idx + '' === item.id);
    if (alias) {
      return alias.name;
    }
    return item.name;
  };
  const handleSave = async () => {
    sqYbAlias.confirmLoading = true;
    try {
      await qzkStore.saveAlias(sqYbAlias.form);
      await loadData();
    } finally {
      sqYbAlias.confirmLoading = false;
      sqYbAlias.open = false;
    }
  };
  const handleDialogCancel = () => {
    dateTimeRange.value = [dayjs().subtract(1, 'month').startOf('day'), dayjs().endOf('day')];
  };
  const handleCheck = () => {
    cb.show = !cb.show;
    if (!cb.show) {
      handleAnalyzeClick(list.value.filter(item => item.checked));
      list.value.forEach(item => {
        item.checked = false;
      });
    }
  };
  const handleDetailClick = async (item: Api.YbFeResult) => {
    detailData.selectItem = item;
    await loadDetail();
    detailData.open = true;
  };
  const handleDayClick = async (current: number) => {
    detailData.current = current;
    await loadDetail();
  };
  const handleDetailDownloadClick = async () => {
    const element: HTMLElement | null = document.querySelector('#analyze');
    if (element) {
      const canvas = await html2canvas(element);
      const imageData = canvas.toDataURL('image/png');
      const img = document.createElement('img');
      img.src = imageData;
      document.body.appendChild(img);
      const link = document.createElement('a');
      link.href = imageData;
      link.download = 'screenshot.png';
      link.click();
    }
  };
</script>

<template>
  <div class="h-screen flex flex-col">
    <div class="border border-[var(--color-border)] rounded-xl bg-[var(--bg-color)] p-8">
      <a-form ref="formRef" :model="formState" @finish="onFinish">
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item name="status" label="设备状态">
              <a-select v-model:value="formState.status" placeholder="请选择设备状态" allow-clear>
                <a-select-option value="0">离线</a-select-option>
                <a-select-option value="1">在线</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item name="name" label="设备名称">
              <a-input v-model:value="formState.name" placeholder="请输入设备名称" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item>
              <div class="flex flex-row-reverse gap-[10px]">
                <a-button type="primary" @click="handleCheck">{{ cb.show ? '用汽分析' : '选择' }}</a-button>
                <a-button type="primary" html-type="submit">查询</a-button>
                <a-button @click="resetForm">重置</a-button>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div
      class="mt-8 border border-[var(--color-border)] rounded-xl bg-[var(--bg-color)] flex-1 p-8 flex flex-row justify-start items-start content-start flex-wrap gap-[15px]"
    >
      <div
        v-for="item in list"
        :key="item.id"
        class="w-[339px] h-[228px] bg-[var(--bg-color)] rounded-[8px] border border-solid border-[var(--color-border)]"
      >
        <div
          class="h-[58px] flex flex-row justify-between items-center border-b border-solid border-[var(--color-border)]"
        >
          <div class="flex flex-row justify-start items-center gap-[8px]">
            <Syb class="ml-[16px]" />
            <div class="text-white font-medium text-[20px]">{{ getName(item) }}</div>
            <EditOutlined class="cursor-pointer" @click="handleNameClick(item, getName(item))" />
          </div>
          <div class="mr-[16px]">
            <a-checkbox v-model:checked="item.checked" v-if="cb.show" />
          </div>
        </div>
        <div
          :class="{
            'bg-[var(--primary-color)]': item.link,
            'bg-[var(--color-border)]': !item.link,
            'mx-[16px] mt-[16px] h-[6px] rounded-t-[16px]': true,
          }"
        />
        <div class="mx-[16px] mb-[8px] border border-solid border-[var(--color-border)] p-[16px]">
          <div class="flex flex-row items-center gap-[13px]">
            <Ssll class="ml-[16px]" />
            <div class="text-[#8F8F92] font-normal text-[16px] w-1/2">瞬时流量</div>
            <div class="text-white font-medium text-[18px]">{{ item.value }}t/h</div>
          </div>
          <div class="flex flex-row items-center gap-[13px] mt-[10px]">
            <Zll class="ml-[16px]" />
            <div class="text-[#8F8F92] font-normal text-[16px] w-1/2">总流量</div>
            <div class="text-white font-medium text-[18px]">{{ item.totalValue }}t</div>
          </div>
        </div>
        <div class="px-[16px] flex flex-row justify-between items-center">
          <OnlineStatus :online="item.link" :show-continent="false" class="ml-[14px]" />
          <a-button>
            <div class="flex flex-row items-center gap-[11px]" @click="handleDetailClick(item)">
              <YsfxOn v-if="item.link" />
              <Ysfx v-else />
              <div v-if="item.link" class="text-[var(--primary-color)]">用汽分析</div>
              <div v-else>用汽分析</div>
            </div>
          </a-button>
        </div>
      </div>
    </div>

    <a-modal v-model:open="open" :closable="false" :footer="null" width="90vw" @cancel="handleDialogCancel">
      <div class="flex flex-row justify-between items-center mb-[30px]">
        <div class="font-medium text-[20px] text-[#E9E9E9]">用汽统计分析</div>
        <div class="flex flex-row justify-start items-center">
          <div class="font-medium text-[14px] text-[#BBBDBF]">时间查询：</div>
          <a-range-picker
            show-time
            class="w-[370px]"
            :allow-clear="false"
            v-model:value="dateTimeRange"
            @change="handleDateRangeChange"
          />
          <div class="ml-[30px]" v-if="loading">
            <a-spin />
          </div>
          <Download class="ml-[30px] cursor-pointer" @click="handleDownloadClick" v-else />
        </div>
      </div>
      <a-table :dataSource="dataSource" :columns="columns" :pagination="false" />
    </a-modal>

    <a-modal v-model:open="sqYbAlias.open" title="保存" :confirm-loading="sqYbAlias.confirmLoading" @ok="handleSave">
      <p><a-input v-model:value="sqYbAlias.form.name" placeholder="请输入" @press-enter="handleSave" /></p>
    </a-modal>

    <a-modal v-model:open="detailData.open" :closable="false" :footer="null" width="90vw" @cancel="handleDialogCancel">
      <div class="border border-solid border-[var(--color-border)] p-[16px] rounded-xl bg-[#202020]" id="analyze">
        <div class="flex justify-between">
          <div class="font-medium text-[20px] text-[#E9E9E9]">用能统计分析</div>
          <div class="flex justify-end items-start">
            <ul class="flex justify-start gap-[30px] text-[18px] leading-[18px] text-[#E9E9E9]">
              <li :class="{ current: detailData.current === 1, 'cursor-pointer': true }" @click="handleDayClick(1)">
                日
              </li>
              <li :class="{ current: detailData.current === 3, 'cursor-pointer': true }" @click="handleDayClick(3)">
                月
              </li>
              <li :class="{ current: detailData.current === 5, 'cursor-pointer': true }" @click="handleDayClick(5)">
                年
              </li>
            </ul>
            <Download class="ml-[30px] cursor-pointer" @click="handleDetailDownloadClick" />
          </div>
        </div>
        <div class="flex justify-between">
          <div class="w-3/4">
            <CurveChart ref="chart" :chart-data="curveData" class="h-full w-full" />
          </div>
          <div class="w-1/4 py-[16px] pl-[16px] rounded-xl flex flex-col gap-[16px]">
            <div
              class="border border-solid border-[var(--color-border)] p-[32px] flex justify-start items-center gap-[32px]"
            >
              <ZllExport />
              <div>
                <div class="font-semibold">{{ detailData.value1 }} {{ detailData.unit1 }}</div>
                <div class="text-[12px] text-[var(--color-placeholder)]">{{ detailData.text1 }}</div>
              </div>
            </div>
            <div
              class="border border-solid border-[var(--color-border)] p-[32px] flex justify-start items-center gap-[32px]"
            >
              <ZllExport />
              <div>
                <div class="font-semibold">{{ detailData.value2 }} {{ detailData.unit2 }}</div>
                <div class="text-[12px] text-[var(--color-placeholder)]">{{ detailData.text2 }}</div>
              </div>
            </div>
            <div
              class="border border-solid border-[var(--color-border)] p-[32px] flex justify-start items-center gap-[32px]"
            >
              <ZllExport />
              <div>
                <div class="font-semibold">{{ detailData.value3 }} {{ detailData.unit3 }}</div>
                <div class="text-[12px] text-[var(--color-placeholder)]">环比：{{ detailData.text3 }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
  :deep(.ant-form-item) {
    margin: 0;
  }

  .current {
    border-bottom: 1px solid var(--primary-color);
    padding-bottom: 10px;
  }
</style>
