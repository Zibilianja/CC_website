<script setup lang="ts">
import { computed } from 'vue';
import { useSpaceWeatherDashboard } from '../../stores/useSpaceWeatherDashboard';
import { narrateMagnetosphere } from '../../utils/layerNarratives';
import LayerInsight from './LayerInsight.vue';
import LayerDetails from './LayerDetails.vue';
import MetricStat from './MetricStat.vue';
import DataTable from './DataTable.vue';

const store = useSpaceWeatherDashboard();
const layer = computed(() => store.magnetosphere);

const narrative = computed(() =>
  layer.value.data ? narrateMagnetosphere(layer.value.data) : null
);
</script>

<template>
  <section class="layer-content">
    <div v-if="layer.status === 'loading' && !layer.data" class="skeleton" />

    <p v-else-if="layer.status === 'error'" class="layer-error">
      Could not load magnetosphere data. Try reloading the page.
    </p>

    <template v-else-if="layer.data && narrative">
      <LayerInsight :narrative="narrative" />

      <LayerDetails>
        <div class="metrics-grid">
          <MetricStat
            label="Planetary Kp"
            :value="layer.data.latestKp ?? '—'"
            hint="0–9 scale"
          />
          <MetricStat label="Storm level" :value="layer.data.stormLevel" />
        </div>

        <DataTable title="3-day forecast scales">
          <table v-if="layer.data.scales.length">
            <thead>
              <tr>
                <th>Date</th>
                <th>Radio</th>
                <th>Radiation</th>
                <th>Geomagnetic</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(scale, i) in layer.data.scales" :key="i">
                <td>{{ scale.date }}</td>
                <td>{{ scale.radioBlackout }}</td>
                <td>{{ scale.solarRadiation }}</td>
                <td>{{ scale.geomagnetic }}</td>
              </tr>
            </tbody>
          </table>
        </DataTable>
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

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
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
</style>
