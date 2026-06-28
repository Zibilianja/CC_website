import { onUnmounted, ref, watch, type ComputedRef, type Ref } from 'vue';

export function useAlertCarousel(
  itemCount: Ref<number> | ComputedRef<number>,
  intervalMs = 7000
) {
  const activeIndex = ref(0);
  const paused = ref(false);
  let timer: ReturnType<typeof setInterval> | null = null;

  function clearTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function startTimer() {
    clearTimer();
    if (paused.value || itemCount.value <= 1) return;
    timer = setInterval(() => {
      activeIndex.value = (activeIndex.value + 1) % itemCount.value;
    }, intervalMs);
  }

  function pause() {
    paused.value = true;
    clearTimer();
  }

  function play() {
    if (itemCount.value <= 1) return;
    paused.value = false;
    startTimer();
  }

  function select(index: number) {
    if (itemCount.value === 0) return;
    activeIndex.value = ((index % itemCount.value) + itemCount.value) % itemCount.value;
    pause();
  }

  function prev() {
    if (itemCount.value === 0) return;
    activeIndex.value =
      (activeIndex.value - 1 + itemCount.value) % itemCount.value;
    pause();
  }

  function next() {
    if (itemCount.value === 0) return;
    activeIndex.value = (activeIndex.value + 1) % itemCount.value;
    pause();
  }

  watch(itemCount, (count) => {
    if (activeIndex.value >= count) activeIndex.value = 0;
    if (!paused.value) startTimer();
    else clearTimer();
  });

  watch(paused, (isPaused) => {
    if (isPaused) clearTimer();
    else startTimer();
  });

  startTimer();

  onUnmounted(clearTimer);

  return {
    activeIndex,
    paused,
    select,
    prev,
    next,
    play,
    pause,
  };
}
