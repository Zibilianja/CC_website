/* ==========================================================================
Logo.vue - Modular logo to use wherever needed.
========================================================================== */
<script setup lang="ts">
import { ref } from 'vue';
import BlackCrowLogo from '~/assets/BlackCrowLogo.svg';
import WhiteRavenLogo from '~/assets/WhiteRavenLogo2.svg';

const emit = defineEmits(['update:darkModeToggle']);

const isDarkMode = ref(false);
const isFlipping = ref(false);
const isHintVisible = ref(false);

const toggleLogo = () => {
  if (isFlipping.value) return; // Prevent multiple clicks during animation

  isFlipping.value = true;

  setTimeout(() => {
    isDarkMode.value = !isDarkMode.value;
    isFlipping.value = false;
    emit('update:darkModeToggle', isDarkMode.value);
  }, 300); // Delay to allow the previous animation to finish
};

const toggleHint = () => {
  isHintVisible.value = true;
  if (isHintVisible.value) {
    setTimeout(() => {
      isHintVisible.value = false; // Hide hint after a short delay
    }, 2000); // Adjust the delay as needed
  }
};
</script>
/* Template ============================================================== */
<template>
  <div
    id="creative-corvid__logo-header-theme-toggle"
    class="CC__logo-header"
  >
    <button
      id="creative-corvid__logo-header"
      class="CC__logo-flip-container"
      @click="toggleLogo"
      @mouseover="toggleHint"
      aria-label="Toggle Theme"
      :class="{ 'is-flipping': isFlipping, 'is-dark-mode': isDarkMode }"
    >
      <img
        :src="BlackCrowLogo"
        alt="Black Crow Logo"
        class="CC__logo-face CC__logo-front CC__black-crow-logo"
      />
      <img
        :src="WhiteRavenLogo"
        alt="White Raven Logo"
        class="CC__logo-face CC__logo-back CC__white-crow-logo"
      />
    </button>
    <div
      v-if="isHintVisible"
      class="logo-hint"
    >
      * Click Crow to toggle Light / Dark Mode *
    </div>
  </div>
</template>
/* Styles ================================================================ */
<style lang="scss">
#creative-corvid__logo-header-theme-toggle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
  border: none;
  perspective: 1000px;
  margin: 0 auto;
  .logo-hint {
    font-size: 0.875rem;
    color: var(--CC-color-gray);
    margin-top: 0.5rem;
    margin-bottom: -1.6rem;
  }
}

.CC__logo-flip-container {
  width: 13rem;
  height: 13rem;
  border: 2px solid transparent;
  border-radius: 7rem;
  position: relative;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.6s ease-in-out;

  &.is-flipping {
    transform: rotateY(180deg);
  }
  &.is-dark-mode {
    transform: rotateY(180deg);
  }
  &:hover {
    border-color: var(--CC-color-focus);
  }
}

.CC__logo-face {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  backface-visibility: hidden;
  object-fit: contain;
  border-radius: 7rem;
}

.CC__logo-front {
  background-color: #fff;
  transform: rotateY(0deg);
}

.CC__logo-back {
  background-color: #121212;
  transform: rotateY(180deg);
}
</style>
