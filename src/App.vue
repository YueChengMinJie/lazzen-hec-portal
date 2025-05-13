<script setup lang="ts"></script>

<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#00D8C3',
      },
    }"
  >
    <RouterView />
  </a-config-provider>
</template>

<style scoped></style>
