/* ==========================================================================
Portfolio.vue - Portfolio view for showcasing creative work.
========================================================================== */
<script setup lang="ts">
import { shallowRef } from 'vue';
import AnimationPortfolio from '../components/portfolios/AnimationPortfolio.vue';
import SoftwareDevelopmentPortfolio from '../components/portfolios/SoftwareDevelopmentPortfolio.vue';
import GameDevelopmentPortfolio from '../components/portfolios/GameDevelopmentPortfolio.vue';
import Header from '../components/Header.vue';

const component = shallowRef(AnimationPortfolio);

const changePortfolio = (portfolioType: string) => {
  switch (portfolioType) {
    case 'software':
      component.value = SoftwareDevelopmentPortfolio;
      break;
    case 'animation':
      component.value = AnimationPortfolio;
      break;
    case 'game':
      component.value = GameDevelopmentPortfolio; // Placeholder for GameDevelopmentPortfolio
      break;
    default:
      component.value = AnimationPortfolio;
  }
};
</script>
/* Template ============================================================== */
<template>
  <div class="portfolio-view">
    <div class="cc-w-100">
      <Header />
    </div>
    <div class="portfolio-navigation cc-d-flex cc-gap-4 cc-justify-center">
      <CCButton
        class="CC__green"
        :disabled="component === AnimationPortfolio"
        @click="changePortfolio('animation')"
        >3D Portfolio</CCButton
      >
      <CCButton
        class="CC__purple"
        :disabled="component === SoftwareDevelopmentPortfolio"
        @click="changePortfolio('software')"
        >Software Development</CCButton
      >
      <CCButton
        class="CC__red"
        :disabled="component === GameDevelopmentPortfolio"
        @click="changePortfolio('game')"
        >Game Development</CCButton
      >
    </div>
    <div class="portfolio-content cc-my-10 cc-mx-auto cc-w-3/4">
      <component :is="component" />
    </div>
  </div>
</template>
/* Styles ================================================================ */
<style lang="postcss"></style>
