/* ==========================================================================
ProjectList.vue - This component displays a list of projects with links to view
them. ==========================================================================
*/
<script setup lang="ts">
const emit = defineEmits(['view-library', 'view-mind-signal']);
</script>
/* Template ============================================================== */
<template>
  <div class="software-development-portfolio">
    <div>
      <strong>Here are some of my software development projects:</strong>
    </div>
    <ul class="cc-mx-6">
      <li class="cc-my-2">
        <strong>Portfolio page, creativecorvid.com:</strong> This website was
        built in Vue3 with Typescript, PostCss, Scss and utilizing my npm
        component and style library. It showcases my 3D, software development
        and game development portfolios. Future plans include more game
        development projects, game ready assets for sale via subscription and
        one off purchases, as well as an ecommerce shop for my and my fiance's
        crafts and creations.
      </li>
      <li class="cc-my-2">
        <strong>CC Component Library:</strong> An NPM component and style
        library built with Vue3 and TypeScript. This library includes a variety
        of reusable components such as buttons, input fields, modals, and more,
        all styled with a cohesive design system. The library is designed to be
        easily integrated into any Vue3 project, providing developers with a
        consistent and efficient way to build user interfaces. Click
        <a
          href="https://www.npmjs.com/package/creativecorvidstylelibrary"
          target="_blank"
          >here</a
        >
        to view the library on npm.
      </li>

      <li class="cc-my-2">
        <strong>Mind Signal:</strong> A personal research project into exploring
        machine learning, natural language processing and AI. Utilizing Python,
        Mind Signal scrapes Reddit and 50 specific subreddits to analyze and
        categorize posts and comments to flag significant mental health
        concerns. Click <a @click="emit('view-mind-signal')">here</a> to learn
        more about it.
      </li>
    </ul>
    <p>
      For more details, visit my
      <a href="https://github.com/yourusername/your-repo">GitHub</a>
    </p>
  </div>
</template>
/* Styles ================================================================ */
<style lang="postcss"></style>
