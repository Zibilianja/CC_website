<script setup lang="ts">
import { defineAsyncComponent, computed } from 'vue';
import { useSpaceWeatherDashboard } from '../../stores/useSpaceWeatherDashboard';
import { narrateAurora } from '../../utils/layerNarratives';
import LayerInsight from './LayerInsight.vue';
import LayerDetails from './LayerDetails.vue';
import DataTable from './DataTable.vue';

const AuroraGlobe = defineAsyncComponent(() => import('./AuroraGlobe.vue'));
const AuroraViewMap = defineAsyncComponent(() => import('./AuroraViewMap.vue'));
const AuroraCityBars = defineAsyncComponent(() => import('./AuroraCityBars.vue'));

const store = useSpaceWeatherDashboard();
const layer = computed(() => store.aurora);

const narrative = computed(() =>
  layer.value.data ? narrateAurora(layer.value.data) : null
);
</script>

<template>
  <section class="layer-content">
    <div v-if="layer.status === 'loading' && !layer.data" class="skeleton" />

    <p v-else-if="layer.status === 'error'" class="layer-error">
      Could not load aurora data. Try reloading the page.
    </p>

    <template v-else-if="layer.data && narrative">
      <LayerInsight :narrative="narrative" />

      <div class="aurora-layout">
        <div class="aurora-layout__row">
          <AuroraGlobe :activity-points="layer.data.activityPoints" />
          <AuroraCityBars
            :points="layer.data.ovationPoints"
            :max-intensity="layer.data.maxIntensity"
          />
        </div>

        <AuroraViewMap
          :points="layer.data.ovationPoints"
          :max-intensity="layer.data.maxIntensity"
        />
      </div>

      <LayerDetails label="View visibility details">
        <div class="tables-grid">
          <DataTable title="Northern visibility">
            <ul class="viewline-list">
              <li v-for="(line, i) in layer.data.viewlineNorth" :key="i">
                {{ line }}
              </li>
            </ul>
          </DataTable>

          <DataTable title="Southern visibility">
            <ul class="viewline-list">
              <li v-for="(line, i) in layer.data.viewlineSouth" :key="i">
                {{ line }}
              </li>
            </ul>
          </DataTable>
        </div>
      </LayerDetails>
    </template>
  </section>
</template>

<style scoped>
.layer-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.aurora-layout {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.aurora-layout__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  align-items: stretch;
  min-height: 28rem;
}

.tables-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
}

.viewline-list {
  margin: 0;
  padding-left: 1.125rem;
  color: var(--dash-text-secondary);
  font-size: 0.875rem;
}

.viewline-list li + li {
  margin-top: 0.375rem;
}

.skeleton {
  height: 6rem;
  border-radius: var(--site-radius);
  background: var(--dash-border);
  opacity: 0.4;
}

.layer-error {
  color: var(--dash-danger);
  font-size: 0.9375rem;
}

@media (max-width: 768px) {
  .aurora-layout__row {
    grid-template-columns: 1fr;
    min-height: 0;
  }
}
</style>
