<script setup lang="ts">
  import zhCN from 'ant-design-vue/es/locale/zh_CN';
  import dayjs from 'dayjs';
  import 'dayjs/locale/zh-cn';
  import { theme } from 'ant-design-vue';

  dayjs.locale('zh-cn');
</script>

<template>
  <a-config-provider
    :theme="{
      algorithm: theme.darkAlgorithm,
      token: {
        colorPrimary: '#00D8C3',
      },
    }"
    :locale="zhCN"
  >
    <RouterView />
  </a-config-provider>
</template>

<style scoped></style>
