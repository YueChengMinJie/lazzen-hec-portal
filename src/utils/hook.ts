import { message } from 'ant-design-vue';
import { useIntervalFn } from '@vueuse/shared';

export function useDomainCode() {
  const route = useRoute();
  const domainCode = route.query.domainCode as string;

  onMounted(() => {
    if (!domainCode) {
      message.error('请选择设备');
    }
  });

  return domainCode;
}

export function useData(
  domainCode: string,
  loadData: () => Promise<boolean>,
): { pause: () => void; resume: () => void } {
  const { pause, resume } = useIntervalFn(
    async () => {
      await loadData();
    },
    60 * 1000,
    { immediate: false },
  );

  onMounted(async () => {
    if (domainCode) {
      const success = await loadData();
      if (success) {
        resume();
      }
    }
  });

  onUnmounted(() => {
    pause();
  });

  return {
    resume,
    pause,
  };
}
