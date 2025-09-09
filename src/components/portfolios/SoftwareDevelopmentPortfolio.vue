/* ==========================================================================
SoftwareDevelopmentPortfolio.vue - This component showcases a software
development portfolio.
========================================================================== */
<script setup lang="ts">
import ProjectList from '../pages/ProjectList.vue';
import SoftwareProjectNav from '../singletons/SoftwareProjectNav.vue';
import CCDemo from '../pages/CCDemo.vue';
import MindSignal from '../pages/MindSignal.vue';
import { storeToRefs } from 'pinia';
import { useNavStore } from '../../stores/useNavStore';

const { currentSoftwareSubView } = storeToRefs(useNavStore());

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
</script>
/* Template ============================================================== */
<template>
  <div class="cc-mb-4">
    <h2>Software Development Portfolio</h2>
    <div class="cc-w-75 cc-mx-auto">
      <SoftwareProjectNav>
        <a
          class="cc-mr-6"
          :class="currentSoftwareSubView === ProjectList ? 'active-anchor' : ''"
          :disabled="currentSoftwareSubView === ProjectList"
          @click="changeComponent('projects')"
          >Project List</a
        >
        <a
          class="cc-ml-6"
          :class="currentSoftwareSubView === CCDemo ? 'active-anchor' : ''"
          :disabled="currentSoftwareSubView === CCDemo"
          @click="changeComponent('demo')"
          >CC Component Demo</a
        >
        <a
          class="cc-ml-6"
          :class="currentSoftwareSubView === MindSignal ? 'active-anchor' : ''"
          :disabled="currentSoftwareSubView === MindSignal"
          @click="changeComponent('mind-signal')"
          >Mind Signal</a
        >
      </SoftwareProjectNav>
    </div>
    <component
      :is="currentSoftwareSubView"
      :key="currentSoftwareSubView"
      @view-library="changeComponent('demo')"
      @view-mind-signal="changeComponent('mind-signal')"
    />
  </div>
</template>
/* Styles ================================================================ */
<style lang="postcss"></style>
