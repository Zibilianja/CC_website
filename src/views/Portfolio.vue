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
      <Header>
        <a
          class="cc-mr-6"
          :class="component === AnimationPortfolio ? 'active-anchor' : ''"
          :disabled="component === AnimationPortfolio"
          @click="changePortfolio('animation')"
          >3D Portfolio</a
        >
        <a
          :class="
            component === SoftwareDevelopmentPortfolio ? 'active-anchor' : ''
          "
          :disabled="component === SoftwareDevelopmentPortfolio"
          @click="changePortfolio('software')"
          >Software Development</a
        >
        <a
          class="cc-ml-6"
          :class="component === GameDevelopmentPortfolio ? 'active-anchor' : ''"
          :disabled="component === GameDevelopmentPortfolio"
          @click="changePortfolio('game')"
          >Game Development</a
        >
      </Header>
    </div>
    <div
      class="portfolio-navigation cc-d-flex cc-gap-4 cc-justify-center"
    ></div>
    <div class="portfolio-content cc-my-10 cc-mx-auto cc-w-3/4">
      <component :is="component" />
    </div>
  </div>
</template>
/* Styles ================================================================ */
<style lang="postcss">
a {
  color: #078a62;
}
.active-anchor {
  color: var(--CC-color-primary);
  text-decoration: underline;
  pointer-events: none;
}
a:hover {
  cursor: pointer;
  text-decoration: underline;
  color: var(--CC-color-green-light);
}
</style>
