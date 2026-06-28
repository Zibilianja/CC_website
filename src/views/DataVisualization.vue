<script setup lang="ts">
import Header from '../components/singletons/Header.vue';
import SpaceWeatherDashboard from '../components/data-viz/SpaceWeatherDashboard.vue';
</script>

<template>
  <Header />

  <main class="page">
    <header class="page-header">
      <h1>Data Visualization</h1>
      <p>
        Multi-source API orchestration and live dashboard design — connecting
        space weather, atmospheric, and ground-level data into one narrative.
      </p>
    </header>

    <SpaceWeatherDashboard />
  </main>
</template>
