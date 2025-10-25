/* ==========================================================================
3DPortfolio.vue - This component showcases a 3D portfolio.
========================================================================== */
<script setup lang="ts">
import { ref, computed } from 'vue';
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
const currentContent = computed(() => content[displayIndex.value].src);
const isVideo = computed(() => content[displayIndex.value].type === 'video');
const isImage = computed(() => content[displayIndex.value].type === 'image');

const changeContent = (fwdBck: string) => {
  if (fwdBck === 'forward') {
    displayIndex.value++;
    if (displayIndex.value > content.length - 1) {
      displayIndex.value = 0;
    }
  } else if (fwdBck === 'back') {
    displayIndex.value--;
    if (displayIndex.value < 0) {
      displayIndex.value = content.length - 1;
    }
  }
};
</script>
/* Template ============================================================== */
<template>
  <div class="title-wrapper cc-mx-4">
    <h1>3D Modeling and Animation Portfolio</h1>
    <div>
      Explore my collection of creative works and projects in 3D modeling and
      animation.
    </div>
    <div>
      If any of the videos look over saturated or over exposed: try turning off
      AutoHDR on windows machines.
    </div>
  </div>
  <div
    id="portfolio-content"
    class="cc-mt-4 cc-d-flex cc-flex-wrap cc-flex-column cc-justify-center cc-bg-gray cc-border-radius-4 cc-p-6 cc-mx-6"
  >
    <img
      id="portfolio-image"
      class="content cc-mx-auto"
      v-show="isImage"
      :src="currentContent"
      :alt="content[displayIndex].title"
    />
    <video
      id="portfolio-video"
      class="content cc-mx-auto"
      v-show="isVideo"
      :src="currentContent"
      width="auto"
      height="450"
      preload="metadata"
      controls
      title="Ear buds"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; "
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
      type="video/mp4"
    />

    <div class="cc-d-flex cc-justify-between cc-mt-6">
      <CCButton
        class="CC__button CC__purple cc-ml-8 cc-my-auto"
        @click="changeContent('back')"
        >Back</CCButton
      >

      <CCButton
        class="CC__button CC__green cc-mr-8 cc-my-auto"
        @click="changeContent('forward')"
        >Next</CCButton
      >
    </div>
    <div
      class="cc-w-75 cc-text-center cc-bg-gray-light cc-px-4 cc-border-radius-4 cc-mx-auto"
    >
      <h3>{{ content[displayIndex].title }}</h3>
      <p class="cc-w-80 cc-mx-auto">
        {{ content[displayIndex].description }}
      </p>
    </div>
  </div>
</template>
/* Styles ================================================================ */
<style lang="postcss">
#portfolio-content {
  max-width: 100%;
  height: fit-content;
  @media (min-width: 700px) {
    min-height: 720px;
  }
  @media (max-width: 700px) {
    min-height: 450px;
  }
  @media (max-width: 500px) {
    min-height: 250px;
  }
}
.content {
  margin: auto;
  border-radius: 1rem;
}
#portfolio-image {
  max-width: 80%;
  height: auto;
  max-height: 550px;
}
#portfolio-video {
  max-width: 80%;
  height: auto;
  max-height: 550px;
}
</style>
