# CBHS 2026 Website: Specification

The source of truth for **what** we build. Tickets cite sections as `SPEC §x.y`.

## 1. Context

- **Client:** Amagi Health Ltd. Contact and single approver: Dr Ishtar Govia.
- **Event:** Caribbean Brain Health Summit 2026, 16–22 November 2026, across several Caribbean countries and online.
- **Domain:** amagisummit.org. DNS on Cloudflare.
- **Analytics partner:** Beyond Growth. They configure Google Tag Manager and dashboards; we expose the data layer and events (§10).
- **Brand designer:** Heather Kong. Supplies logo, colours, fonts and per-country logo variants.
- **Editors:** 3–5 non-technical Amagi staff manage all copy in the CMS.

## 2. Goals and non-goals

### 2.1 Goals

1. **Drive donations.** Donate is the primary call to action on every page.
2. Explain the Summit credibly: what it is, where it happens, who is involved.
3. Route other visitors into sign-up journeys (register interest, partner, relay, Call to Action consultation, contact).
4. Capture form and donation data straight into Amagi's Airtable CRM with clean consent and campaign data.
5. Let non-technical editors run the site without developers.

### 2.2 Non-goals

See §12.

## 3. Constraints

### 3.1 Payments

No card data on our site. Payments happen only on Stripe's hosted Checkout page.

### 3.2 Accessibility

WCAG 2.1 AA across all pages and forms.

### 3.3 Performance

Fast on slow Caribbean mobile connections. Targets on a throttled "Slow 4G" mobile profile: Largest Contentful Paint < 2.5s, Cumulative Layout Shift < 0.1, total JavaScript on content pages < 150 KB gzipped.

### 3.4 Privacy and wording

- No personal data in tracking. No advertising pixels.
- No health questions on any form.
- Never use "sponsor", "exhibitor" or "lead generation".
- Supporter and partner names or logos appear only when `permissionConfirmed` is true.
- A data processing agreement with Amagi must be signed before any form collects data in production.

### 3.5 Ownership

All production accounts (hosting, database, storage, Stripe, email, fonts, Google) are in Amagi's name. Exceptions until launch: the Vercel project runs on Tandem's Hobby team, and the Supabase project may sit in Tandem's organisation. In T018 the Vercel project moves to an Amagi-owned Pro team and the Supabase project transfers to Amagi's organisation.

## 4. Information architecture

### 4.1 Global

- **Header:** logo, navigation, **Donate** button (primary).
- **Footer:** privacy, cookies, terms, contact links; a "Cookie settings" link (§10.5); legal text.

### 4.2 Pages (Release 1)

| Route                            | Page                           | Notes                                                                                                                                                                          |
| -------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`                              | Home                           | The case for supporting the Summit; dates; Anchor Day details (§5.2); Donate primary; teasers for Support and News (the Host Countries teaser joins in Release 2)              |
| `/about`                         | About                          | Summit purpose and Amagi's role. Mentions PLADRR, a follow-on event in Kingston on 3–5 February 2027                                                                           |
| `/support`                       | Support Caribbean Brain Health | Why support matters, what it enables, supporter levels, safeguards, support FAQs, Donate. Supporter list shows permission-confirmed entries only                               |
| `/call-to-action`                | Call to Action                 | Explains the _Caribbean Call to Action on Brain Health_ and its five action areas. Hosts the consultation form (§8.3). No download, signing or endorser list                   |
| `/faqs`                          | FAQs                           | A `pages` document with a `faqList` block: expandable questions grouped by category                                                                                            |
| `/donate`                        | Donate                         | Amount chooser (§7)                                                                                                                                                            |
| `/news`                          | News                           | `news` items, newest first. Approved `substack-posts` join in Release 2 (§9.3)                                                                                                 |
| `/news/[slug]`                   | News item                      |                                                                                                                                                                                |
| `/donate/thank-you`              | Donation thank-you             | §7                                                                                                                                                                             |
| `/thank-you/[form]`              | Form thank-you                 | §8                                                                                                                                                                             |
| `/privacy`, `/cookies`, `/terms` | Legal                          | Pages from the `pages` collection, with copy from Amagi. `/cookies` lists every cookie the site and Google Tag Manager set. Every form links to `/privacy` beside its consents |

### 4.3 Pages (Release 2)

| Route                                                      | Page                   |
| ---------------------------------------------------------- | ---------------------- |
| `/host-countries`                                          | Host Countries index   |
| `/host-countries/[slug]`                                   | Country profile        |
| `/programme`                                               | Programme with filters |
| `/get-involved/partner`, `/get-involved/relay`, `/contact` | Release 2 forms (§8.3) |

### 4.4 Partner announcements

Publishing a `news` item with `type: partner-announcement` and a related partner surfaces it on `/news`, on Home (latest announcements block) and on the partner's entry, from one publish action.

## 5. Content model

Drafts, autosave and live preview are on for `pages`, `news`, `partners`, `supporters`, `faqs`, `host-countries`, `sessions` and every global except `integrations`. There are no drafts on `users`, `media`, `form-submissions`, `substack-posts` or `integrations`. Code that reads a global at runtime (for example `dropdowns`) reads the published version.

### 5.1 Collections

| Slug               | Fields                                                                                                                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `users`            | email (auth), `role` (`admin` \| `editor`, default `editor`, saved to JWT)                                                                                                                                               |
| `media`            | upload, `alt` (required)                                                                                                                                                                                                 |
| `pages`            | `title`, `slug`, `layout` (blocks, §6.3), `meta` (title, description, image)                                                                                                                                             |
| `news`             | `title`, `slug`, `publishedDate`, `summary`, `body` (rich text), `image`, `type` (`news` \| `partner-announcement`), `partner` (relationship)                                                                            |
| `partners`         | `name`, `logo`, `description`, `website`, `permissionConfirmed`                                                                                                                                                          |
| `supporters`       | `name`, `logo`, `level`, `permissionConfirmed`                                                                                                                                                                           |
| `faqs`             | `question`, `answer`, `category`, `order`                                                                                                                                                                                |
| `host-countries`   | Release 2. `name`, `slug`, `countryLead` (name, photo, bio), `weekOverview`, `activities` (array), `localPartners` (logos), `territory` (value from dropdowns)                                                           |
| `sessions`         | Release 2. `title`, `stream`, `day` (date), `territory`, `format` (`in-person` \| `online`), `description`, `lumaUrl`                                                                                                    |
| `substack-posts`   | Release 2. `title`, `url` (unique), `publishedDate`, `excerpt`, `approved` (default false)                                                                                                                               |
| `form-submissions` | `form`, `data` (JSON), `territory`, `audienceType`, `consents` (group of 3), `utm` (group of 5), `isTest`, `airtableSyncStatus` (`pending` \| `synced` \| `failed`), `airtableSyncError`, `airtableRecordId`. Admin-only |

### 5.2 Globals

| Slug                | Fields                                                                                                                                                   |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `header`            | `logo`, `navItems`, `donateLabel`                                                                                                                        |
| `footer`            | `links`, `legalText`                                                                                                                                     |
| `donation-settings` | `suggestedAmounts` (array of integers, minor units), `currency` (default `usd`), `allowCustomAmount`, `minimumAmount`, `thankYouHeading`, `thankYouBody` |
| `anchor-day`        | `date`, `venue`, `moderator`, `mc` (all optional; still being confirmed)                                                                                 |
| `dropdowns`         | `territories`, `audienceTypes`, `industries`: each an array of `{ label, value }`                                                                        |
| `integrations`      | `gtmContainerId`; `substackFeedUrl`, `substackUrl` (Release 2). Admin-only                                                                               |
| `forms`             | `thankYou`: one entry per form key (§8.3), each `{ form, heading, body }`                                                                                |
| `cookie-consent`    | `heading`, `body`, `acceptLabel`, `rejectLabel`, `settingsLabel` (the footer link)                                                                       |
| `coming-soon`       | Existing. Retired at Release 1 launch (§11.4)                                                                                                            |

### 5.3 Dropdown values

Amagi supplies the values. Sources: territories and audience types from the Measurement Decisions Guidance; industries from Appendix 2. Seed with the audience types below; leave territories and industries for Amagi to enter.

Audience types (`value`): `country_lead`, `activity_host`, `partner_organisation`, `supporter`, `connector`, `lived_experience`, `researcher_clinician`, `media`, `diaspora`, `general_public`.

## 6. Design system

### 6.1 Tokens

Brand tokens are in `src/app/(frontend)/tokens.css` (ported from the previous site; custom properties only): primary blue `#005baa`, orange `#f3903f`, yellow `#fcc60d`, red `#e93e39`; fonts Baloo 2 (body), Montserrat (headings), Roboto (UI), All Round Gothic (key statements, Adobe Fonts).

### 6.2 Components

Header, Footer, Button (primary = Donate; secondary; tertiary), Section, Card, Accordion, LogoGrid, Teaser, DonateBanner, Breadcrumbs, ErrorState.

### 6.3 Blocks

`hero`, `richText`, `cardGrid`, `donateBanner`, `logoGrid` (supporters or partners, permission-filtered), `faqList`, `newsTeaser`, `hostCountriesTeaser` (Release 2), `video` (§9.4, Release 2), `form` (selects a form key from §8.3), `anchorDay`, `supporterLevels`, `actionAreas`.

## 7. Donations

1. Donate buttons link to `/donate` (amount chooser) or open the chooser in place.
2. The chooser shows `suggestedAmounts` and, if enabled, a custom amount (≥ `minimumAmount`).
3. `POST /api/donate` validates the amount and creates a Stripe Checkout Session (`mode: payment`), passing UTM values and the source page in `metadata`.
   - `success_url`: `/donate/thank-you?session_id={CHECKOUT_SESSION_ID}`
   - `cancel_url`: the source page
4. `/donate/thank-you` retrieves the session server-side. If `payment_status === 'paid'`, it renders thank-you copy and pushes `donation_complete` (amount, currency). Otherwise it renders a neutral "we couldn't confirm your donation" state.
5. **Release 2:** `POST /api/stripe/webhook` handles `checkout.session.completed`, verifies the signature, is idempotent on event ID, and creates a record in the Airtable `Donations` table (amount, currency, date, UTM, source page, session ID). Whether the donor's name and email from Stripe also go to Airtable is open (§13 D8); until decided, they are **not** written.

## 8. Forms

### 8.1 Shared fields

- `territory` (select, required), `audienceType` (select, required), `industry` (select, organisation forms only)
- Hidden: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` (captured from the landing URL, kept in `sessionStorage` for the visit)
- Consents (three unticked checkboxes, independent): `consentContact`, `consentPublicName`, `consentShareStory`
- Honeypot field `website` (hidden from users and assistive tech)

### 8.2 Submission flow

1. Client validation, then server validation (Zod).
2. Rate limit: 5 submissions per IP per 10 minutes, counted in a Postgres table (the app runs serverless, so in-memory counters don't work).
3. Create a `form-submissions` document (`airtableSyncStatus: pending`). This is the permanent record and the retry queue: a submission is never lost if Airtable is down.
4. Send a confirmation email.
5. Redirect to `/thank-you/[form]?territory=<value>&audience_type=<value>` (non-personal values for `form_submit`, §10.2).
6. After the response (Next's `after()`, so Vercel doesn't cut it short), `syncSubmission(id)` writes to Airtable (§9.1) and sets `synced` (with the record ID) or `failed` with the error. A failure also emails `SYNC_ALERT_TO`.
7. Admins can retry failed syncs from the admin (a "Retry sync" action calling the same `syncSubmission`).

### 8.3 Forms

| Key                 | Form                        | Release | Extra fields                                                                              | Notes                                                                                              |
| ------------------- | --------------------------- | ------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `register-interest` | Register Interest           | 1       | name, email                                                                               |                                                                                                    |
| `cta-consultation`  | Call to Action consultation | 1       | name, email, organisation (optional), role, area of interest (from the five action areas) | Must state clearly that registering is **not** an endorsement                                      |
| `partner`           | Partner Sign-Up             | 2       | name, email, organisation, website, industry, how you'd like to be involved               | Organisation form                                                                                  |
| `relay`             | Brain Health Relay          | 2       | name, email, organisation (optional), proposed activity, date                             | Routed by territory: territory is its own field, so each country lead has a filtered Airtable view |
| `contact`           | Contact and media           | 2       | name, email, enquiry type (`general` \| `media`), message, outlet (media only)            |                                                                                                    |

All five keys are in the schema from Release 1 (Payload stores select options as a Postgres enum, and adding values later needs a migration). Release 2 forms add registry definitions only.

### 8.4 Thank-you pages

One template; heading and body per form key from the `forms` global (§5.2). The thank-you route only knows the form key, so copy can't live on the `form` block.

## 9. Integrations

### 9.1 Airtable

Airtable is Amagi's CRM. The site writes to it directly through the Airtable REST API; there is no Google Sheets step.

- `src/lib/airtable.ts`, authenticated with a personal access token scoped to one base (`AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`). Two bases: a test base and the production base, which is in Amagi's name.
- Base structure (Amagi signs it off, §13 D7):
  - `Contacts`: one record per person, upserted by email (Airtable's `performUpsert` on `Email`). Name, organisation, territory, audience type, industry, the three consents (latest values), first and latest UTM, first seen and last seen.
  - One table per form key (§8.3), each record linked to its contact and holding that form's fields, UTM, consents as given, source page, submitted at and the Payload submission ID.
  - `Donations` (§7 step 5).
- Table and field names live in one place, `src/config/airtable.ts`, so the base can be renamed without code changes elsewhere. `pnpm airtable:check` reads the base schema and fails if a table or field the code needs is missing.
- Airtable allows 5 requests per second per base: requests retry with backoff on 429, and a failure leaves the submission `failed` for retry.
- In test mode (§11.1), writes go to the test base and set the `Test` checkbox.

### 9.2 Email

Payload email adapter using Resend (`@payloadcms/email-resend`). From `EMAIL_FROM_ADDRESS` on an Amagi domain verified in Cloudflare. Plain, accessible HTML templates in `src/emails/`.

### 9.3 Substack (Release 2)

`src/lib/substack.ts` reads the RSS feed at `integrations.substackFeedUrl` and upserts into `substack-posts` by `url` with `approved: false`. Runs as a Payload job every hour and on demand from the admin. Only approved posts appear on `/news`. A "Subscribe" link points to `integrations.substackUrl`.

### 9.4 Video (Release 2)

`video` block: YouTube or Vimeo URL, rendered with privacy-enhanced embeds (`youtube-nocookie.com`, Vimeo `dnt=1`) behind a click-to-load poster for performance.

### 9.5 Luma (Release 2)

Sessions link out to Luma event pages (`lumaUrl`), tracked as outbound clicks. No Luma API integration.

## 10. Tracking

### 10.1 Data layer

In the root layout, before the Google Tag Manager snippet:

```js
window.dataLayer = window.dataLayer || []
window.dataLayer.push({ page_type, audience_segment, journey, territory })
```

Each route sets these values (default `audience_segment: "general_public"`, `journey: "awareness"`, `territory: "not_specified"`).

### 10.2 Events

| Event               | When                                                                                                                                               | Payload                                |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `form_start`        | First interaction with a form, once per form per page load                                                                                         | `form`                                 |
| `form_submit`       | Thank-you page, once: only when the form left a pending marker in `sessionStorage`, which it then clears (refreshes and direct visits don't count) | `form`, `territory`, `audience_type`   |
| `donate_click`      | Any Donate button click                                                                                                                            | `location`                             |
| `donation_complete` | Thank-you page after the session is confirmed paid, once per session ID                                                                            | `value`, `currency`                    |
| `outbound_click`    | Any external link (Luma, Substack, partners)                                                                                                       | `destination_type`, `destination_host` |

### 10.3 Data attributes

Every CTA button and outbound link carries `data-journey`, `data-action`, `data-destination-type`. Names are fixed.

### 10.4 Rules

No personal data in any event or data-layer value. No advertising pixels. Google Tag Manager loads only if `integrations.gtmContainerId` is set and the visitor has accepted analytics (§10.5).

### 10.5 Cookie consent

- On a first visit, a banner offers **Accept** and **Reject**, equally prominent, with a link to `/cookies`. Copy comes from the `cookie-consent` global.
- Until the visitor accepts, Google Tag Manager doesn't load and no non-essential cookies are set. `dataLayer` pushes still happen (they set no cookies), and Google Tag Manager processes them if it loads later in the visit.
- The choice is kept for 6 months in a first-party cookie, `cbhs_consent` (`analytics` or `rejected`), which is strictly necessary.
- Google Consent Mode defaults go into `dataLayer` first, with every type `denied`. Accepting grants `analytics_storage` only; advertising types are never granted.
- A "Cookie settings" link in the footer reopens the banner. Withdrawing consent is as easy as giving it: rejecting after accepting deletes the `_ga*` cookies on our domain.
- The banner is keyboard accessible, isn't a modal, doesn't trap focus and never covers the Donate button.

## 11. Environments and deployment

### 11.1 Environments

There is no staging environment and there are no preview deployments. Work is verified locally, and every merge to `main` deploys to production.

- **Local:** the Supabase CLI stack (`pnpm supabase start`): Postgres on port 54322 and S3-compatible Storage. Schema and content come one way from production with `pnpm db:pull` (§11.5).
- **Production:** the Vercel deployment of `main` on the one Supabase project. Locked and in test mode until launch (T018). Editors enter real content here from the start, so nothing is copied between environments at launch.

Two environment variables control behaviour, and both are unset locally:

- **`SITE_LIVE=true`** switches off test mode. In test mode, Stripe uses test keys, submissions are saved with `isTest: true`, Airtable writes go to the test base with `Test` ticked, and email goes only to `EMAIL_SANDBOX_TO`. Set in production at launch.
- **`SITE_LOCKED=true`** shows the Coming Soon page on every frontend route to anyone not logged in to the CMS, and sends `X-Robots-Tag: noindex`. Logged-in CMS users see the whole site, including drafts with `?preview=true`, so Amagi reviews new work as draft pages. `/admin`, `/api/*` and static assets are not locked. Set in production until launch, or after it if D4 is "editor-only".

### 11.2 Hosting

Vercel, building `main` with the Next.js preset. Non-production deployments are switched off (`git.deploymentEnabled` in `vercel.json` allows `main` only). Until launch the project is on Tandem's Hobby team; in T018 it moves to an Amagi-owned Pro team (Hobby is for non-commercial use and runs cron at most once a day). Cloudflare manages DNS only, with no proxying in front of Vercel.

- **Database:** Supabase Postgres through the transaction pooler (port 6543). The direct address is IPv6-only and Vercel can't reach it. The build pre-renders pages and connects to the database, so `DATABASE_URL` is set for every environment.
- **Storage:** Supabase Storage through its S3 API, with `clientUploads: true` so admin uploads go straight to storage and avoid Vercel's 4.5 MB request limit.
- **Row-level security:** Supabase exposes the `public` schema through its Data API. Every Payload table has RLS enabled with no policies, and automatic RLS is on for new tables. Payload connects as the table owner, so it isn't affected.
- **Migrations:** `pnpm payload migrate` runs in every Vercel build, before `next build` (`buildCommand` in `vercel.json`). The previous deployment keeps serving until the new one is ready, so every migration must work with both versions: add first, then drop or rename in a later release. Migrations reach production only by merging to `main`; verify them locally first.

### 11.3 Release 1 vs Release 2

| Release | Date                     | Delivers                                                                                                                                                                                                                                                                               | Tickets                           |
| ------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| 1       | **16 October 2026**      | Release 1 pages (§4.2); donations via Stripe Checkout with server-confirmed thank-you (§7 steps 1–4); Register Interest and Call to Action consultation forms (§8.3) with Airtable sync and email (§9.1–9.2); privacy, cookies and terms pages; cookie consent (§10.5); tracking (§10) | T001–T015, T017, T018, T029, T030 |
| 2       | To be confirmed (§13 D6) | Host Countries and Programme with Luma links (§4.3, §9.5); Substack posts on News (§9.3); video block (§9.4); donation webhook to Airtable (§7 step 5); Partner, Relay and Contact forms (§8.3); accessibility, performance and end-to-end pass                                        | T016, T019–T022, T024–T028        |

Every ticket's `release` frontmatter says which release it belongs to. Release 1 work takes priority: no Release 2 ticket starts while a Release 1 ticket is ready to start.

### 11.4 Coming Soon

`/` renders Home from T011. Until launch, the Coming Soon page is what the site lock shows anonymous visitors (§11.1). Remove the global in a later migration once launch is confirmed and the lock is no longer needed.

### 11.5 Local data pull

`pnpm db:pull` replaces the local main database (`amagi_cbhs`) with production's `public` schema and data, syncs the production bucket into local Storage, then runs `pnpm payload migrate` to apply any newer migrations from the branch. It is one way: nothing is ever written to a remote. `form_submissions` rows are left out because they hold personal data; the data processing agreement must allow the rest (editor accounts and content) on developer machines. Because pulls copy schema too, the remote schema changes only through migrations, never by hand in the Supabase dashboard.

## 12. Out of scope

Copywriting and brand design; translation; analytics and dashboard configuration; Airtable views, automations and reporting (we supply the base structure and the writes); on-site card processing; event registration or ticketing; member logins; forms beyond §8.3; Summit week support beyond launch.

## 13. Open decisions

| #   | Decision                                                                                                                                        | Owner          | Blocks                           |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | -------------------------------- |
| D3  | Territory and industry values                                                                                                                   | Amagi          | T014 (seed can use placeholders) |
| D4  | Whether Release 1 is public or editor-only                                                                                                      | Amagi          | T018                             |
| D5  | Suggested donation amounts and currency                                                                                                         | Amagi          | T010 (seed can use placeholders) |
| D6  | Release 2 date                                                                                                                                  | Tandem + Amagi | Release 2 scheduling             |
| D7  | Airtable base structure and field list (§9.1)                                                                                                   | Amagi          | T029, T013                       |
| D8  | Whether donor name and email go to Airtable                                                                                                     | Amagi          | T022                             |
| D9  | Whether merges keep deploying straight to production after launch, or production deploys from a `production` branch that a person fast-forwards | Tandem         | T018                             |
