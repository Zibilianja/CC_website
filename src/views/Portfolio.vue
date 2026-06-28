<script setup lang="ts">
import AnimationPortfolio from '../components/portfolios/AnimationPortfolio.vue';
import SoftwareDevelopmentPortfolio from '../components/portfolios/SoftwareDevelopmentPortfolio.vue';
import GameDevelopmentPortfolio from '../components/portfolios/GameDevelopmentPortfolio.vue';
import Resume from '../components/portfolios/Resume.vue';
import Header from '../components/singletons/Header.vue';
import { useNavStore } from '../stores/useNavStore';
import { storeToRefs } from 'pinia';
import ProjectList from '../components/pages/ProjectList.vue';
import ThreeDPortfolio from '../components/portfolios/3dPortfolio.vue';

const { currentPortfolioView, currentSoftwareSubView } = storeToRefs(
  useNavStore()
);

const tabs = [
  { id: 'animation', label: '3D Portfolio', component: ThreeDPortfolio },
  {
    id: 'software',
    label: 'Software',
    component: SoftwareDevelopmentPortfolio,
  },
  { id: 'game', label: 'Game Dev', component: GameDevelopmentPortfolio },
  { id: 'resume', label: 'Resume', component: Resume },
];

const changePortfolio = (portfolioType: string) => {
  switch (portfolioType) {
    case 'software':
      currentPortfolioView.value = SoftwareDevelopmentPortfolio;
      break;
    case 'animation':
      currentPortfolioView.value = ThreeDPortfolio;
      break;
    case 'game':
      currentPortfolioView.value = GameDevelopmentPortfolio;
      currentSoftwareSubView.value = ProjectList;
      break;
    case 'resume':
      currentPortfolioView.value = Resume;
      break;
  }
};

const isActiveTab = (tab: (typeof tabs)[number]) => {
  if (tab.id === 'animation') {
    return (
      currentPortfolioView.value === ThreeDPortfolio ||
      currentPortfolioView.value === AnimationPortfolio
    );
  }
  return currentPortfolioView.value === tab.component;
};
</script>

<template>
  <Header />

  <main class="portfolio-view page">
    <header class="page-header page-header--center">
      <h1>Portfolio</h1>
      <p>Explore my work across 3D art, software development, and more.</p>
    </header>

    <nav class="tab-bar" aria-label="Portfolio sections">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="tab-bar__item"
        :class="{ 'tab-bar__item--active': isActiveTab(tab) }"
        @click="changePortfolio(tab.id)"
      >
        {{ tab.label }}
      </button>
    </nav>

    <div class="portfolio-content">
      <component :is="currentPortfolioView" />
    </div>
  </main>
</template>

<style scoped>
.portfolio-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
