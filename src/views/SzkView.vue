<script setup lang="ts">
  import type { FormInstance } from 'ant-design-vue';

  const formRef = ref<FormInstance>();
  const formState = reactive({ status: undefined, name: '' });
  const onFinish = () => {};
  const resetForm = () => {};
  const submitForm = () => {};
</script>

<template>
  <div class="p-8 h-screen flex flex-col">
    <div class="border border-[#303440] rounded-xl bg-[#1E1F25] p-8">
      <a-form ref="formRef" :model="formState" @finish="onFinish">
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item name="status" label="设备状态">
              <a-select v-model:value="formState.status" placeholder="请选择设备状态">
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
                <a-button type="primary" html-type="submit" @click="submitForm">查询</a-button>
                <a-button @click="resetForm">重置</a-button>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="mt-8 border border-[#303440] rounded-xl bg-[#1E1F25] flex-1 p-8" />
  </div>
</template>

<style scoped>
  :deep(.ant-form-item) {
    margin: 0;
  }
</style>
