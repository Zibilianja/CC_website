<script setup lang="ts">
import ProjectList from '../pages/ProjectList.vue';
import CCDemo from '../pages/CCDemo.vue';
import MindSignal from '../pages/MindSignal.vue';
import { storeToRefs } from 'pinia';
import { useNavStore } from '../../stores/useNavStore';

const { currentSoftwareSubView } = storeToRefs(useNavStore());

const subTabs = [
  { id: 'projects', label: 'Projects', component: ProjectList },
  { id: 'demo', label: 'CC Component Demo', component: CCDemo },
  { id: 'mind-signal', label: 'Mind Signal', component: MindSignal },
];

const changeComponent = (componentType: string) => {
  switch (componentType) {
    case 'projects':
      currentSoftwareSubView.value = ProjectList;
      break;
    case 'demo':
      currentSoftwareSubView.value = CCDemo;
      break;
    case 'mind-signal':
      currentSoftwareSubView.value = MindSignal;
      break;
    default:
      currentSoftwareSubView.value = ProjectList;
  }
};

const isActiveSubTab = (tab: (typeof subTabs)[number]) =>
  currentSoftwareSubView.value === tab.component;
</script>

<template>
  <div class="software-portfolio">
    <header class="software-portfolio__header">
      <h2>Software Development</h2>
      <p>Applications, libraries, and research projects.</p>
    </header>

    <nav class="tab-bar tab-bar--compact" aria-label="Software portfolio sections">
      <button
        v-for="tab in subTabs"
        :key="tab.id"
        type="button"
        class="tab-bar__item"
        :class="{ 'tab-bar__item--active': isActiveSubTab(tab) }"
        @click="changeComponent(tab.id)"
      >
        {{ tab.label }}
      </button>
    </nav>

    <component
      :is="currentSoftwareSubView"
      :key="currentSoftwareSubView"
      @view-library="changeComponent('demo')"
      @view-mind-signal="changeComponent('mind-signal')"
    />
  </div>
</template>

<style scoped>
.software-portfolio__header {
  margin-bottom: 1.5rem;
}

.software-portfolio__header h2 {
  margin-bottom: 0.375rem;
}

.software-portfolio__header p {
  font-size: 0.9375rem;
}

.tab-bar--compact {
  margin-bottom: 1.5rem;
}
</style>
