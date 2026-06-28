<script setup lang="ts">
import { computed } from 'vue';
import { useSpaceWeatherDashboard } from '../../stores/useSpaceWeatherDashboard';
import { narrateSolar } from '../../utils/layerNarratives';
import LayerInsight from './LayerInsight.vue';
import LayerDetails from './LayerDetails.vue';
import MetricStat from './MetricStat.vue';
import DataTable from './DataTable.vue';

const store = useSpaceWeatherDashboard();
const layer = computed(() => store.solar);

const narrative = computed(() =>
  layer.value.data ? narrateSolar(layer.value.data) : null
);

function formatTime(iso: string) {
  return new Date(iso).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
</script>

<template>
  <section class="layer-content">
    <div v-if="layer.status === 'loading' && !layer.data" class="skeleton" />

    <p v-else-if="layer.status === 'error'" class="layer-error">
      Could not load solar data. Try reloading the page.
    </p>

    <template v-else-if="layer.data && narrative">
      <LayerInsight :narrative="narrative" />

      <LayerDetails>
        <div class="metrics-grid">
          <MetricStat
            label="Solar wind speed"
            :value="layer.data.latestWindSpeed ?? '—'"
            unit="km/s"
          />
          <MetricStat
            label="Recent flares (14d)"
            :value="layer.data.flares.length"
          />
          <MetricStat
            label="Recent CMEs (14d)"
            :value="layer.data.cmes.length"
          />
        </div>

        <div class="tables-grid">
          <DataTable title="Solar flares">
            <table v-if="layer.data.flares.length">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Peak</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="flare in layer.data.flares" :key="flare.id">
                  <td>{{ flare.classType }}</td>
                  <td>{{ formatTime(flare.peakTime) }}</td>
                  <td>{{ flare.sourceLocation }}</td>
                </tr>
              </tbody>
            </table>
            <p v-else class="empty">None reported in the last two weeks.</p>
          </DataTable>

          <DataTable title="Coronal mass ejections">
            <table v-if="layer.data.cmes.length">
              <thead>
                <tr>
                  <th>Start</th>
                  <th>Type</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cme in layer.data.cmes" :key="cme.id">
                  <td>{{ formatTime(cme.startTime) }}</td>
                  <td>{{ cme.type }}</td>
                  <td>{{ cme.note }}</td>
                </tr>
              </tbody>
            </table>
            <p v-else class="empty">None reported in the last two weeks.</p>
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

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
}

.tables-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 0.75rem;
  margin-top: 0.75rem;
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

.empty {
  color: var(--dash-muted);
  font-size: 0.875rem;
}
</style>
