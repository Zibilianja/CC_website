import { onMounted, onUnmounted, ref } from 'vue';
import { LAYER_META } from '../constants/layerMeta';
import type { LayerId } from '../types/spaceWeather';

function activationLinePx(): number {
  const headerHeight = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--site-header-height')
  );
  return (Number.isFinite(headerHeight) ? headerHeight : 72) + 64;
}

export function useLayerScrollSpy() {
  const activeLayer = ref<LayerId>('solar');
  let suppressUntil = 0;
  let rafId = 0;

  function updateActiveLayer() {
    if (Date.now() < suppressUntil) return;

    const line = activationLinePx();
    let current: LayerId = LAYER_META[0].id;

    for (const meta of LAYER_META) {
      const el = document.getElementById(meta.id);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= line) {
        current = meta.id;
      }
    }

    activeLayer.value = current;
  }

  function onScroll() {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      updateActiveLayer();
    });
  }

  function navigateTo(id: LayerId) {
    activeLayer.value = id;
    suppressUntil = Date.now() + 900;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    updateActiveLayer();
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll);
    if (rafId) cancelAnimationFrame(rafId);
  });

  return { activeLayer, navigateTo };
}
