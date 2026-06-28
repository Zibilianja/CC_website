<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import {
  Chart,
  LinearScale,
  PointElement,
  ScatterController,
  Tooltip,
  Legend,
} from 'chart.js';
import type { EarthquakeFeature } from '../../types/spaceWeather';
import { depthColorSmooth } from '../../utils/earthquake';
import { useUserLocale } from '../../composables/useUserLocale';

Chart.register(ScatterController, PointElement, LinearScale, Tooltip, Legend);

const props = defineProps<{
  earthquakes: EarthquakeFeature[];
  timeframeLabel?: string;
}>();

const { formatDepth, unitSystem } = useUserLocale();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const POINT_RADIUS = 3;

function buildChart() {
  if (!canvasRef.value) return;
  chart?.destroy();

  const filtered = props.earthquakes.filter((q) => q.magnitude >= 2.5);
  const maxDepth = Math.max(
    400,
    ...filtered.map((q) => Math.max(0, q.depthKm))
  );

  chart = new Chart(canvasRef.value, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: `Earthquakes (${props.timeframeLabel ?? 'selected period'})`,
          data: filtered.map((q) => ({
            x: new Date(q.time).getTime(),
            y: q.magnitude,
            depth: q.depthKm,
            place: q.place,
          })),
          backgroundColor: filtered.map((q) =>
            depthColorSmooth(q.depthKm, maxDepth)
          ),
          pointRadius: POINT_RADIUS,
          pointHoverRadius: POINT_RADIUS + 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label(ctx) {
              const raw = ctx.raw as { place: string; depth: number };
              return `${raw.place} · M${ctx.parsed.y} · ${formatDepth(raw.depth)}`;
            },
          },
        },
      },
      scales: {
        x: {
          type: 'linear',
          ticks: {
            callback(value) {
              return new Date(value).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
              });
            },
            color: '#6b7280',
          },
          grid: { color: '#2a2f3d' },
        },
        y: {
          min: 2,
          title: { display: true, text: 'Magnitude', color: '#a8adb8' },
          ticks: { color: '#6b7280' },
          grid: { color: '#2a2f3d' },
        },
      },
    },
  });
}

onMounted(buildChart);
onUnmounted(() => chart?.destroy());
watch(() => [props.earthquakes, unitSystem.value] as const, buildChart, { deep: true });
</script>

<template>
  <div class="viz-card">
    <div class="viz-card__header">
      <h4>Magnitude timeline ({{ timeframeLabel ?? '7 days' }})</h4>
      <p>Equal point size · color = depth (red shallow → blue deep)</p>
    </div>
    <div class="chart-wrap">
      <canvas ref="canvasRef" />
    </div>
  </div>
</template>

<style scoped>
.viz-card {
  border: 1px solid var(--dash-border);
  border-radius: var(--site-radius);
  background: var(--dash-surface);
  padding: 0.875rem 1rem 1rem;
}

.viz-card__header h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--dash-text);
}

.viz-card__header p {
  font-size: 0.75rem;
  color: var(--dash-muted);
  margin: 0.25rem 0 0.75rem;
}

.chart-wrap {
  height: 240px;
}
</style>
