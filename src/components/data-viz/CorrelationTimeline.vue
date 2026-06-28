<script setup lang="ts">
import { computed } from 'vue';
import { useSpaceWeatherDashboard } from '../../stores/useSpaceWeatherDashboard';
import { buildCorrelationChain } from '../../utils/correlation';

const store = useSpaceWeatherDashboard();

const steps = computed(() =>
  buildCorrelationChain(
    store.solar.data,
    store.magnetosphere.data,
    store.aurora.data,
    store.troposphere.data,
    store.ground.data,
    store.subsurface.data
  )
);

const hasChain = computed(() => steps.value.length > 0);
</script>

<template>
  <section v-if="hasChain" class="correlation">
    <h3 class="correlation__title">Event propagation</h3>
    <p class="correlation__subtitle">
      How disturbances may cascade from the Sun toward the surface
    </p>
    <ol class="correlation__list">
      <li
        v-for="(step, index) in steps"
        :key="step.id"
        class="correlation__step"
        :class="{ 'correlation__step--active': step.active }"
      >
        <div class="correlation__marker">
          <span class="correlation__dot" />
          <span v-if="index < steps.length - 1" class="correlation__line" />
        </div>
        <div class="correlation__content">
          <span class="correlation__layer">{{ step.layer }}</span>
          <p class="correlation__label">{{ step.label }}</p>
          <span v-if="step.time" class="correlation__time">{{ step.time }}</span>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.correlation {
  margin: 2rem 0;
  padding: 1.5rem;
  border: 1px solid var(--dash-border);
  border-radius: var(--site-radius-lg);
  background: var(--dash-surface);
}

.correlation__title {
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--dash-text);
}

.correlation__subtitle {
  font-size: 0.875rem;
  color: var(--dash-muted);
  margin: 0.375rem 0 1.25rem;
}

.correlation__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.correlation__step {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
}

.correlation__marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0.25rem;
}

.correlation__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--dash-border);
  flex-shrink: 0;
}

.correlation__step--active .correlation__dot {
  background: var(--dash-accent);
  box-shadow: 0 0 8px var(--dash-accent);
}

.correlation__line {
  width: 2px;
  flex: 1;
  min-height: 1.5rem;
  margin: 0.25rem 0;
  background: var(--dash-border);
}

.correlation__content {
  padding-bottom: 1.25rem;
}

.correlation__layer {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--dash-accent);
}

.correlation__label {
  font-size: 0.9375rem;
  color: var(--dash-text);
  margin: 0.25rem 0 0;
}

.correlation__time {
  font-size: 0.75rem;
  color: var(--dash-muted);
}
</style>
