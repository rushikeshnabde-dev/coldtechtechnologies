# Requirements Document

## Introduction

This document defines the requirements for a comprehensive website improvement of Coldtech Technologies (https://coldtechtechnologies.in), an Enterprise IT Solutions company based in Pune, India. The platform is a React/Vite SPA (`client/`) backed by an Express/MongoDB server (`server/`). The improvements span ten areas: Hero Section, Trust & Credibility, Services Section, Contact & Lead Generation, Navigation & Header, Footer, Blog/Resources, About Page, Performance & SEO, and Mobile UX. All changes must preserve the existing brand identity — deep blue/dark theme, Inter/Poppins typography, 8px border radius, and filled accent CTA buttons.

---

## Glossary

- **Website**: The Coldtech Technologies React/Vite SPA deployed at https://coldtechtechnologies.in
- **Hero_Section**: The full-width banner at the top of the Home page (`/`)
- **Trust_Bar**: The horizontal strip displaying client logos, certifications, and stats
- **Services_Section**: The grid of service cards on the Home page and the `/services/[slug]` dynamic detail pages
- **Contact_Form**: The lead-capture form on the `/contact` page collecting Name, Company, Email, Phone, Service Needed, and Message
- **Sticky_Header**: The `<header>` element that remains fixed at the top of the viewport on scroll
- **WhatsApp_Button**: The floating action button linking to `https://wa.me/919529882920`
- **Blog_Page**: The `/blog` route listing article cards
- **Article_Card**: A card component displaying cover image, title, date, excerpt, and a "Read More" link
- **About_Page**: The `/about` route
- **JSON_LD**: JSON-Linked Data structured markup embedded in `<script type="application/ld+json">` tags
- **Design_Token**: A named CSS custom property (e.g. `--color-brand-blue`) encoding brand colours, radii, and typography
- **EmailJS**: Client-side email delivery service used to send Contact_Form submissions
- **Toast**: A transient in-app notification rendered via `react-hot-toast`
- **Lighthouse**: Google's automated web quality auditing tool
- **WebP**: A modern image format providing superior compression vs JPEG/PNG
- **Tap_Target**: An interactive element sized for reliable touch interaction (minimum 44 × 44 px)

---

## Requirements

### Requirement 1: Hero Section

**User Story:** As a prospective enterprise client visiting the Home page, I want to immediately understand Coldtech's value proposition and have a clear path to request a consultation, so that I can take action without scrolling.

#### Acceptance Criteria

1. THE Hero_Section SHALL display a headline that communicates Coldtech's enterprise IT value proposition in 10 words or fewer.
2. THE Hero_Section SHALL render a primary CTA button labelled "Get a Free Consultation".
3. WHEN a visitor clicks the "Get a Free Consultation" button, THE Website SHALL scroll smoothly to the Contact_Form on the same page.
4. THE Hero_Section SHALL be visible above the fold on viewport widths of 375 px, 390 px, 768 px, and 1280 px without horizontal overflow.
5. THE Hero_Section SHALL use the existing brand gradient (`#1E293B` → `#0f2744`) and accent colour `#3AB6FF` consistent with the current design tokens.

---

### Requirement 2: Trust & Credibility

**User Story:** As a decision-maker evaluating IT vendors, I want to see social proof — client logos, testimonials, certifications, and key stats — so that I can quickly assess Coldtech's credibility.

#### Acceptance Criteria

1. THE Trust_Bar SHALL display a horizontally scrolling strip of at least 5 client logo placeholders below the Hero_Section.
2. THE Trust_Bar SHALL display a certifications row containing at minimum three badges: "Microsoft Partner", "AWS Partner", and "ISO Certified".
3. THE Trust_Bar SHALL display a stats bar with the following three metrics: "10+ Years", "200+ Clients", and "99.9% Uptime".
4. THE Website SHALL render a testimonials section containing at least 3 testimonial cards, each including: full name, designation, company name, avatar (image or initial-based fallback), and a star rating (1–5).
5. WHEN a testimonial avatar image fails to load, THE Website SHALL display an initial-based fallback avatar using the reviewer's first initial.
6. THE Trust_Bar stats bar counters SHALL animate from zero to their target value WHEN the stats bar enters the viewport for the first time.

---

### Requirement 3: Services Section

**User Story:** As a business owner browsing the site, I want to explore Coldtech's services through visual cards and navigate to detailed service pages, so that I can evaluate which service fits my needs.

#### Acceptance Criteria

1. THE Services_Section SHALL render one icon card per service, each displaying: a service icon, a title, and a one-line description.
2. WHEN a visitor clicks a service card, THE Website SHALL navigate to `/services/[slug]` where `[slug]` is the URL-safe identifier for that service.
3. THE `/services/[slug]` page SHALL display: a full service description, a list of at least 3 benefits, a pricing CTA button, and a related case study snippet.
4. IF a visitor navigates to `/services/[slug]` with an unrecognised slug, THEN THE Website SHALL redirect to `/services` or display a "Service not found" message.
5. THE Services_Section icon cards SHALL be keyboard-navigable and display a visible focus ring compliant with WCAG 2.1 AA contrast requirements.

---

### Requirement 4: Contact & Lead Generation

**User Story:** As a potential client, I want multiple convenient ways to reach Coldtech — phone, email, WhatsApp, and a structured form — so that I can choose the channel that suits me best.

#### Acceptance Criteria

1. THE Sticky_Header SHALL display the primary phone number (+91 95298 82920) and email (sales@coldtechtechnologies.in) as tappable links at all viewport widths ≥ 1024 px.
2. THE WhatsApp_Button SHALL be rendered as a fixed floating button in the bottom-right corner of every page, linking to `https://wa.me/919529882920`.
3. THE Contact_Form SHALL include the following fields: Name (required), Company (optional), Email (required), Phone (required), Service Needed (required, dropdown), and Message (required).
4. WHEN a visitor submits the Contact_Form with all required fields valid, THE Contact_Form SHALL dispatch the submission via EmailJS or Resend and display a success Toast notification.
5. IF a visitor submits the Contact_Form with one or more required fields empty or invalid, THEN THE Contact_Form SHALL display inline field-level error messages without submitting the form.
6. WHILE the Contact_Form submission is in progress, THE Contact_Form SHALL disable the submit button and display a loading indicator.
7. THE WhatsApp_Button SHALL NOT overlap the Footer content on any viewport width between 375 px and 1440 px.

---

### Requirement 5: Navigation & Header

**User Story:** As a site visitor, I want a clear, persistent navigation bar with quick access to key actions, so that I can move around the site efficiently on both desktop and mobile.

#### Acceptance Criteria

1. WHEN a visitor scrolls more than 10 px from the top of the page, THE Sticky_Header SHALL apply a shadow and background blur to visually distinguish it from page content.
2. THE Sticky_Header SHALL include a "Get a Quote" button that links to the Contact_Form or `/contact` page.
3. WHEN a visitor on a viewport width < 1024 px taps the hamburger icon, THE Website SHALL display a slide-in drawer containing all navigation links.
4. WHEN the mobile drawer is open and a visitor taps a navigation link, THE Website SHALL close the drawer and navigate to the selected route.
5. THE Sticky_Header "Get a Quote" button SHALL be visible and tappable on viewport widths ≥ 375 px.
6. ALL navigation links in the Sticky_Header SHALL have a minimum tap target size of 44 × 44 px on mobile viewports.

---

### Requirement 6: Footer

**User Story:** As a visitor at the bottom of any page, I want to find Coldtech's contact details, social links, quick navigation, and legal information, so that I can take next steps or verify the company's legitimacy.

#### Acceptance Criteria

1. THE Footer SHALL display the company address: "PCMC, Pune, Maharashtra 410507, India".
2. THE Footer SHALL display the GST number as a static text field.
3. THE Footer SHALL display the primary email (sales@coldtechtechnologies.in) and phone (+91 95298 82920) as tappable links.
4. THE Footer SHALL include social media icon links for LinkedIn, Twitter, and Instagram, each opening in a new tab with `rel="noopener noreferrer"`.
5. THE Footer SHALL include a "Quick Links" column with internal navigation links to at minimum: Home, Services, About, Blog, and Contact.
6. THE Footer SHALL display a dynamic copyright year computed at render time (e.g. `© {new Date().getFullYear()} ColdTech Technologies`).

---

### Requirement 7: Blog / Resources

**User Story:** As a visitor interested in IT insights, I want to browse a blog listing page and read article previews, so that I can assess Coldtech's expertise and find relevant content.

#### Acceptance Criteria

1. THE Blog_Page SHALL be accessible at the `/blog` route.
2. THE Blog_Page SHALL render at least 3 Article_Cards, each displaying: a cover image, a title, a publication date, a short excerpt (≤ 160 characters), and a "Read More" link.
3. WHEN a visitor clicks "Read More" on an Article_Card, THE Website SHALL navigate to `/blog/[slug]` for that article.
4. THE Blog_Page cover images SHALL use lazy loading so that off-screen images are not fetched until they approach the viewport.
5. IF a blog cover image fails to load, THEN THE Website SHALL display a branded placeholder image in its place.
6. THE Blog_Page SHALL include an `<h1>` tag with the text "Blog" or "Resources" for SEO purposes.

---

### Requirement 8: About Page

**User Story:** As a prospective client or partner, I want to learn about Coldtech's team, history, mission, and differentiators, so that I can build confidence in the company before engaging.

#### Acceptance Criteria

1. THE About_Page SHALL include a team section displaying at least 4 team member cards, each with: name, role/designation, avatar (image or initial fallback), and a short bio.
2. THE About_Page SHALL include a company timeline section showing at least 3 milestones with year and description.
3. THE About_Page SHALL include a mission/vision block with clearly labelled "Mission" and "Vision" statements.
4. THE About_Page SHALL include a "Why Choose Us" section containing exactly 4 icon-cards, each with an icon, a heading, and a supporting sentence.
5. THE About_Page SHALL render an `<h1>` tag containing "Coldtech Technologies" or equivalent brand name for SEO purposes.

---

### Requirement 9: Performance & SEO

**User Story:** As a business stakeholder, I want the website to load fast and rank well in search engines, so that Coldtech attracts organic traffic and provides a good user experience.

#### Acceptance Criteria

1. THE Website SHALL lazy-load all images that are not in the initial viewport using the `loading="lazy"` attribute or an equivalent Intersection Observer implementation.
2. THE Website SHALL embed a JSON_LD `Organization` schema on the Home page containing at minimum: `name`, `url`, `logo`, `contactPoint`, and `address`.
3. THE Website SHALL serve all hero and card images in WebP format, with JPEG/PNG fallbacks via `<picture>` elements.
4. WHERE a page has a unique purpose, THE Website SHALL set a unique `<title>` and `<meta name="description">` tag per route via the existing `SEO` component.
5. THE Website SHALL achieve a Lighthouse Performance score ≥ 80 and a Lighthouse SEO score ≥ 90 on the Home page when measured in a production build.

---

### Requirement 10: Mobile UX

**User Story:** As a mobile user on a 375 px or 390 px device, I want the site to be fully usable without horizontal scrolling or tiny tap targets, so that I can navigate and interact comfortably.

#### Acceptance Criteria

1. THE Website SHALL render without horizontal overflow on viewport widths of 375 px and 390 px across all routes.
2. ALL interactive elements (buttons, links, form inputs) on mobile viewports SHALL have a minimum tap target size of 44 × 44 px.
3. THE WhatsApp_Button SHALL maintain a minimum clearance of 16 px from the top edge of the Footer at all times on viewport widths ≤ 768 px.
4. WHILE a user is on a mobile viewport (width < 1024 px), THE Website SHALL hide desktop-only navigation elements and display the hamburger menu instead.
5. THE Contact_Form fields SHALL stack vertically in a single column on viewport widths ≤ 640 px.
6. THE Services_Section icon cards SHALL reflow to a single-column layout on viewport widths ≤ 640 px.
