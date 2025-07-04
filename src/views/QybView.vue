<script setup lang="ts">
  import type { RangeValue } from '@/types';
  import type { FormInstance } from 'ant-design-vue';
  import type { Api } from '@/types/api';
  import type { SqYbAliasForm } from '@/types/component.ts';

  import { useData, useDomainCode, usePagination } from '@/utils/hook';
  import Syb from '@/assets/svg/syb.svg?component';
  import Zll from '@/assets/svg/zll.svg?component';
  import Ssll from '@/assets/svg/ssll.svg?component';
  import Ysfx from '@/assets/svg/ysfx.svg?component';
  import YsfxOn from '@/assets/svg/ysfx-on.svg?component';
  import OnlineStatus from '@/components/OnlineStatus.vue';
  import Download from '@/assets/svg/download.svg?component';
  import { useQzk } from '@/stores/qzkStore';
  import dayjs, { type Dayjs } from 'dayjs';

  const qzkStore = useQzk();
  const domainCode = useDomainCode();
  const { pause } = useData(domainCode, loadData);

  const formRef = ref<FormInstance>();
  const formState = reactive({ status: undefined, name: '' });
  const list = ref<Array<Api.YbResult>>([]);
  const open = ref(false);
  const loading = ref(false);
  const selectId = ref();
  const selectItem = ref();
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
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 200,
    },
    {
      title: '用汽量',
      dataIndex: 'value',
      key: 'value',
      width: 200,
    },
  ];
  const { current, pageSize, total, pagination } = usePagination();

  async function loadData() {
    if (domainCode) {
      try {
        const [data1, data2] = await Promise.all([
          qzkStore.loadList(domainCode, formState.status, formState.name),
          qzkStore.loadAlias(),
        ]);
        list.value = data1 || [];
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
        qzkStore.loadPage(
          current.value,
          pageSize.value,
          dateTimeRange.value,
          selectId.value,
          domainCode,
          selectItem.value,
        ),
      ]);
      dataSource.value = data1?.records || [];
      total.value = data1?.total || 0;
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
  const handleAnalyzeClick = async (item: Api.YbResult) => {
    selectId.value = item.id;
    selectItem.value = item;
    await loadPage();
    open.value = true;
  };
  const handleDateRangeChange = async () => {
    await loadPage();
  };
  const handleDownloadClick = async () => {
    loading.value = true;
    try {
      await qzkStore.exportPage(dateTimeRange.value, selectId.value, domainCode, selectItem.value);
    } finally {
      loading.value = false;
    }
  };
  const disabledDate = (current: Dayjs) => {
    const tooEarly = current.isBefore(dayjs().subtract(1, 'month'), 'day');
    const tooLate = current.isAfter(dayjs(), 'day');
    return tooEarly || tooLate;
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
        <div class="h-[58px] flex flex-row items-center gap-[8px] border-b border-solid border-[var(--color-border)]">
          <Syb class="ml-[16px]" />
          <div class="text-white font-medium text-[20px]">{{ getName(item) }}</div>
          <EditOutlined class="cursor-pointer" @click="handleNameClick(item, getName(item))" />
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
            <div class="text-white font-medium text-[18px]">{{ item.value }}</div>
          </div>
          <div class="flex flex-row items-center gap-[13px] mt-[10px]">
            <Zll class="ml-[16px]" />
            <div class="text-[#8F8F92] font-normal text-[16px] w-1/2">总流量</div>
            <div class="text-white font-medium text-[18px]">{{ item.totalValue }}</div>
          </div>
        </div>
        <div class="px-[16px] flex flex-row justify-between items-center">
          <OnlineStatus :online="item.link" :show-continent="false" class="ml-[14px]" />
          <a-button>
            <div class="flex flex-row items-center gap-[11px]" @click="handleAnalyzeClick(item)">
              <YsfxOn v-if="item.link" />
              <Ysfx v-else />
              <div v-if="item.link" class="text-[var(--primary-color)]">用汽分析</div>
              <div v-else>用汽分析</div>
            </div>
          </a-button>
        </div>
      </div>
    </div>

    <a-modal v-model:open="open" :closable="false" :footer="null" width="90vw">
      <div class="flex flex-row justify-between items-center mb-[30px]">
        <div class="font-medium text-[20px] text-[#E9E9E9]">汽仪表{{ selectId }}-用汽统计分析</div>
        <div class="flex flex-row justify-start items-center">
          <div class="font-medium text-[14px] text-[#BBBDBF]">时间查询：</div>
          <a-range-picker
            show-time
            class="w-[370px]"
            :allow-clear="false"
            v-model:value="dateTimeRange"
            :disabled-date="disabledDate"
            @change="handleDateRangeChange"
          />
          <div class="ml-[30px]" v-if="loading">
            <a-spin />
          </div>
          <Download class="ml-[30px] cursor-pointer" @click="handleDownloadClick" v-else />
        </div>
      </div>
      <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" />
    </a-modal>

    <a-modal v-model:open="sqYbAlias.open" title="保存" :confirm-loading="sqYbAlias.confirmLoading" @ok="handleSave">
      <p><a-input v-model:value="sqYbAlias.form.name" placeholder="请输入" @press-enter="handleSave" /></p>
    </a-modal>
  </div>
</template>

<style scoped>
  :deep(.ant-form-item) {
    margin: 0;
  }
</style>
