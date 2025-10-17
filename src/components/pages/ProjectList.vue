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
    <div class="cc-my-8">
      <strong>Here are some of my software development projects:</strong>
    </div>
    <ul class="cc-mx-8">
      <li class="cc-my-4">
        <strong>Portfolio page, creativecorvid.com:</strong> This website was
        built in Vue3 with Typescript, PostCss, Scss and utilizing my npm
        component and style library. It showcases my 3D, software development
        and game development portfolios. Future plans include more game
        development projects, game ready assets for sale via subscription and
        one off purchases, as well as an ecommerce shop for my and my fiance's
        crafts and creations.
      </li>
      <li class="cc-my-4">
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

      <li class="cc-my-4">
        <strong>Mind Signal:</strong> A personal research project into exploring
        machine learning, natural language processing and AI. Utilizing Python,
        Mind Signal scrapes Reddit and 50 specific subreddits to analyze and
        categorize posts and comments to flag significant mental health
        concerns. Click <a @click="emit('view-mind-signal')">here</a> to learn
        more about it.
      </li>

      <li class="cc-my-4">
        <strong>DPS Projects:</strong> When working for DPS for 2 years from
        2023-2025, I rebuilt multiple legacy production applications. One for
        the Colorado Department of Education that allowed their staff to search
        for employee assignments, CRUD functionality to create new assignments,
        adjust current assignment details or delete assignments/employee records
        if needed. The last project and most significant in scope and scale, was
        rebuilding the Transportation Exception Form applications, which
        included a parent facing application, as well as an administrative
        application. Across both applications, it is used by thousands of
        parents, for our 100,000 students and the entire Transportation
        department to manage Transportation Exception Requests. The parent would
        navigate to the application via the parent portal, and with a 4 step
        form, complete the forms, updating their childs bus route information
        and requested needs. From there, the request would be sent to the
        Transportation Department, where Routers would need to respond to these
        requests in a timely manner. On the Admin side of the application, a
        router would log into the application and could view a list of all
        outstanding requests on the landing page. I built out complete front end
        searching, filtering and sorting functionality with custom pagination.
        For the Transportation Managers, they also wanted an overview of all
        requests, which routers were assigned and be able to track all requests
        beyond just the outstanding ones. For this we implemented back end,
        server side searching, filtering and sorting because the data pool was
        significantly larger for even just 2 years of records. I built out an
        abort controller and implmented custom .NET API guards to maintain speed
        and efficacy to allow for query results as the user types, without
        making a ridiculous number of network calls. Unfortunately, as DPS is a
        school district, and not a public facing entity, I cannot share links to
        these applications.
      </li>
      <li class="cc-my-4">
        <strong>Bitwise Projects:</strong> While working at Bitwise Industries
        from 2021-2023, I worked on a variety of projects both as a developer
        and a apprenticeship mentor. My work included developing web
        applications using Angular and React, and collaborating with
        cross-functional teams to deliver high-quality software solutions. The
        primary application I worked on was called ProcedureCard. It was built
        using Angular and TypeScript, with a django python backend.
        ProcedureCard was a SaaS application that allowed users to create,
        manage, and share procedural documentation for various tasks and
        processes. The documents could then be shared with Hospitals and medical
        institutions to make streamlining the process of surgeons having the
        specific tools and materials needed for each procedure, available in the
        operating room. ProcedureCard included features such as user
        authentication, document creation and editing, searchable lists of
        medical instruments and materials, and collaboration tools for teams to
        work together on documentation.
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
