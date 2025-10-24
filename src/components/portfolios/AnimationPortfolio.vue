/* ==========================================================================
3DPortfolio.vue - This component showcases a 3D portfolio.
========================================================================== */
<script setup lang="ts">
import { ref } from 'vue';
import boxFull from '../../assets/Maniorpedi/Box-full-2160.png';
import box3_4 from '../../assets/Maniorpedi/Box-lid-shot.png';
import satchet1 from '../../assets/Maniorpedi/Step-1-2160.png';
import satchet2 from '../../assets/Maniorpedi/Step-2-2160.png';
import satchet3 from '../../assets/Maniorpedi/Step-3-2160.png';
import satchetSpread from '../../assets/Maniorpedi/Sachet-spread-2160.png';
import whiskeyBottle from '../../assets/Whiskey-bottle.png';
import glass1 from '../../assets/Whiskey-glass.png';
import glass2 from '../../assets/Whiskey-glass-2.png';

const currentManiImage = ref(boxFull);
const currentWhiskeyImage = ref(whiskeyBottle);
const maniImages = [
  boxFull,
  box3_4,
  satchetSpread,
  satchet1,
  satchet2,
  satchet3,
];
let maniIndex = 0;
const whiskeyImages = [whiskeyBottle, glass1, glass2];

let whiskeyIndex = 0;

const findManiImage = (fwdBck: string) => {
  if (fwdBck === 'forward') {
    maniIndex++;
    if (maniIndex > maniImages.length - 1) {
      maniIndex = 0;
    }
  } else {
    maniIndex--;
    if (maniIndex < 0) {
      maniIndex = maniImages.length - 1;
    }
  }
  currentManiImage.value = maniImages[maniIndex];
};

const findWhiskeyImage = (fwdBck: string) => {
  if (fwdBck === 'forward') {
    whiskeyIndex++;
    if (whiskeyIndex > whiskeyImages.length - 1) {
      whiskeyIndex = 0;
    }
  } else {
    whiskeyIndex--;
    if (whiskeyIndex < 0) {
      whiskeyIndex = whiskeyImages.length - 1;
    }
  }
  currentWhiskeyImage.value = whiskeyImages[whiskeyIndex];
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
    class="cc-mt-4 cc-d-flex cc-flex-wrap cc-justify-center cc-bg-gray-light cc-border-radius-4 cc-p-6 cc-mx-6"
  >
    <div
      class="cc-w-100 cc-bg-white cc-box-shadow cc-border-radius-4 cc-mb-8 cc-p-4"
    >
      <img
        class="cc-border-radius-4"
        :src="currentWhiskeyImage"
        alt="Whiskey"
        width="auto"
        height="450"
      />
      <div class="cc-d-flex cc-justify-between cc-mb-4">
        <CCButton
          class="CC__button CC__purple cc-mb-4 cc-ml-8 cc-my-auto"
          @click="findWhiskeyImage('back')"
          >Previous</CCButton
        >

        <CCButton
          class="CC__button CC__purple cc-mb-4 cc-mr-8 cc-my-auto"
          @click="findWhiskeyImage('forward')"
          >Next</CCButton
        >
      </div>
      <p class="cc-px-8">
        Whiskey glasses and bottle, of my favorite Japanese whiskey, Habiki. I
        made this for practice with modeling patterns, glass, liquid, and
        photo-realistic lighting.
      </p>
    </div>
    <div
      class="cc-w-100 cc-bg-white cc-box-shadow cc-border-radius-4 cc-mb-8 cc-p-4"
    >
      <img
        class="cc-border-radius-4"
        src="../../assets/Honey.png"
        alt="Honey"
        width="auto"
        height="450"
      />
      <p class="cc-px-8">
        Honey comb I modeled and textured for practice with subsurface
        scattering and liquid simulations.
      </p>
    </div>
    <div class="cc-bg-white cc-box-shadow cc-border-radius-4 cc-mb-8 cc-p-4">
      <video
        id="redbull-animation"
        class="cc-border-radius-4"
        width="auto"
        height="450"
        preload="metadata"
        controls
        title="Redbull animation"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; "
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
        src="/media/Redbull-animation0001-0110.mp4"
        type="video/mp4"
      />
      <p class="cc-px-8">
        Four-second Redbull product teaser of my favorite flavor. I modeled the
        can, build the materials and UV maps, and lit the scene with a custom
        lighting setup.
      </p>
    </div>
    <div class="cc-bg-white cc-box-shadow cc-border-radius-4 cc-mb-8 cc-p-4">
      <img
        class="cc-border-radius-4 cc-mb-4"
        :src="currentManiImage"
        alt="Gumdrop"
        width="auto"
        height="450"
      />
      <div class="cc-d-flex cc-justify-between cc-mb-4">
        <CCButton
          class="CC__button CC__purple cc-mb-4 cc-ml-8 cc-my-auto"
          @click="findManiImage('back')"
          >Previous</CCButton
        >

        <CCButton
          class="CC__button CC__purple cc-mb-4 cc-mr-8 cc-my-auto"
          @click="findManiImage('forward')"
          >Next</CCButton
        >
      </div>
      <p class="">
        Freelance product modeling project for Maniorpedi, a Manicure and
        Pedicure product company. Goal of acheiving photo-realism of the product
        in use with social media and online product listings.
      </p>
    </div>
    <div class="cc-bg-white cc-box-shadow cc-border-radius-4 cc-mb-8 cc-p-4">
      <video
        class="cc-border-radius-4"
        width="auto"
        height="450"
        preload="metadata"
        controls
        title="Ear buds"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; "
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
        src="/media/Ear-buds.mp4"
        type="video/mp4"
      />
      <p class="cc-px-8">
        Six-second product teaser created. I modeled the earbuds and case, built
        PBR shaders with custom textures, and lit the scene with a studio HDRI
        plus a rim light for contrast.
      </p>
    </div>
    <div class="cc-bg-white cc-box-shadow cc-border-radius-4 cc-mb-8 cc-p-4">
      <video
        class="sword-in-stone cc-border-radius-4"
        width="50%"
        height="auto"
        preload="metadata"
        controls
        title="Ear buds"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; "
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
        src="/media/Sword-in-stone.mp4"
        type="video/mp4"
      />
      <p class="cc-p-4">
        Three second animation of a magical sword in a stone, created in
        Blender: I modeled the sword and stone, the cave surrounding, added
        ambient occlusion and dust particles.
      </p>
    </div>

    <div
      class="cc-bg-white cc-box-shadow cc-border-radius-4 cc-mb-8 cc-p-4 cc-w-100"
    >
      <img
        class="cc-border-radius-4"
        src="../../assets/Gumdrop.png"
        alt="Gumdrop"
        width="auto"
        height="450"
      />
      <p class="">
        Gumdrop I modeled and textured with geometry nodes to create the sugar
        effect.
      </p>
    </div>
    <div
      class="cc-bg-white cc-box-shadow cc-border-radius-4 cc-mb-8 cc-p-4 cc-w-100"
    >
      <video
        class="cc-border-radius-4"
        width="100%"
        height="450"
        preload="metadata"
        controls
        title="Ear buds"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; "
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
        src="/media/m1911.mp4"
        type="video/mp4"
      />
      <p class="">
        Three second animation of a M1911 pistol, game ready asset that I
        modeled, rigged and animated in Blender with custom texture maps.
      </p>
    </div>
    <div
      class="cc-bg-white cc-box-shadow cc-border-radius-4 cc-mb-8 cc-p-4 cc-w-100"
    >
      <img
        class="cc-border-radius-4"
        src="../../assets/PokeBall.png"
        alt="Pokeball"
        width="auto"
        height="450"
      />
      <p class="">
        Old Pokeball I modeled and textured with emission shaders creating the
        levitation effect.
      </p>
    </div>
  </div>
</template>
/* Styles ================================================================ */
<style lang="postcss">
h1 {
  font-size: 3rem;
  text-align: center;
  font-weight: 700;
  margin-bottom: 1rem;
}

@media (max-width: 900px) {
  h1 {
    font-size: 2rem;
  }
  video {
    height: auto;
    width: 100%;
  }
  img {
    height: auto;
    width: 100%;
  }
  .sword-in-stone {
    width: 50%;
  }
}

@media (max-width: 650px) {
  .sword-in-stone {
    width: 100%;
  }
}
</style>
