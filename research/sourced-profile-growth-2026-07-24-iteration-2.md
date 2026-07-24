# Sourced profile growth — iteration 2 — 2026-07-24

I checked eight fresh candidates across owner-maintained product repositories, first-party stack pages, independent product pages, and current founder updates. Five met the existing identity, ownership, personal stack, and avatar bar. I did not reconsider any profile or candidate from iteration 1.

## Provenance and avatar support

- The existing provenance type requires source type, confidence, review date, public sources, correction URL, and avatar source.
- Profile pages show the owner-curated label, review date, confidence, sources, correction link, and named avatar source.
- Prerender routes come from the developer data. The sitemap generator and Render rewrites cover each canonical developer URL.
- I verified four GitHub photo endpoints and Steph Ango's first-party Obsidian team photo before adding them. Each returned HTTP 200 with a PNG or JPEG response, and the avatar generator converts the image to a local optimized 512px JPG.

## Accepted

### Steph Ango — high confidence

- Checked: https://stephango.com/about, https://stephango.com/now, https://stephango.com/vcware, https://obsidian.md/about, https://github.com/kepano, https://github.com/kepano/defuddle
- Ownership: Steph's current profile and now page identify him as Obsidian's CEO. Obsidian describes itself as a small, user-supported company without investors.
- Stack: Steph's first-party colophon says he writes in Obsidian and publishes Markdown through Jekyll and Netlify. His current repositories add owner-attributed TypeScript and CSS work.
- Avatar: Accepted the named first-party portrait at https://obsidian.md/images/team/kepano-alt.jpg after it returned `200 image/jpeg`. I rejected Steph's illustrated GitHub avatar during visual review.

### Mitchell Hashimoto — high confidence

- Checked: https://mitchellh.com/ghostty, https://mitchellh.com/writing/ghostty-devlog-001, https://github.com/ghostty-org/ghostty, https://github.com/mitchellh
- Ownership: Mitchell identifies Ghostty as his personal side project and maintains the public project and devlog.
- Stack: The current Ghostty repository documents Zig, SwiftUI, Metal, GTK, C, and Nix across the native terminal application and embeddable library.
- Avatar: Accepted https://github.com/mitchellh.png?size=512 after it returned `200 image/jpeg`.

### Mike Perham — high confidence

- Checked: https://sidekiq.org/about/, https://sidekiq.org/products/pro/, https://sidekiq.org/wiki/Commercial-collaboration, https://www.mikeperham.com/2025/03/05/introducing-sidekiq-8.0/, https://github.com/sidekiq/sidekiq, https://github.com/mperham
- Ownership: Sidekiq names Mike as its creator. The current commercial documentation states that Mike owns and sells the commercial code and alone merges it.
- Stack: Mike's Sidekiq 8 release and current repository identify Ruby, Sidekiq, Redis or Valkey, Docker, and Bundler.
- Avatar: Accepted https://github.com/mperham.png?size=512 after it returned `200 image/jpeg`.

### Justin Duke — high confidence

- Checked: https://buttondown.com/support, https://buttondown.com/about, https://buttondown.com/stack, https://buttondown.com/blog/2025, https://buttondown.com/blog/2026-04-19-firewall-improvements, https://github.com/jmduke
- Ownership: Buttondown identifies Justin as its creator, founder, and CEO. Its current company page says the profitable business is funded by customers rather than investors.
- Stack: Buttondown's first-party stack page was updated in June 2026 and attributes Python, Django, Vue, TypeScript, Tailwind CSS, PostgreSQL, Vite, Stripe, and GitHub to the product. Justin's 2026 technical writing confirms his continued hands-on product work.
- Avatar: Accepted https://github.com/jmduke.png?size=512 after it returned `200 image/png`.

### Jack Ellis — high confidence

- Checked: https://jackellis.me/, https://usefathom.com/about, https://usefathom.com/blog/acquired, https://usefathom.com/blog/tech-stack, https://usefathom.com/blog/two-database-migrations-and-a-divorce, https://usefathom.com/author/jack-ellis, https://github.com/JackEllis
- Ownership: Fathom identifies Jack as its founder and operator. Jack's acquisition update documents his full ownership from December 2024, while the current about page confirms the company remains bootstrapped and customer-funded.
- Stack: Jack's July 2026 first-party migration report attributes PHP, Laravel, ClickHouse, PlanetScale, Redis, and Cursor to his hands-on work rebuilding Fathom's analytics engine.
- Avatar: Accepted https://github.com/JackEllis.png?size=512 after it returned `200 image/jpeg`.

## Held

### Cory Zue

- Checked: https://www.coryzue.com/about/, https://www.coryzue.com/now/, https://www.coryzue.com/projects/, https://www.coryzue.com/software/, https://github.com/czue
- Evidence: Cory's current pages identify SaaS Pegasus as his main product and provide detailed Django, Python, HTMX, Astro, and Pydantic AI attribution.
- Hold reason: His October 2025 now page says he splits his time between SaaS Pegasus and contracting. I could not establish from current public evidence that the business remains product-led strongly enough to clear the client-service exclusion without interpretation.
- Avatar: A usable GitHub photo exists, but I did not configure it for a held profile.

### Jon Buda

- Checked: https://transistor.fm/about/, https://saas.transistor.fm/about, https://saas.transistor.fm/episodes/nerd-stuff-our-web-app-tech-stack, https://github.com/jonbuda
- Evidence: Transistor identifies Jon as its co-founder and president in a current six-person bootstrapped company. His GitHub profile says he is building Transistor with Ruby.
- Hold reason: The detailed personal product-stack source is from 2018. The current public sources did not provide a second specific tool attribution beyond Ruby.
- Avatar: A usable GitHub photo exists, but I did not configure it for a held profile.

### Benedikt Deicke

- Checked: https://userlist.com/about-us/, https://userlist.com/blog/authors/benedikt/, https://github.com/benedikt
- Evidence: Userlist identifies Benedikt as its co-founder and CTO, and his GitHub profile identifies him as a Userlist software engineer.
- Hold reason: Current public pages establish ownership and identity but do not expose two specific current personal stack points. Older talks and code were not enough for this iteration's current-evidence requirement.
- Avatar: A usable GitHub photo exists, but I did not configure it for a held profile.
