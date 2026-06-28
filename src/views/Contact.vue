<script setup lang="ts">
import Header from '../components/singletons/Header.vue';

const contactLinks = [
  {
    label: 'Email',
    value: 'j.fuller.e@gmail.com',
    href: 'mailto:j.fuller.e@gmail.com',
    icon: 'envelope',
  },
  {
    label: 'LinkedIn',
    value: 'j-fuller-e',
    href: 'https://www.linkedin.com/in/j-fuller-e',
    icon: ['fab', 'linkedin'],
    external: true,
  },
  {
    label: 'GitHub',
    value: 'Zibilianja',
    href: 'https://www.github.com/Zibilianja',
    icon: ['fab', 'github'],
    external: true,
  },
];
</script>

<template>
  <Header />

  <main class="contact page">
    <header class="page-header page-header--center">
      <h1>Contact</h1>
      <p>
        Interested in collaborating, have a project in mind, or want fly fishing
        advice? I'd love to hear from you.
      </p>
    </header>

    <div class="contact-grid">
      <a
        v-for="link in contactLinks"
        :key="link.label"
        :href="link.href"
        class="contact-card card card--elevated"
        :target="link.external ? '_blank' : undefined"
        :rel="link.external ? 'noopener noreferrer' : undefined"
      >
        <div class="contact-card__icon">
          <FontAwesomeIcon :icon="link.icon" />
        </div>
        <div class="contact-card__content">
          <span class="contact-card__label">{{ link.label }}</span>
          <span class="contact-card__value">{{ link.value }}</span>
        </div>
        <FontAwesomeIcon icon="arrow-right" class="contact-card__arrow" />
      </a>
    </div>
  </main>
</template>

<style scoped>
.contact-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 32rem;
  margin: 0 auto;
}

.contact-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  text-decoration: none;
  color: inherit;
}

.contact-card:hover {
  color: inherit;
}

.contact-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: var(--site-radius);
  background: var(--site-accent-subtle);
  color: var(--site-accent);
  font-size: 1.125rem;
  flex-shrink: 0;
}

.contact-card__content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.contact-card__label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--site-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.contact-card__value {
  font-size: 1rem;
  font-weight: 500;
  color: var(--site-text);
}

.contact-card__arrow {
  flex-shrink: 0;
  color: var(--site-text-muted);
  font-size: 0.875rem;
  transition:
    transform var(--site-transition),
    color var(--site-transition);
}

.contact-card:hover .contact-card__arrow {
  transform: translateX(3px);
  color: var(--site-accent);
}
</style>
