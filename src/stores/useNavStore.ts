import { defineStore } from 'pinia';
import { shallowRef, type Component } from 'vue';
import type { NavStore } from '../types/NavStore';
import threeDPortfolio from '../components/portfolios/3dPortfolio.vue';
import ProjectList from '../components/pages/ProjectList.vue';

export const useNavStore = defineStore('navStore', (): NavStore => {
  const currentPortfolioView = shallowRef(threeDPortfolio as Component);
  const currentSoftwareSubView = shallowRef(ProjectList as Component);

  return {
    currentPortfolioView,
    currentSoftwareSubView,
  };
});
