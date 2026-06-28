<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import boxFull from '../../assets/Maniorpedi/Box-full-2160.png';
import box3_4 from '../../assets/Maniorpedi/Box-lid-shot.png';
import satchet1 from '../../assets/Maniorpedi/Step-1-2160.png';
import satchet2 from '../../assets/Maniorpedi/Step-2-2160.png';
import satchet3 from '../../assets/Maniorpedi/Step-3-2160.png';
import satchetSpread from '../../assets/Maniorpedi/Sachet-spread-2160.png';
import whiskeyBottle from '../../assets/Whiskey-bottle.png';
import glass1 from '../../assets/Whiskey-glass.png';
import glass2 from '../../assets/Whiskey-glass-2.png';
import honey from '../../assets/Honey.png';
import redBullVid from '/media/Redbull-animation0001-0110.mp4';
import earBuds from '/media/Ear-buds.mp4';
import sword from '/media/Sword-in-stone.mp4';
import gumDrop from '../../assets/Gumdrop.png';
import m1911 from '/media/m1911.mp4';
import pokeBall from '../../assets/PokeBall.png';
import GalleryWatermark from './GalleryWatermark.vue';
import WatermarkedImage from './WatermarkedImage.vue';

const content = [
  {
    type: 'image',
    src: whiskeyBottle,
    title: 'Japanese Whiskey Set',
    description:
      'Whiskey glasses and bottle, of my favorite Japanese whiskey, Habiki. I made this for practice with modeling patterns, glass, liquid, and photo-realistic lighting.',
  },
  {
    type: 'image',
    src: glass1,
    title: 'Japanese Whiskey Set',
    description:
      'Whiskey glasses and bottle, of my favorite Japanese whiskey, Habiki. I made this for practice with modeling patterns, glass, liquid, and photo-realistic lighting.',
  },
  {
    type: 'image',
    src: glass2,
    title: 'Japanese Whiskey Set',
    description:
      'Whiskey glasses and bottle, of my favorite Japanese whiskey, Habiki. I made this for practice with modeling patterns, glass, liquid, and photo-realistic lighting.',
  },
  {
    type: 'image',
    src: boxFull,
    title: 'Maniorpedi Packaging Design',
    description:
      'Freelance product modeling project for Maniorpedi, a Manicure and Pedicure product company. Goal of acheiving photo-realism of the product in use with social media and online product listings.',
  },
  {
    type: 'image',
    src: box3_4,
    title: 'Maniorpedi Packaging Design',
    description:
      'Freelance product modeling project for Maniorpedi, a Manicure and Pedicure product company. Goal of acheiving photo-realism of the product in use with social media and online product listings.',
  },
  {
    type: 'image',
    src: satchetSpread,
    title: 'Maniorpedi Packaging Design',
    description:
      'Freelance product modeling project for Maniorpedi, a Manicure and Pedicure product company. Goal of acheiving photo-realism of the product in use with social media and online product listings.',
  },
  {
    type: 'image',
    src: satchet1,
    title: 'Maniorpedi Packaging Design',
    description:
      'Freelance product modeling project for Maniorpedi, a Manicure and Pedicure product company. Goal of acheiving photo-realism of the product in use with social media and online product listings.',
  },
  {
    type: 'image',
    src: satchet2,
    title: 'Maniorpedi Packaging Design',
    description:
      'Freelance product modeling project for Maniorpedi, a Manicure and Pedicure product company. Goal of acheiving photo-realism of the product in use with social media and online product listings.',
  },
  {
    type: 'image',
    src: satchet3,
    title: 'Maniorpedi Packaging Design',
    description:
      'Freelance product modeling project for Maniorpedi, a Manicure and Pedicure product company. Goal of acheiving photo-realism of the product in use with social media and online product listings.',
  },
  {
    type: 'video',
    src: redBullVid,
    title: 'Red Bull Can Animation',
    description:
      'An animation showcasing a Red Bull can, focusing on smooth motion and realistic rendering.',
  },
  {
    type: 'image',
    src: honey,
    title: 'Honeycomb',
    description:
      '3D model of a honeycomb with realistic textures and lighting. Created to practice modeling transparent materials with subsurface scattering and liquid simulations.',
  },
  {
    type: 'image',
    src: gumDrop,
    title: 'Gum Drop Candy',
    description:
      'A colorful gum drop candy model designed to explore vibrant textures and playful shapes in 3D modeling.',
  },
  {
    type: 'video',
    src: earBuds,
    title: 'Earbuds Animation',
    description:
      'A dynamic animation of earbuds, highlighting intricate details and fluid movement.',
  },
  {
    type: 'video',
    src: sword,
    title: 'Sword in Stone Animation',
    description:
      'An epic animation of a sword embedded in a stone, emphasizing dramatic lighting and effects.',
  },
  {
    type: 'image',
    src: pokeBall,
    title: 'Poké Ball',
    description:
      'A detailed 3D model of a Poké Ball, showcasing skills in hard surface modeling and texturing.',
  },
  {
    type: 'video',
    src: m1911,
    title: 'M1911 Pistol Animation',
    description:
      'A detailed animation of the M1911 pistol, focusing on mechanical accuracy and realistic textures.',
  },
];

const displayIndex = ref(0);
const isLightboxOpen = ref(false);
const currentItem = computed(() => content[displayIndex.value]);
const isVideo = computed(() => currentItem.value.type === 'video');

const openLightbox = () => {
  isLightboxOpen.value = true;
};

const closeLightbox = () => {
  isLightboxOpen.value = false;
};

const onKeydown = (event: KeyboardEvent) => {
  if (!isLightboxOpen.value) return;

  if (event.key === 'Escape') {
    closeLightbox();
  } else if (event.key === 'ArrowLeft') {
    changeContent('back');
  } else if (event.key === 'ArrowRight') {
    changeContent('forward');
  }
};

watch(isLightboxOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : '';
});

onMounted(() => window.addEventListener('keydown', onKeydown));
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown);
  document.body.style.overflow = '';
});

const changeContent = (direction: 'forward' | 'back') => {
  if (direction === 'forward') {
    displayIndex.value = (displayIndex.value + 1) % content.length;
  } else {
    displayIndex.value =
      (displayIndex.value - 1 + content.length) % content.length;
  }
};

const goToIndex = (index: number) => {
  displayIndex.value = index;
};

const galleryMaxHeight = Math.min(
  Math.floor(window.innerHeight * 0.72),
  900
);
</script>

<template>
  <div class="gallery">
    <header class="gallery__header">
      <h2>3D Modeling &amp; Animation</h2>
      <p class="gallery__credit">
        All models, texturing and renders done in Blender 3D.
      </p>
      <p class="gallery__note">
        * If videos look over-saturated on Windows, try turning off AutoHDR.
      </p>
    </header>

    <div
      class="gallery__viewer card"
      @contextmenu.prevent
    >
      <div class="gallery__stage">
        <button
          v-if="!isVideo"
          type="button"
          class="gallery__stage-hitarea"
          aria-label="View full screen"
          @click="openLightbox"
          @contextmenu.prevent
        >
          <div class="gallery__media-frame">
            <WatermarkedImage
              :src="currentItem.src"
              :alt="currentItem.title"
              variant="gallery"
              :max-height="galleryMaxHeight"
            />
            <span class="gallery__expand-hint" aria-hidden="true">
              <FontAwesomeIcon icon="expand" />
            </span>
          </div>
        </button>

        <div
          v-else
          class="gallery__media-frame gallery__media-frame--video"
          @contextmenu.prevent
        >
          <video
            class="gallery__media gallery__media--protected"
            :src="currentItem.src"
            :key="currentItem.src"
            preload="metadata"
            controls
            controlsList="nodownload"
            disablePictureInPicture
            referrerpolicy="strict-origin-when-cross-origin"
            @dragstart.prevent
          />
          <GalleryWatermark />
          <button
            type="button"
            class="gallery__expand-btn"
            aria-label="View full screen"
            @click="openLightbox"
          >
            <FontAwesomeIcon icon="expand" />
          </button>
        </div>
      </div>

      <div class="gallery__controls">
        <button
          type="button"
          class="gallery__nav-btn"
          aria-label="Previous item"
          @click="changeContent('back')"
        >
          <FontAwesomeIcon icon="arrow-left" />
        </button>

        <span class="gallery__counter">
          {{ displayIndex + 1 }} / {{ content.length }}
        </span>

        <button
          type="button"
          class="gallery__nav-btn"
          aria-label="Next item"
          @click="changeContent('forward')"
        >
          <FontAwesomeIcon icon="arrow-right" />
        </button>
      </div>
    </div>

    <div class="gallery__info card">
      <h3>{{ currentItem.title }}</h3>
      <p>{{ currentItem.description }}</p>
    </div>

    <div class="gallery__thumbnails" role="tablist" aria-label="Gallery items">
      <button
        v-for="(item, index) in content"
        :key="index"
        type="button"
        role="tab"
        class="gallery__thumb"
        :class="{ 'gallery__thumb--active': index === displayIndex }"
        :aria-selected="index === displayIndex"
        :aria-label="`${item.title}, item ${index + 1}`"
        @click="goToIndex(index)"
        @contextmenu.prevent
      >
        <WatermarkedImage
          v-if="item.type === 'image'"
          :src="item.src"
          :alt="item.title"
          variant="thumb"
          :max-height="64"
          :watermark-opacity="0.18"
        />
        <span v-else class="gallery__thumb-video">
          <FontAwesomeIcon icon="caret-right" />
        </span>
        <GalleryWatermark v-if="item.type === 'video'" variant="compact" />
      </button>
    </div>
  </div>

  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="isLightboxOpen"
        class="lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="`${currentItem.title} — full screen view`"
        @click.self="closeLightbox"
      >
        <div class="lightbox__backdrop" aria-hidden="true" />

        <button
          type="button"
          class="lightbox__close"
          aria-label="Close full screen view"
          @click="closeLightbox"
        >
          <FontAwesomeIcon icon="times" />
        </button>

        <button
          type="button"
          class="lightbox__nav lightbox__nav--prev"
          aria-label="Previous item"
          @click="changeContent('back')"
        >
          <FontAwesomeIcon icon="arrow-left" />
        </button>

        <div class="lightbox__content">
          <div
            class="lightbox__media-frame"
            @contextmenu.prevent
          >
            <WatermarkedImage
              v-if="!isVideo"
              :src="currentItem.src"
              :alt="currentItem.title"
              variant="lightbox"
              :watermark-opacity="0.28"
            />
            <video
              v-else
              class="lightbox__media gallery__media--protected"
              :src="currentItem.src"
              :key="`lightbox-${currentItem.src}`"
              controls
              controlsList="nodownload"
              disablePictureInPicture
              autoplay
              referrerpolicy="strict-origin-when-cross-origin"
              @dragstart.prevent
            />
            <GalleryWatermark v-if="isVideo" variant="light" />
          </div>
          <p class="lightbox__caption">{{ currentItem.title }}</p>
        </div>

        <button
          type="button"
          class="lightbox__nav lightbox__nav--next"
          aria-label="Next item"
          @click="changeContent('forward')"
        >
          <FontAwesomeIcon icon="arrow-right" />
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.gallery__header {
  margin-bottom: 1.5rem;
}

.gallery__header h2 {
  margin-bottom: 0.5rem;
}

.gallery__credit {
  font-size: 0.9375rem;
  color: var(--site-text-secondary);
  margin-bottom: 0.375rem;
}

.gallery__note {
  font-size: 0.875rem;
  color: var(--site-text-muted);
}

.gallery__viewer {
  overflow: hidden;
  margin-bottom: 1rem;
}

.gallery__stage {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: min(72vh, 900px);
  padding: 1.5rem;
  background: var(--site-surface);
}

.gallery__stage-hitarea {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  cursor: zoom-in;
  border-radius: var(--site-radius);
}

.gallery__media-frame {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  line-height: 0;
}

.gallery__media-frame--video {
  max-width: 100%;
}

.gallery__stage-hitarea:hover .gallery__expand-hint,
.gallery__stage-hitarea:focus-visible .gallery__expand-hint,
.gallery__media-frame:hover .gallery__expand-hint {
  opacity: 1;
}

.gallery__expand-hint {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: var(--site-radius-sm);
  background: rgba(17, 17, 21, 0.65);
  backdrop-filter: blur(8px);
  color: white;
  font-size: 0.875rem;
  opacity: 0;
  transition: opacity var(--site-transition);
  pointer-events: none;
}

.gallery__expand-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: none;
  border-radius: var(--site-radius-sm);
  background: rgba(17, 17, 21, 0.65);
  backdrop-filter: blur(8px);
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background var(--site-transition);
}

.gallery__expand-btn:hover {
  background: rgba(17, 17, 21, 0.85);
}

.gallery__media {
  max-width: 100%;
  max-height: min(72vh, 900px);
  height: auto;
  border-radius: var(--site-radius);
  object-fit: contain;
}

.gallery__media--protected {
  -webkit-user-drag: none;
  user-select: none;
  -webkit-touch-callout: none;
}

.gallery__thumb :deep(.watermarked-image) {
  width: 100%;
  height: 100%;
  max-height: none;
  border-radius: 0;
  object-fit: cover;
}

.gallery__controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.25rem;
  border-top: 1px solid var(--site-border);
}

.gallery__nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--site-border);
  border-radius: var(--site-radius-sm);
  background: var(--site-surface);
  color: var(--site-text);
  cursor: pointer;
  transition:
    background var(--site-transition),
    border-color var(--site-transition);
}

.gallery__nav-btn:hover {
  border-color: var(--site-text-muted);
}

.gallery__counter {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--site-text-muted);
  font-variant-numeric: tabular-nums;
}

.gallery__info {
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.25rem;
}

.gallery__info h3 {
  margin-bottom: 0.5rem;
}

.gallery__info p {
  line-height: 1.6;
}

.gallery__thumbnails {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  scrollbar-width: thin;
}

.gallery__thumb {
  position: relative;
  flex-shrink: 0;
  width: 4rem;
  height: 4rem;
  padding: 0;
  border: 1px solid var(--site-border);
  border-radius: var(--site-radius-sm);
  background: var(--site-surface);
  cursor: pointer;
  overflow: hidden;
  transition: border-color var(--site-transition);
}

.gallery__thumb:hover {
  border-color: var(--site-text-muted);
}

.gallery__thumb--active {
  border: 2px solid var(--site-text);
}

.gallery__thumb-video {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--site-accent);
  font-size: 1.25rem;
}

@media (max-width: 640px) {
  .gallery__stage {
    min-height: 50vh;
    padding: 1rem;
  }

  .gallery__media {
    max-height: 50vh;
  }

  .gallery__expand-hint {
    opacity: 1;
  }
}

/* Lightbox theater view */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.lightbox__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(10, 15, 25, 0.72);
  backdrop-filter: blur(16px) saturate(120%);
  -webkit-backdrop-filter: blur(16px) saturate(120%);
}

.lightbox__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(96vw, 1400px);
  max-height: 90vh;
  animation: lightboxContentIn 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.lightbox__media-frame {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  line-height: 0;
}

.lightbox__media {
  max-width: min(96vw, 1400px);
  max-height: calc(90vh - 3.5rem);
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: var(--site-radius);
}

.lightbox__caption {
  margin-top: 1rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.4);
}

.lightbox__close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  color: white;
  font-size: 1.125rem;
  cursor: pointer;
  transition:
    background var(--site-transition),
    border-color var(--site-transition);
}

.lightbox__close:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.lightbox__nav {
  position: absolute;
  top: 50%;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transform: translateY(-50%);
  transition:
    background var(--site-transition),
    border-color var(--site-transition);
}

.lightbox__nav:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.lightbox__nav--prev {
  left: 1.25rem;
}

.lightbox__nav--next {
  right: 1.25rem;
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-active .lightbox__backdrop,
.lightbox-leave-active .lightbox__backdrop {
  transition: opacity 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

.lightbox-enter-from .lightbox__backdrop,
.lightbox-leave-to .lightbox__backdrop {
  opacity: 0;
}

@keyframes lightboxContentIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 640px) {
  .lightbox {
    padding: 1rem;
  }

  .lightbox__nav {
    width: 2.5rem;
    height: 2.5rem;
  }

  .lightbox__nav--prev {
    left: 0.5rem;
  }

  .lightbox__nav--next {
    right: 0.5rem;
  }
}
</style>
