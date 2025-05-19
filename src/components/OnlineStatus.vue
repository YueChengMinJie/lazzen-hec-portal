<script setup lang="ts">
  const props = defineProps({
    online: {
      type: Boolean,
      default: false,
    },
    showContinent: {
      type: Boolean,
      default: true,
    },
  });
</script>

<template>
  <div :class="props.showContinent ? (props.online ? 'status-c-online' : 'status-c') : ''">
    <em :class="props.online ? 'status-online' : 'status'" />
    {{ props.online ? '在线' : '离线' }}
  </div>
</template>

<style scoped>
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
</style>
