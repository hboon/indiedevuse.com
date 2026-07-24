# Sourced profile growth — 2026-07-24

This iteration checked eight fresh candidates across independent open source, bootstrapped SaaS, developer education, and tiny-team software source pools. Five met the unchanged identity, ownership, personal stack, and avatar bar.

## Provenance and avatar support

- The `DeveloperProfileProvenance` type requires `sourceType`, `confidence`, `reviewedAt`, `sources`, `correctionURL`, and `avatarSource`.
- Profile pages label owner-curated records, show the review date and confidence, link every source and correction page, and name the avatar source.
- The home and tech-stack pages distinguish owner-curated records. Developer links use the canonical `/developer/:id` route.
- Prerender routes are generated from `developers.json`. The sitemap generator and Render rewrites cover each canonical developer URL.
- `generate-curated-avatars.ts` accepts configured public photo sources, creates local 512px JPG files, and records the resolved avatar source. Every accepted photo endpoint returned a JPEG before it was configured.

## Accepted

### Tanner Linsley — high confidence

- Checked: https://tannerlinsley.com/about, https://tanstack.com/blog/tanstack-2-years, https://tanstack.com/ethos, https://github.com/TanStack/router, https://github.com/tannerlinsley
- Indie and product evidence: Tanner identifies himself as TanStack's creator and owner. His 2025 business update says he went full-time on TanStack without consulting or outside capital, and the current ethos describes a lean founder-led organization.
- Stack evidence: The current TanStack pages and owner-maintained Router repository identify TypeScript, React, Vue, Solid, Svelte, Vite, Vitest, Playwright, and pnpm.
- Avatar: Accepted the named GitHub profile photo at https://github.com/tannerlinsley.png?size=512 after it returned `200 image/jpeg`.

### Jason McCreary — high confidence

- Checked: https://jasonmccreary.me/articles/first-flat-year/, https://jasonmccreary.me/articles/spawing-worker-servers-job-queue-load-laravel/, https://jasonmccreary.me/articles/grinding-to-million-dollar-revenue-saas/, https://github.com/jasonmccreary
- Indie and product evidence: Jason's current writing identifies him as Laravel Shift's founder and operator. The 2026 product update documents ten years of continued ownership and a current product direction.
- Stack evidence: Jason's first-party infrastructure article identifies PHP, Laravel, Horizon, queues, and worker servers. His current product update and GitHub profile confirm that he still builds and operates Shift.
- Avatar: Accepted the named GitHub profile photo at https://github.com/jasonmccreary.png?size=512 after it returned `200 image/jpeg`.

### Jeff Geerling — high confidence

- Checked: https://www.jeffgeerling.com/about/, https://www.jeffgeerling.com/books, https://github.com/geerlingguy/ansible-role-apache, https://github.com/geerlingguy/temperature-monitor, https://github.com/geerlingguy
- Indie and product evidence: Jeff identifies himself as an author, developer, maker, owner of Midwestern Mac, and publisher of books and technical videos.
- Stack evidence: Jeff's current profile names Linux, Ansible, Raspberry Pi, Drupal, and Hugo. His personal repositories add current owner-attributed Python, Node.js, Git, and infrastructure work.
- Avatar: Accepted the named GitHub profile photo at https://github.com/geerlingguy.png?size=512 after it returned `200 image/jpeg`.

### Chris Ferdinandi — high confidence

- Checked: https://gomakethings.com/, https://gomakethings.com/build-the-web-better/, https://gomakethings.com/my-sublime-text-setup-for-front-end-web-development/, https://gomakethings.com/talks/lean-web/, https://github.com/cferdinandi
- Indie and product evidence: Chris identifies Go Make Things as his independent developer-education business. His current business update prioritizes memberships, courses, code, and teaching while reducing consulting.
- Stack evidence: Chris's current educational products and Lean Web material directly attribute HTML, CSS, JavaScript, Web Components, and browser APIs to his work. His first-party setup page and GitHub profile provide separate Git evidence.
- Avatar: Accepted the named GitHub profile photo at https://github.com/cferdinandi.png?size=512 after it returned `200 image/jpeg`.

### Bastian Allgeier — high confidence

- Checked: https://bastianallgeier.com/, https://getkirby.com/team, https://github.com/getkirby/kirby, https://github.com/getkirby/kql, https://github.com/bastianallgeier
- Indie and product evidence: Bastian's personal site says he builds Kirby. Kirby's company page and Bastian's GitHub identity confirm current founder ownership in a small independent product team.
- Stack evidence: The current owner-maintained Kirby repository identifies PHP and Composer. The Kirby Query Language repository provides a second current product source for the REST-oriented query API.
- Avatar: Accepted the named GitHub profile photo at https://github.com/bastianallgeier.png?size=512 after it returned `200 image/jpeg`.

## Held or rejected

### Jen Yip — held

- Checked: https://lunchmoney.app/about/, https://lunchmoney.app/stack, https://lunchmoney.app/media-kit/
- Evidence: Lunch Money identifies Jen as its founder, documents five years as a one-person company, and publishes a detailed product stack.
- Hold reason: The pages were readable through public search results but returned HTTP 403 to direct verification. The media kit showed a personal founder photo without exposing a stable downloadable photo URL that the avatar generator could verify.
- Avatar: No source was configured because a direct public photo response could not be verified.

### Robin Wieruch — rejected

- Checked: https://www.robinwieruch.de/about/, https://www.robinwieruch.de/how-to-build-your-own-course-platform/, https://github.com/rwieruch
- Evidence: Robin's books, course history, projects, and technical stack are public.
- Rejection reason: His current first-party profile leads with freelance technical leadership and embedded client engineering, making the business client-service-led under this iteration's policy.
- Avatar: A named GitHub photo exists, but no source was configured for a rejected profile.

### Anthony Fu — held

- Checked: https://antfu.me/posts/sponsorship-forwarding, https://opencollective.com/antfu, https://voidzero.dev/posts/oss-pledge-2025, https://github.com/antfu
- Evidence: Anthony's personal open-source products, sponsorship, stack, identity, and photo are public.
- Hold reason: Current VoidZero material lists Anthony as a company developer. This iteration did not establish that the profile's present product ownership is independent from that employment strongly enough for the unchanged bar.
- Avatar: A named GitHub photo exists, but no source was configured while the profile is held.
