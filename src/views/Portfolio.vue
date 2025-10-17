/* ==========================================================================
Portfolio.vue - Portfolio view for showcasing creative work.
========================================================================== */
<script setup lang="ts">
import AnimationPortfolio from '../components/portfolios/AnimationPortfolio.vue';
import SoftwareDevelopmentPortfolio from '../components/portfolios/SoftwareDevelopmentPortfolio.vue';
import GameDevelopmentPortfolio from '../components/portfolios/GameDevelopmentPortfolio.vue';
import Resume from '../components/portfolios/Resume.vue';
import Header from '../components/singletons/Header.vue';
import { useNavStore } from '../stores/useNavStore';
import { storeToRefs } from 'pinia';
import ProjectList from '../components/pages/ProjectList.vue';

const { currentPortfolioView, currentSoftwareSubView } = storeToRefs(
  useNavStore()
);

const changePortfolio = (portfolioType: string) => {
  switch (portfolioType) {
    case 'software':
      currentPortfolioView.value = SoftwareDevelopmentPortfolio;
      break;
    case 'animation':
      currentPortfolioView.value = AnimationPortfolio;
      break;
    case 'game':
      currentPortfolioView.value = GameDevelopmentPortfolio; // Placeholder for GameDevelopmentPortfolio
      currentSoftwareSubView.value = ProjectList;
      break;
    case 'resume':
      currentPortfolioView.value = Resume;
      break;
  }
};

console.log('Current Portfolio View:', currentPortfolioView.value);
</script>
/* Template ============================================================== */
<template>
  <div class="portfolio-view">
    <div class="cc-w-100">
      <Header>
        <a
          :class="
            currentPortfolioView === AnimationPortfolio ? 'active-anchor' : ''
          "
          :disabled="currentPortfolioView === AnimationPortfolio"
          @click="changePortfolio('animation')"
          >3D Portfolio</a
        >
        <a
          :class="
            currentPortfolioView === SoftwareDevelopmentPortfolio
              ? 'active-anchor'
              : ''
          "
          :disabled="currentPortfolioView === SoftwareDevelopmentPortfolio"
          @click="changePortfolio('software')"
          >Software Development</a
        >
        <a
          :class="
            currentPortfolioView === GameDevelopmentPortfolio
              ? 'active-anchor'
              : ''
          "
          :disabled="currentPortfolioView === GameDevelopmentPortfolio"
          @click="changePortfolio('game')"
          >Game Development</a
        >
        <a
          :class="currentPortfolioView === Resume ? 'active-anchor' : ''"
          :disabled="currentPortfolioView === Resume"
          @click="changePortfolio('resume')"
          >Resume</a
        >
      </Header>
    </div>
    <div
      class="portfolio-navigation cc-d-flex cc-gap-4 cc-justify-center"
    ></div>
    <div class="portfolio-content cc-my-10 cc-mx-auto cc-w-3/4">
      <component :is="currentPortfolioView" />
    </div>
  </div>
</template>
/* Styles ================================================================ */
<style lang="postcss">
.portfolio-view {
  a {
    color: var(--CC-color-focus-darker);
    font-weight: 600;
  }
  .active-anchor {
    color: var(--CC-color-success);
    text-decoration: underline;
    pointer-events: none;
  }
  a:hover {
    cursor: pointer;
    text-decoration: underline;
    color: var(--CC-color-gray-dark);
  }
}
</style>
