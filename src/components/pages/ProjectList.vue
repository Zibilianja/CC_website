<script setup lang="ts">
const emit = defineEmits(['view-library', 'view-mind-signal']);

const projects = [
  {
    title: 'creativecorvid.com',
    subtitle: 'Portfolio Website',
    description:
      'Built in Vue 3 with TypeScript, PostCSS, and my npm component library. Showcases 3D, software, and game development work. Future plans include game assets for sale and an ecommerce craft shop.',
    tags: ['Vue 3', 'TypeScript', 'Pinia'],
    link: null,
  },
  {
    title: 'CC Component Library',
    subtitle: 'NPM Package',
    description:
      'Reusable Vue 3 components and a cohesive design system — buttons, inputs, modals, and utility classes for consistent UIs.',
    tags: ['Vue 3', 'TypeScript', 'NPM'],
    link: 'https://www.npmjs.com/package/creativecorvidstylelibrary',
    external: true,
  },
  {
    title: 'Mind Signal',
    subtitle: 'ML / NLP Research',
    description:
      'Personal research project using Python to scrape Reddit and analyze posts across 50 subreddits, flagging significant mental health concerns.',
    tags: ['Python', 'NLP', 'Machine Learning'],
    action: 'mind-signal',
  },
  {
    title: 'DPS Enterprise Applications',
    subtitle: 'Denver Public Schools · 2023–2025',
    description:
      'Rebuilt legacy production apps for Colorado Dept. of Education and Transportation — serving 150,000+ users with Vue 3, TypeScript, C# .NET, custom pagination, and WCAG 2.2 compliance.',
    tags: ['Vue 3', 'C# .NET', 'Accessibility'],
    link: null,
  },
  {
    title: 'ProcedureCard',
    subtitle: 'Bitwise Industries · 2021–2023',
    description:
      'SaaS application for surgical procedural documentation — Angular/TypeScript frontend with Django backend. Helped hospitals streamline operating room inventory for surgeons.',
    tags: ['Angular', 'Django', 'TypeScript'],
    link: null,
  },
];

const handleAction = (action: string | undefined) => {
  if (action === 'mind-signal') emit('view-mind-signal');
};
</script>

<template>
  <div class="project-list">
    <article
      v-for="project in projects"
      :key="project.title"
      class="project-card card"
    >
      <div class="project-card__header">
        <div>
          <p class="project-card__subtitle">{{ project.subtitle }}</p>
          <h3 class="project-card__title">{{ project.title }}</h3>
        </div>
      </div>
      <p class="project-card__description">{{ project.description }}</p>
      <div class="project-card__footer">
        <div class="project-card__tags">
          <span
            v-for="tag in project.tags"
            :key="tag"
            class="project-card__tag"
          >
            {{ tag }}
          </span>
        </div>
        <a
          v-if="project.link"
          :href="project.link"
          target="_blank"
          rel="noopener noreferrer"
          class="project-card__link text-link"
        >
          View on npm
        </a>
        <button
          v-else-if="project.action"
          type="button"
          class="project-card__link-btn text-link"
          @click="handleAction(project.action)"
        >
          Learn more
        </button>
      </div>
    </article>

    <p class="project-list__footer">
      More on
      <a
        href="https://github.com/Zibilianja"
        target="_blank"
        rel="noopener noreferrer"
        class="text-link"
      >
        GitHub
      </a>
    </p>
  </div>
</template>

<style scoped>
.project-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.project-card {
  padding: 1.5rem;
}

.project-card__subtitle {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--site-accent);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.25rem;
}

.project-card__title {
  font-size: 1.125rem;
}

.project-card__description {
  margin: 0.75rem 0 1rem;
  line-height: 1.65;
  font-size: 0.9375rem;
}

.project-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.project-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.project-card__tag {
  padding: 0.25rem 0.625rem;
  background: var(--site-surface-muted);
  border: 1px solid var(--site-border);
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--site-text-secondary);
}

.project-card__link-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 0.9375rem;
}

.project-list__footer {
  text-align: center;
  margin-top: 0.5rem;
  font-size: 0.9375rem;
}
</style>
