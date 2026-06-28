<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import blackCrowLogo from '../../assets/BlackCrowLogo.svg';

const props = withDefaults(
  defineProps<{
    src: string;
    alt: string;
    maxHeight?: number;
    watermarkOpacity?: number;
    variant?: 'gallery' | 'lightbox' | 'thumb';
  }>(),
  { maxHeight: 720, watermarkOpacity: 0.2, variant: 'gallery' }
);

const canvasRef = ref<HTMLCanvasElement>();
let resizeObserver: ResizeObserver | null = null;

const LIGHTBOX_MAX_WIDTH = 1400;
const LIGHTBOX_CAPTION_RESERVE = 56;

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const getAvailableBounds = (canvas: HTMLCanvasElement) => {
  if (props.variant === 'lightbox') {
    const horizontalPad = 32;
    return {
      width: Math.min(window.innerWidth * 0.96, LIGHTBOX_MAX_WIDTH) - horizontalPad,
      height: window.innerHeight * 0.9 - LIGHTBOX_CAPTION_RESERVE,
    };
  }

  if (props.variant === 'thumb') {
    const thumb = canvas.closest('.gallery__thumb');
    const size = thumb?.clientWidth ?? 64;
    return { width: size, height: props.maxHeight };
  }

  const stage = canvas.closest('.gallery__stage');
  const stagePad = 48;
  return {
    width: Math.max((stage?.clientWidth ?? canvas.parentElement?.clientWidth ?? 0) - stagePad, 0),
    height: props.maxHeight,
  };
};

const getObserveTarget = (canvas: HTMLCanvasElement) => {
  if (props.variant === 'lightbox') return canvas.closest('.lightbox');
  if (props.variant === 'thumb') return canvas.closest('.gallery__thumb');
  return canvas.closest('.gallery__stage') ?? canvas.parentElement;
};

const draw = async () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const { width: availW, height: availH } = getAvailableBounds(canvas);
  if (availW < 2 || availH < 2) return;

  const [img, logo] = await Promise.all([
    loadImage(props.src),
    loadImage(blackCrowLogo),
  ]);

  const aspect = img.naturalWidth / img.naturalHeight;
  let drawW: number;
  let drawH: number;

  if (availW / availH > aspect) {
    drawH = availH;
    drawW = drawH * aspect;
  } else {
    drawW = availW;
    drawH = drawW / aspect;
  }

  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(drawW * dpr);
  canvas.height = Math.floor(drawH * dpr);
  canvas.style.width = `${drawW}px`;
  canvas.style.height = `${drawH}px`;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, drawW, drawH);
  ctx.drawImage(img, 0, 0, drawW, drawH);

  const wmSize = drawW * 0.2;
  const x = drawW * 0.88 - wmSize / 2;
  const y = drawH * 0.88 - wmSize / 2;
  ctx.globalAlpha = props.watermarkOpacity;
  ctx.drawImage(logo, x, y, wmSize, wmSize);
  ctx.globalAlpha = 1;
};

const scheduleDraw = async () => {
  await nextTick();
  draw();
  requestAnimationFrame(() => draw());
};

watch(() => [props.src, props.maxHeight, props.watermarkOpacity, props.variant], scheduleDraw);

const onWindowResize = () => {
  if (props.variant === 'lightbox') draw();
};

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const target = getObserveTarget(canvas);
  if (target) {
    resizeObserver = new ResizeObserver(() => draw());
    resizeObserver.observe(target);
  }

  if (props.variant === 'lightbox') {
    window.addEventListener('resize', onWindowResize);
  }

  scheduleDraw();
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  window.removeEventListener('resize', onWindowResize);
});
</script>

<template>
  <canvas
    ref="canvasRef"
    class="watermarked-image"
    :class="{ 'watermarked-image--lightbox': variant === 'lightbox' }"
    role="img"
    :aria-label="alt"
    @contextmenu.prevent
    @dragstart.prevent
  />
</template>

<style scoped>
.watermarked-image {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: var(--site-radius);
  -webkit-user-drag: none;
  user-select: none;
  -webkit-touch-callout: none;
}

.watermarked-image--lightbox {
  border-radius: var(--site-radius);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
}
</style>
