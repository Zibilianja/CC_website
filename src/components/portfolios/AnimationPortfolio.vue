/* ==========================================================================
3DPortfolio.vue - This component showcases a 3D portfolio.
========================================================================== */
<script setup lang="ts"></script>
/* Template ============================================================== */
<template>
  <h1>3D Modeling and Animation Portfolio</h1>
  <div>
    Explore my collection of creative works and projects in 3D modeling and
    animation.
  </div>
  <div>
    If any of the videos look over saturated or over exposed: try turning off
    AutoHDR on windows machines.
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
        src="/media/Sword-in-stone.mp4"
        type="video/mp4"
      />
      <p class="cc-p-4">
        Three second animation of a magical sword in a stone, created in
        Blender: I modeled the sword and stone, the cave surrounding, added
        ambient occlusion and dust particles.
      </p>
    </div>
    <div class="cc-bg-white cc-box-shadow cc-border-radius-4 cc-my-10 cc-p-4">
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
<style lang="postcss"></style>
