<script setup lang="ts"></script>

<template>
  <div class="resume">
    <div class="resume__toolbar">
      <h2>Resume</h2>
      <a
        class="resume__download"
        href="JonFuller_Resume.docx (1).pdf"
        download="JonathanFuller_Resume.pdf"
      >
        <FontAwesomeIcon icon="download" />
        Download PDF
      </a>
    </div>

    <section class="resume__section">
      <h3 class="resume__section-title">Professional Experience</h3>

      <article class="resume__entry card">
        <div class="resume__entry-header">
          <h4>Software Developer</h4>
          <span class="resume__company">Denver Public Schools</span>
        </div>
        <p class="resume__meta">
          Enterprise Software Applications Team · 07/2023 – 07/2025
        </p>
        <p class="resume__summary">
          Build and maintain DPS custom applications, audit for accessibility
          compliance, and provide technical support.
        </p>
        <ul class="resume__bullets">
          <li>
            Rebuilt 4 enterprise applications — TypeScript/Vue3/Pinia, C# .NET
            for Colorado Dept. of Education and DPS Transportation, improving
            maintainability and ensuring WCAG 2.2 compliance for 150,000+
            district users.
          </li>
          <li>
            Designed and implemented a C# console app automating annual database
            rollovers, cutting a 2-day manual task down to less than 4 hours.
          </li>
          <li>
            Enhanced a shared Vue3 component library, improving performance and
            accessibility, saving 30% developer time on frontend work.
          </li>
          <li>
            Conducted accessibility audit of 70+ applications, identifying and
            remediating WCAG 2.2 issues with Accessibility Insights and Axe
            DevTools.
          </li>
        </ul>
      </article>

      <article class="resume__entry card">
        <div class="resume__entry-header">
          <h4>Software Developer</h4>
          <span class="resume__company">Bitwise Industries</span>
        </div>
        <p class="resume__meta">
          Technical Consulting Branch · Fresno, CA (Remote) · 08/2021 – 06/2023
        </p>
        <p class="resume__summary">
          Build and update client applications, collaborate as part of agile
          integrated team. Audit for accessibility compliance, and provide
          technical support.
        </p>
        <ul class="resume__bullets">
          <li>
            Developed frontend features in Angular, React, and TypeScript,
            following Agile methodologies for multiple client projects.
          </li>
          <li>
            Contributed to the finalization of ProcedureCard, a surgical
            inventory application, enhancing usability and scalability.
          </li>
          <li>
            Mentored 4 apprentices in QA automation and frontend best practices,
            accelerating onboarding and raising code quality across the team.
          </li>
        </ul>
      </article>

      <article class="resume__entry card">
        <div class="resume__entry-header">
          <h4>Therapist in Private Practice</h4>
          <span class="resume__company">All Grow Counseling</span>
        </div>
        <p class="resume__meta">Denver, CO · 2018 – 2021</p>
        <p class="resume__summary">
          Provide individual, couples and group therapy utilizing a transpersonal
          approach. Specializing in mindfulness-based CBT, trauma-informed care,
          and narrative therapy.
        </p>
      </article>
    </section>

    <section class="resume__section">
      <h3 class="resume__section-title">Education</h3>

      <article class="resume__entry card">
        <div class="resume__entry-header">
          <h4>Master of Arts — Clinical Mental Health Counseling</h4>
          <span class="resume__company">Naropa University</span>
        </div>
        <p class="resume__meta">Boulder, CO · 2015 – 2018 · Transpersonal Psychology</p>
      </article>

      <article class="resume__entry card">
        <div class="resume__entry-header">
          <h4>Bachelor of Arts — Psychology and Religion</h4>
          <span class="resume__company">University of Redlands</span>
        </div>
        <p class="resume__meta">Redlands, CA · 2007 – 2011</p>
      </article>
    </section>
  </div>
</template>

<style scoped>
.resume__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.resume__download {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: var(--site-accent);
  color: white;
  font-size: 0.9375rem;
  font-weight: 500;
  border-radius: var(--site-radius-sm);
  text-decoration: none;
  transition: background var(--site-transition);
}

.resume__download:hover {
  background: var(--site-accent-hover);
  color: white;
}

.resume__section {
  margin-bottom: 2.5rem;
}

.resume__section-title {
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--site-text-muted);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--site-border);
}

.resume__entry {
  padding: 1.25rem 1.5rem;
  margin-bottom: 0.75rem;
}

.resume__entry-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.resume__entry-header h4 {
  font-size: 1rem;
}

.resume__company {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--site-accent);
}

.resume__meta {
  font-size: 0.8125rem;
  color: var(--site-text-muted);
  margin-bottom: 0.75rem;
}

.resume__summary {
  font-size: 0.9375rem;
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.resume__bullets {
  margin: 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.resume__bullets li {
  font-size: 0.875rem;
  color: var(--site-text-secondary);
  line-height: 1.55;
}
</style>
