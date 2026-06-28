<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import BlackCrowLogo from '../../assets/BlackCrowLogo.svg';

const route = useRoute();
const menuOpen = ref(false);

const navLinks = [
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/data-visualization', label: 'Data Visualization' },
  { to: '/shop', label: 'Shop' },
  { to: '/contact', label: 'Contact' },
];

const isActive = (path: string) => route.path === path;

const closeMenu = () => {
  menuOpen.value = false;
};
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner content-container">
      <router-link
        to="/"
        class="site-header__brand"
        aria-label="Creative Corvid — Home"
        @click="closeMenu"
      >
        <img
          :src="BlackCrowLogo"
          alt="Creative Corvid logo"
          class="site-header__logo"
        />
        <span class="site-header__name">Creative Corvid</span>
      </router-link>

      <button
        class="site-header__toggle"
        :aria-expanded="menuOpen"
        aria-controls="site-nav"
        aria-label="Toggle navigation menu"
        @click="menuOpen = !menuOpen"
      >
        <FontAwesomeIcon :icon="menuOpen ? 'times' : 'bars'" />
      </button>

      <nav
        id="site-nav"
        class="site-header__nav"
        :class="{ 'site-header__nav--open': menuOpen }"
      >
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="site-header__link"
          :class="{ 'site-header__link--active': isActive(link.to) }"
          @click="closeMenu"
        >
          {{ link.label }}
        </router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: color-mix(in srgb, var(--site-surface) 92%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--site-border);
}

.site-header::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  height: 14px;
  background: linear-gradient(
    to bottom,
    rgba(17, 17, 21, 0.12),
    transparent
  );
  pointer-events: none;
}

.site-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  height: var(--site-header-height);
}

.site-header__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--site-text);
  text-decoration: none;
  flex-shrink: 0;
}

.site-header__brand:hover {
  color: var(--site-text);
}

.site-header__logo {
  width: 2.5rem;
  height: 2.5rem;
}

.site-header__name {
  font-weight: 600;
  font-size: 1.0625rem;
  letter-spacing: -0.02em;
}

.site-header__toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: 1px solid var(--site-border);
  border-radius: var(--site-radius-sm);
  background: var(--site-surface);
  color: var(--site-text);
  cursor: pointer;
  transition: background var(--site-transition);
}

.site-header__toggle:hover {
  border-color: var(--site-text-muted);
}

.site-header__nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.site-header__link {
  padding: 0.5rem 1rem;
  border-radius: var(--site-radius-sm);
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--site-text-muted);
  text-decoration: none;
  transition: color var(--site-transition);
}

.site-header__link:hover {
  color: var(--site-text);
  background: transparent;
}

.site-header__link--active {
  color: var(--site-text);
  background: transparent;
  font-weight: 600;
  box-shadow: inset 0 -2px 0 var(--site-text);
}

@media (max-width: 768px) {
  .site-header__toggle {
    display: flex;
  }

  .site-header__name {
    display: none;
  }

  .site-header__nav {
    display: none;
    position: absolute;
    top: var(--site-header-height);
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 0.75rem;
    background: var(--site-surface);
    border-bottom: 1px solid var(--site-border);
    box-shadow: var(--site-shadow);
  }

  .site-header__nav--open {
    display: flex;
  }

  .site-header__link {
    padding: 0.75rem 1rem;
  }
}
</style>
