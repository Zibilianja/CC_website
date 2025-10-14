/* ==========================================================================
3DPortfolio.vue - This component showcases a 3D portfolio.
========================================================================== */
<script setup lang="ts">
import { ref } from 'vue';
import boxFull from '../../assets/Maniorpedi/Box-full.png';
import box3_4 from '../../assets/Maniorpedi/Box-3_4.png';
import satchet1 from '../../assets/Maniorpedi/Satchet-1.png';
import satchet2 from '../../assets/Maniorpedi/Satchet-2.png';
import satchet3 from '../../assets/Maniorpedi/Satchet-3.png';

const currentManiImage = ref(boxFull);
const maniImages = [boxFull, box3_4, satchet1, satchet2, satchet3];
let maniIndex = 0;

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
    <div class="cc-bg-white cc-box-shadow cc-border-radius-4 cc-mb-10 cc-p-4">
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
      <p class="">
        Six-second product teaser created. I modeled the earbuds and case, built
        PBR shaders with custom textures, and lit the scene with a studio HDRI
        plus a rim light for contrast.
      </p>
    </div>
    <div class="cc-bg-white cc-box-shadow cc-border-radius-4 cc-my-10 cc-p-4">
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
      class="cc-bg-white cc-box-shadow cc-border-radius-4 cc-my-10 cc-p-4 cc-w-75"
    >
      <div class="cc-d-flex cc-justify-evenly cc-mb-4">
        <CCButton
          class="CC__button CC__purple cc-mb-4 cc-mr-4 cc-my-auto"
          @click="findManiImage('back')"
          >Previous</CCButton
        >
        <img
          class="cc-border-radius-4"
          :src="currentManiImage"
          alt="Gumdrop"
          width="auto"
          height="450"
        />
        <CCButton
          class="CC__button CC__purple cc-mb-4 cc-mr-4 cc-my-auto"
          @click="findManiImage('forward')"
          >Next</CCButton
        >
      </div>
      <p class="">
        Freelance product modeling project for Maniorpedi, a Manicure and
        Pedicure product company. Goal of acheiving photo-realism of the
        prodcut.
      </p>
    </div>
    <div
      class="cc-bg-white cc-box-shadow cc-border-radius-4 cc-my-10 cc-p-4 cc-w-75"
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
    <div class="cc-bg-white cc-box-shadow cc-border-radius-4 cc-my-10 cc-p-4">
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
    <div class="cc-bg-white cc-box-shadow cc-border-radius-4 cc-my-10 cc-p-4">
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
