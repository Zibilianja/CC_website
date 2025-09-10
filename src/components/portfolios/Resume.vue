/* ==========================================================================
Resume.vue - This is the resume component outlining my professional experience
and journey.
========================================================================== */
<script setup lang="ts"></script>
/* Template ============================================================== */
<template>
  <h2 class="title">Resume</h2>
  <section class="cc-px-6">
    <h3 class="section-title cc-mb-4">Professional Experience</h3>
    <ul class="cc-text-left">
      <li>
        <h3>Software Developer - Denver Public Schools</h3>
        <div>Enterprise Software Applications Team - 07/2023 - 07/2025</div>
        <p>
          Build and maintain DPS custom applications, audit for accessibility
          compliance, and provide technical support.
        </p>
        <div>
          - Rebuilt 4 enterprise applications - TypeScript/Vue3/Pinia, C# .NET
          for Colorado Dept. of Education and DPS Transportation, improving
          maintainability and ensuring WCAG 2.2 compliance for 150,000+ district
          users - 90k students, staff, and parents. Rebuild user interfaces
          according to brand standards and design mocks. State management with
          Pinia stores, custom - front and back end filtering, searching,
          sorting with pagination implemented for each project with REST API
          integration with C# .NET.
        </div>
        <div>
          - Designed and implemented a C# console app automating annual database
          rollovers, cutting a 2-day manual task down requiring 5 developers, to
          less than 4 hours for one dev saving 75% of the time and refactoring
          50+ stored procedures and DTSX packages.
        </div>
        <div>
          - Enhanced a shared Vue3 component library, improving performance and
          accessibility, and saving 30% developer time on frontend work. Node
          installable custom vue library using utility classes, SCSS variables
          and custom components designed around accessibility compliance.
        </div>
        <div>
          - Conducted accessibility audit of 70+ applications, identifying and
          remediating WCAG 2.2 issues with Accessibility Insights and Axe
          DevTools.
        </div>
      </li>
      <li>
        <h3>Software Developer - Bitwise Industries</h3>
        <div>Technical Consulting Branch - 08/2021 - 06/2023</div>
        <div>Fresno, CA - Remote</div>
        <p>
          Build and update client applications, collaborate as part of agile
          integrated team. Audit for accessibility compliance, and provide
          technical support.
        </p>
        <div>
          - Developed frontend features in Angular, React, and TypeScript,
          following Agile methodologies for multiple client projects.
        </div>
        <div>
          - Contributed to the finalization of ProcedureCard, a surgical
          inventory application, enhancing usability and scalability. The client
          had hired us to fix what her previous developers had left in a mess.
          After fixing it, she hired us for a full rebuild to improve
          maintainability, long term success and functional enhancements.
        </div>
        <div>
          - Enhanced a shared Vue3 component library, improving performance and
          accessibility, and saving 30% developer time on frontend work. Node
          installable custom vue library using utility classes, SCSS variables
          and custom components designed around accessibility compliance.
        </div>
        <div>
          - Mentored 4 apprentices in QA automation and frontend best practices,
          accelerating onboarding and raising code quality across the team.
          Helped guide them through agile processes, Jira and confluence
          documentation and project board management.
        </div>
      </li>
      <li>
        <h3>Therapist in Private Practice - All Grow Counseling</h3>
        <div>Denver, CO</div>
        <div>2018 - 2021</div>
        <p>
          Provide individual, couples and group therapy to clients, utilizing a
          transpersonal approach to support personal growth and healing.
          Specializing in mindfulness based CBT, trauma informed care and
          narrative therapy. Work with diverse populations and issues, including
          anxiety, depression, relationship challenges, addictions, trauma and
          life transitions.
        </p>
      </li>
    </ul>
  </section>
  <section class="cc-px-6">
    <h2>Education</h2>
    <ul class="cc-text-left">
      <li>
        <h3>Master of Arts - Clinical Mental Health Counseling</h3>
        <div>Naropa University - Boulder, CO</div>
        <div>2015-2018</div>
        <div>Transpersonal Psychology</div>
      </li>
      <li>
        <h3>Bachelor of Arts - Psychology and Religion</h3>
        <div>University of Redlands - Redlands, CA</div>
        <div>2007 - 2011</div>
      </li>
    </ul>
  </section>
</template>
/* Styles ================================================================ */
<style lang="postcss">
.title {
  color: var(--CC-color-primary);
  margin-bottom: -1rem;
}
.section-title {
  color: var(--CC-color-text);
  margin-bottom: 1rem;
}
li {
  margin-right: 2rem;
}
</style>
