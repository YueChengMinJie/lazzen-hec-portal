<script setup lang="ts">
  const handleBtnClick = () => {
    console.log('zxj', 1111);
  };
</script>

<template>
  <div>
    <div class="text-red-500 dark:text-red-400"> TailwindCSS Test </div>
    <div>
      <a-button type="primary" @click="handleBtnClick">Primary Button</a-button>
    </div>
  </div>
</template>

<style scoped></style>
