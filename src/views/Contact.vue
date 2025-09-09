/* ==========================================================================
Contact.vue - This is the contact page for Creative Corvid.
========================================================================== */
<script setup lang="ts"></script>
/* Template ============================================================== */
<template>
  <div class="contact">
    <router-link to="/">
      <CCButton class="CC__purple">Back To Home</CCButton>
    </router-link>
    <h1>Contact</h1>
    <p>If you would like to get in touch, feel free to reach out!</p>
    <div class="cc-row-gap-4 cc-d-flex cc-flex-column cc-mt-4">
      <div>
        Email: <a href="mailto:j.fuller.e@gmail.com">j.fuller.e@gmail.com</a>
      </div>
      <div>
        LinkedIn:
        <a
          href="https://www.linkedin.com/in/j-fuller-e"
          target="_blank"
          >View Profile</a
        >
      </div>
      <div>
        Github:
        <a
          href="https://www.github.com/Zibilianja"
          target="_blank"
          >View Profile</a
        >
      </div>
    </div>
  </div>
</template>
/* Styles ================================================================ */
<style lang="postcss"></style>
