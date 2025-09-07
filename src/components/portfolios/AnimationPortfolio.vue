/* ==========================================================================
3DPortfolio.vue - This component showcases a 3D portfolio.
========================================================================== */
<script setup lang="ts"></script>
/* Template ============================================================== */
<template>
  <h1>3D Modeling and Animation Portfolio</h1>
  <div>Explore my collection of creative works and projects.</div>
  <div>
    If any of the videos look over saturated or over exposed: try turning off
    AutoHDR on windows machines.
  </div>
  <div class="cc-w-100 cc-d-flex cc-flex-wrap cc-justify-center">
    <div class="cc-my-10 cc-w-100">
      <video
        width="auto"
        height="650"
        preload="metadata"
        controls
        title="Ear buds"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; "
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
        src="/media/Ear-buds.mp4"
      />
      <p>
        Six-second product teaser created. I modeled the earbuds and case, built
        PBR shaders with custom textures, and lit the scene with a studio HDRI
        plus a rim light for contrast.
      </p>
    </div>
    <div class="cc-my-10">
      <video
        width="auto"
        height="700"
        preload="metadata"
        controls
        title="Ear buds"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; "
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
        src="/media/Sword-in-stone.mp4"
      />
      <p>
        Three second animation of a magical sword in a stone, created in
        Blender: I modeled the sword and stone, the cave surrounding, added
        ambient occlusiona and dust particles.
      </p>
    </div>
    <div>
      <img
        src="../../public/media/Pokeball.png"
        alt="Pokeball"
        width="auto"
        height="691"
      />
      <p>
        Old Pokeball I modeled and textured with emission shaders creating the
        levitation effect.
      </p>
    </div>
  </div>
</template>
/* Styles ================================================================ */
<style lang="postcss"></style>
