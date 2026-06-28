<script setup lang="ts">
import BlackCrowLogo from '../../assets/BlackCrowLogo.svg';

withDefaults(
  defineProps<{
    variant?: 'default' | 'light' | 'compact';
  }>(),
  { variant: 'default' }
);
</script>

<template>
  <img
    :src="BlackCrowLogo"
    alt=""
    class="watermark"
    :class="`watermark--${variant}`"
    aria-hidden="true"
  />
</template>

<style scoped>
.watermark {
  position: absolute;
  top: 88%;
  left: 88%;
  transform: translate(-50%, -50%);
  z-index: 2;
  width: 9rem;
  height: 9rem;
  opacity: 0.2;
  pointer-events: none;
  user-select: none;
}

.watermark--light {
  opacity: 0.28;
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.35));
}

.watermark--compact {
  top: 88%;
  left: 88%;
  width: 4.5rem;
  height: 4.5rem;
  opacity: 0.18;
}
</style>
