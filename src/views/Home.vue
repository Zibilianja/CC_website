<script setup lang="ts">
import Header from '../components/singletons/Header.vue';

const navCards = [
  {
    to: '/portfolio',
    title: 'Portfolio',
    description: '3D art, software projects, resume, and more.',
    icon: 'briefcase',
    accent: 'accent-plum',
  },
  {
    to: '/data-visualization',
    title: 'Data Visualization',
    description: 'API integrations and interactive data visualizations.',
    icon: 'chart-line',
    accent: 'accent-olive',
  },
  {
    to: '/shop',
    title: 'Shop',
    description: 'Handcrafted leather, woodwork, fly tying, and more.',
    icon: 'shop',
    accent: 'accent-amber',
  },
  {
    to: '/contact',
    title: 'Contact',
    description: 'Get in touch for collaborations or fly fishing tips.',
    icon: 'envelope',
    accent: 'accent-stone',
  },
];
</script>

<template>
  <Header />

  <main class="home page">
    <section class="hero">
      <p class="hero__eyebrow">Jonathan Fuller</p>
      <h1 class="hero__title">The Creative Corvid</h1>
      <p class="hero__tagline">
        Software engineer · 3D artist · Aspiring game developer
      </p>
      <p class="hero__bio">
        I collect skills to make and build things — like crows collect shiny
        things. This site is built with Vue 3, TypeScript, and my own
        <a
          href="https://www.npmjs.com/package/creativecorvidstylelibrary"
          target="_blank"
          rel="noopener noreferrer"
          class="text-link"
        >
          Creative Corvid Style Library
        </a>
        on npm.
      </p>
    </section>

    <section class="nav-cards" aria-label="Site navigation">
      <router-link
        v-for="card in navCards"
        :key="card.to"
        :to="card.to"
        class="nav-card card card--elevated"
        :class="card.accent"
      >
        <div class="nav-card__icon">
          <FontAwesomeIcon :icon="card.icon" />
        </div>
        <div class="nav-card__content">
          <h2 class="nav-card__title">{{ card.title }}</h2>
          <p class="nav-card__description">{{ card.description }}</p>
        </div>
        <FontAwesomeIcon icon="arrow-right" class="nav-card__arrow" />
      </router-link>
    </section>

    <section class="about">
      <h2>About</h2>
      <p>
        Visit the shop to see creations in leather working, wood working, fly
        tying, cross-stitch, guitar pedals, and more. I'm an avid fly fisherman
        — if you need guidance fishing Colorado, reach out. I'd be happy to
        help.
      </p>
    </section>
  </main>
</template>

<style scoped>
.hero {
  margin-bottom: 3rem;
  text-align: center;
}

.hero__eyebrow {
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--site-accent);
  margin-bottom: 0.5rem;
}

.hero__title {
  margin-bottom: 0.75rem;
}

.hero__tagline {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--site-text-secondary);
  margin-bottom: 1.25rem;
}

.hero__bio {
  max-width: 60ch;
  margin-left: auto;
  margin-right: auto;
  font-size: 1.0625rem;
  line-height: 1.7;
}

.nav-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 3rem;
}

.nav-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  text-decoration: none;
  color: inherit;
}

.nav-card:hover {
  color: inherit;
}

.nav-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: var(--site-radius);
  flex-shrink: 0;
  font-size: 1.125rem;
}

.accent-plum .nav-card__icon {
  background: var(--site-accent-subtle);
  color: var(--site-text);
}

.accent-olive .nav-card__icon {
  background: #eef0ea;
  color: #4a5240;
}

.accent-amber .nav-card__icon {
  background: #f5f0e6;
  color: #7a6340;
}

.accent-stone .nav-card__icon {
  background: var(--site-surface-muted);
  color: var(--site-text-secondary);
}

.nav-card__content {
  flex: 1;
  min-width: 0;
}

.nav-card__title {
  font-size: 1.0625rem;
  margin-bottom: 0.25rem;
}

.nav-card__description {
  font-size: 0.875rem;
  line-height: 1.5;
}

.nav-card__arrow {
  flex-shrink: 0;
  margin-top: 0.25rem;
  color: var(--site-text-muted);
  font-size: 0.875rem;
  transition:
    transform var(--site-transition),
    color var(--site-transition);
}

.nav-card:hover .nav-card__arrow {
  transform: translateX(3px);
  color: var(--site-accent);
}

.about {
  padding-top: 2rem;
  border-top: 1px solid var(--site-border);
  text-align: center;
}

.about h2 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

.about p {
  max-width: 65ch;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
}

@media (max-width: 640px) {
  .nav-cards {
    grid-template-columns: 1fr;
  }
}
</style>
