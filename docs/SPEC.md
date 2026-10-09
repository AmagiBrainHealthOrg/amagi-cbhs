# CBHS 2026 Website: Specification

The source of truth for **what** we build. Tickets cite sections as `SPEC §x.y`.

## 1. Context

- **Client:** Amagi Health Ltd. Contact and single approver: Dr Ishtar Govia.
- **Event:** Caribbean Brain Health Summit 2026, 16–22 November 2026, across several Caribbean countries and online.
- **Domain:** amagisummit.org. DNS on Cloudflare.
- **Analytics:** Plausible Analytics, cookieless (§10), self-hosted at plausible.zestdev.uk. Goals are set up in Plausible.
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

| Route                            | Page                           | Notes                                                                                                                                                                                                                                                 |
| -------------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                              | Home                           | The `home` page. The case for supporting the Summit; dates; Anchor Day details (§5.2); Donate primary; a scrolling partner logo banner directly below the hero; teasers for Support and News (the Host Countries teaser joins in Release 2)           |
| `/about`                         | About                          | Summit purpose and Amagi's role. Mentions PLADRR, a follow-on event in Kingston on 3–5 February 2027                                                                                                                                                  |
| `/support`                       | Support Caribbean Brain Health | Why support matters, what it enables, supporter levels, safeguards, support FAQs, Donate. Supporter list shows permission-confirmed entries only                                                                                                      |
| `/call-to-action`                | Call to Action                 | Explains the _Caribbean Call to Action on Brain Health_ and its five action areas. Hosts the consultation form (§8.3). No download, signing or endorser list                                                                                          |
| `/faqs`                          | FAQs                           | A `pages` document with a `faqList` block: expandable questions grouped by category                                                                                                                                                                   |
| `/donate`                        | Donate                         | Amount chooser (§7)                                                                                                                                                                                                                                   |
| `/news`                          | News                           | A `pages` document whose `newsTeaser` block lists every `news` item, newest first. Approved `substack-posts` join in Release 2 (§9.3)                                                                                                                 |
| `/news/[slug]`                   | News item                      |                                                                                                                                                                                                                                                       |
| `/donate/thank-you`              | Donation thank-you             | §7                                                                                                                                                                                                                                                    |
| `/thank-you/[form]`              | Form thank-you                 | §8                                                                                                                                                                                                                                                    |
| `/privacy`, `/cookies`, `/terms` | Legal                          | Pages from the `pages` collection. Draft copy written from an audit of what the site does (8 October 2026), for Amagi's review. `/cookies` lists every cookie the site and Google Tag Manager set. Every form links to `/privacy` beside its consents |

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
| `partners`         | `name`, `logo`, `description`, `website`, `order`, `permissionConfirmed`                                                                                                                                                 |
| `supporters`       | `name`, `logo`, `level`, `permissionConfirmed`                                                                                                                                                                           |
| `faqs`             | `question`, `answer`, `category`, `order`                                                                                                                                                                                |
| `host-countries`   | Release 2. `name`, `slug`, `countryLead` (name, photo, bio), `weekOverview`, `activities` (array), `localPartners` (logos), `territory` (value from dropdowns)                                                           |
| `sessions`         | Release 2. `title`, `stream`, `day` (date), `territory`, `format` (`in-person` \| `online`), `description`, `lumaUrl`                                                                                                    |
| `substack-posts`   | Release 2. `title`, `url` (unique), `publishedDate`, `excerpt`, `approved` (default false)                                                                                                                               |
| `form-submissions` | `form`, `data` (JSON), `territory`, `audienceType`, `consents` (group of 3), `utm` (group of 5), `isTest`, `airtableSyncStatus` (`pending` \| `synced` \| `failed`), `airtableSyncError`, `airtableRecordId`. Admin-only |

### 5.2 Globals

| Slug                | Fields                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `header`            | `logo`, `brandTitle` (line breaks kept), `navItems`, `donateLabel`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `footer`            | `links`, `tagline`, `legalText`. The cookie settings link label comes from `cookie-consent.settingsLabel`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `donation-settings` | `suggestedAmounts` (array of integers, minor units), `currency` (default `usd`), `allowCustomAmount`, `minimumAmount`, `thankYouKicker` (`{amount}` placeholder), `thankYouHeading`, `thankYouBody`, `thankYouLinkLabel`; `page` (the `/donate` copy: kicker, heading, lead, reasons heading and list, note, amount legend, "Other" labels and hint, submit label, secure-payment note, error text; `{minimum}` placeholder in the hint and error); `unconfirmedHeading`, `unconfirmedBody`, `unconfirmedLinkLabel` (§7 step 4); `banner` (`heading`, `body`, `label`: the copy every `donateBanner` block shows) |
| `anchor-day`        | `date`, `venue`, `moderator`, `mc` (all optional; still being confirmed)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `dropdowns`         | `territories`, `audienceTypes`, `industries`: each an array of `{ label, value }`. No longer read by forms, which take their options from Airtable (§5.3); removed in a later release                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `integrations`      | `gtmContainerId`; `substackFeedUrl`, `substackUrl` (Release 2). Admin-only                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `forms`             | `thankYou`: one entry per form key (§8.3), each `{ form, heading, body }`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `cookie-consent`    | `heading`, `body`, `acceptLabel`, `rejectLabel`, `settingsLabel` (the footer link)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `coming-soon`       | Retired: no longer rendered, hidden in the admin by T017 (§11.4)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

### 5.3 Form options

Every option a form offers comes from the Airtable base (§9.1), so Amagi edits them in one place: locations, "which best describes you", industries, action areas, engagement, areas of work (each a linked table, one record per option), and enquiry type, follow-up preferences and permissions (select fields). The site reads them live, cached for five minutes.

## 6. Design system

### 6.1 Tokens

Brand tokens are in `src/app/(frontend)/tokens.css` (ported from the previous site; custom properties only): primary blue `#005baa`, orange `#f3903f`, yellow `#fcc60d`, red `#e93e39`; fonts Baloo 2 (body), Montserrat (headings), Roboto (UI), All Round Gothic (key statements, Adobe Fonts).

### 6.2 Components

Header, Footer, Button (primary = Donate; secondary; tertiary), Section, Card, Accordion, LogoGrid, Teaser, DonateBanner, Breadcrumbs, ErrorState.

### 6.3 Blocks

Blocks match the graphics-led design on `main`. Section blocks share optional `kicker`, `heading`, `intro`, `background` (`white` | `pale` | `blue`) and `anchorId` fields.

| Block                 | Content                                                                                                                                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hero`                | `style` (`map` \| `photo` \| `plain`), kicker, heading, lead, `images` (photo style, crossfade), Donate button toggle, secondary link, countdown (target, label, unit labels), `stats` (value, label) |
| `richText`            | Section fields and Lexical `content`; `layout` (`split` \| `prose`, prose for legal pages)                                                                                                            |
| `statement`           | Key statement with `source`                                                                                                                                                                           |
| `hostMap`             | Section fields, online label, Anchor Day label, `countries` (name, city, map x/y, anchor, label side). Replaced by `host-countries` data in Release 2                                                 |
| `summitWeek`          | Section fields, month label, `days` (day, date, label, body, anchor)                                                                                                                                  |
| `roadmap`             | Section fields, `numbered`, status labels, `steps` (when, title, body, status `done` \| `now` \| `next`)                                                                                              |
| `flow`                | Section fields, `steps` (title, body)                                                                                                                                                                 |
| `cardGrid`            | Section fields, `style` (`tiles` \| `badges`), `items` (icon, title, body)                                                                                                                            |
| `actionAreas`         | Section fields, centre label, `areas` (icon, title, body), link                                                                                                                                       |
| `supporterLevels`     | Section fields, `levels` (name, body)                                                                                                                                                                 |
| `logoGrid`            | Section fields, source (`supporters` \| `partners`, permission-filtered), display (`grid` \| `marquee`), empty text                                                                                   |
| `faqList`             | Section fields, optional category filter, show category headings                                                                                                                                      |
| `newsTeaser`          | Section fields, number of items or list every item (the News page), link label                                                                                                                        |
| `donateBanner`        | No fields; copy from `donation-settings.banner`                                                                                                                                                       |
| `form`                | Section fields, form key from §8.3                                                                                                                                                                    |
| `anchorDay`           | Section fields; details from the `anchor-day` global                                                                                                                                                  |
| `hostCountriesTeaser` | Release 2                                                                                                                                                                                             |
| `video`               | Release 2 (§9.4)                                                                                                                                                                                      |

Icons are chosen from a fixed list that matches the design's icon set.

### 6.4 Content migration

The copy on `main` before T011 reaches production through an idempotent Payload data migration (T011): it creates each page, news item, FAQ and global value only if it is missing, so it never overwrites an editor's changes. `pnpm db:seed` runs the same content locally. Production has run it, and it is now a no-op: it wrote through the current config, so it broke fresh databases once a later migration added a column to seeded content. Fresh databases (local and CI) run `pnpm payload migrate` then `pnpm db:seed`. New seeded values reach production only through editors.

One exception, `release_1_content` (8 October 2026), brings the Release 1 polish to existing databases: the CBHS 2026 header logo, the seven partners with their logos (Amagi confirmed permission), the Home partner banner and the draft legal copy. It does nothing on a fresh database (no Home page yet), and each step fills only what is missing or still placeholder, so editors' changes are kept. Its images are in `src/seed/media/`.

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

Field names below are the site's names; `src/config/airtable.ts` maps each to its Airtable field by ID (§9.1).

- `name`, `email` (required) and `phone` (optional, phone or WhatsApp, with country code) on every form
- `location` (required; "Where are you based?") on every form, and `describesYou` (required; "Which best describes you?") on every form except `contact`. Options from the base (§5.3)
- `followUp` (optional, tick any): follow-up preferences
- Consents: three unticked, independent checkboxes (`consentContact`, `consentPublicName`, `consentShareStory`). Saved as the `consents` group and written to the form table's `Permissions` field, one choice per consent
- Hidden: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` (captured from the landing URL, kept in `sessionStorage` for the visit). Saved on the submission only: the base has no fields for them
- Honeypot field `homepage` (hidden from users and assistive tech)

### 8.2 Submission flow

Forms post to the `submitForm` Server Action (`src/forms/actions.ts`), so they work without JavaScript. Fields per form are in `src/forms/registry.ts`; the browser and the action validate with the same code (`src/forms/validate.ts`).

1. Client validation, then the same validation on the server. Link and select values must be one of the options read from the base.
2. Rate limit: 5 submissions per IP per 10 minutes, counted in the `rate_limits` table by salted IP hash (the app runs serverless, so in-memory counters don't work). Over the limit, the form keeps its answers and says to wait 10 minutes. A filled honeypot gets the thank-you page and saves nothing.
3. Create a `form-submissions` document (`airtableSyncStatus: pending`). This is the permanent record and the retry queue: a submission is never lost if Airtable is down. `data` holds the answers keyed by the §8.1 and §8.3 names; link fields hold Airtable record IDs, select fields hold choice names. `territory` and `audienceType` hold the chosen location and "describes you" labels.
4. Send a confirmation email.
5. Redirect to `/thank-you/[form]?territory=<location>&audience_type=<describes you>` (non-personal values for `form_submit`, §10.2).
6. After the response (Next's `after()`, so Vercel doesn't cut it short), `syncSubmission(payload, id)` (`src/lib/syncSubmission.ts`) creates one record in the form's table (§9.1) and sets `synced` (with the record ID) or `failed` with the error. A failure also emails `SYNC_ALERT_TO`.
7. Admins can retry failed syncs from the admin (a "Retry sync" action calling the same `syncSubmission`).

### 8.3 Forms

Each form writes to its own table. Fields beyond §8.1 (* required):

| Key                 | Form                        | Airtable table                          | Release | Extra fields                                                                                                                                                                       | Notes                                                         |
| ------------------- | --------------------------- | --------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `register-interest` | Register Interest           | `Registered Interest`                   | 1       | `organisation`, `role`, `engagement` (tick any), `areaOfWork` (tick any) with `areaOfWorkOther`, `interest` (interest or potential contribution), `support` (financial or in-kind) |                                                               |
| `cta-consultation`  | Call to Action consultation | `Join the consultation`                 | 1       | `organisation`, `role`_, `actionArea`_ (pick one of the five)                                                                                                                      | Must state clearly that registering is **not** an endorsement |
| `partner`           | Partner Sign-Up             | `Partner with the Summit`               | 2       | `organisation`_, `role`, `website`_, `industry`* with `industryOther`, `involvement`* (how you'd like to be involved)                                                              | Organisation form                                             |
| `relay`             | Brain Health Relay          | `Propose a Brain Health Relay activity` | 2       | `organisation`, `role`, `activityDate`* (16–22 November 2026), `activity`* (proposed activity; the base's `About` field)                                                           | Country leads filter their view on `Country / location`       |
| `contact`           | Contact and media           | `Enquiries`                             | 2       | `enquiryType`* (General or Media), `outlet` (Media only), `organisation`, `role`, `message`* (the base's `Enquiry` field)                                                          | No `describesYou`                                             |

All five keys are in the schema from Release 1 (Payload stores select options as a Postgres enum, and adding values later needs a migration). Release 2 forms add registry definitions only.

### 8.4 Thank-you pages

One template; heading and body per form key from the `forms` global (§5.2). The thank-you route only knows the form key, so copy can't live on the `form` block.

## 9. Integrations

### 9.1 Airtable

Airtable is Amagi's CRM. The site writes to it directly through the Airtable REST API; there is no Google Sheets step. **The base as built is the source of truth** (decided 9 October 2026): the site adapts to it, and `docs/AIRTABLE.md` describes it.

- One base, `Amagi CBHS CRM` (`app1SgLnjxkPZ9v4X`), with a personal access token scoped to it (`AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`; scopes `schema.bases:read`, `data.records:read`, `data.records:write`).
- `src/config/airtable.ts` maps each form key to its table, and each site field to an Airtable field, by ID. Renaming a table, field or choice in Airtable changes nothing on the site. `pnpm airtable:check` reads the base schema and fails, naming the problem, if an ID is gone or a field's type no longer fits.
- `src/lib/airtable.ts` reads the schema and the linked tables' records (cached for five minutes, §5.3) and creates records with `typecast: true`. Values are shaped by each field's type in the base: a select switched between single and multiple keeps working (a single select keeps the first choice ticked).
- One record per submission in the form's table (§8.3). There is no contacts table: someone who submits twice appears twice.
- Airtable allows 5 requests per second per base: requests retry with backoff on 429, and a failure leaves the submission `failed` for retry.
- In test mode (§11.1) writes go to the same base. Test submissions use obvious names ("Testy Testerson") and are deleted by hand.
- `Donations` (§7 step 5) is not in the base yet.

### 9.2 Email

Payload email adapter using Resend (`@payloadcms/email-resend`). From `EMAIL_FROM_ADDRESS` on an Amagi domain verified in Cloudflare. Plain, accessible HTML templates in `src/emails/`.

### 9.3 Substack (Release 2)

`src/lib/substack.ts` reads the RSS feed at `integrations.substackFeedUrl` and upserts into `substack-posts` by `url` with `approved: false`. Runs as a Payload job every hour and on demand from the admin. Only approved posts appear on `/news`. A "Subscribe" link points to `integrations.substackUrl`.

### 9.4 Video (Release 2)

`video` block: YouTube or Vimeo URL, rendered with privacy-enhanced embeds (`youtube-nocookie.com`, Vimeo `dnt=1`) behind a click-to-load poster for performance.

### 9.5 Luma (Release 2)

Sessions link out to Luma event pages (`lumaUrl`), tracked as outbound clicks. No Luma API integration.

## 10. Tracking

### 10.1 Plausible

Plausible Analytics through `@plausible-analytics/tracker`, started in the root layout only when `integrations.plausibleDomain` is set (empty turns analytics off). Events go to the self-hosted Plausible at `integrations.plausibleHost` (`https://` and the host only, for example `https://plausible.zestdev.uk`); empty sends them to plausible.io. It sets no cookies and stores nothing in the browser, so it runs without consent. Pageviews (including client-side navigation) and outbound link clicks are captured automatically; the events below go through `src/lib/tracking/`. Each custom event needs a matching goal in Plausible, and `donation_complete` a revenue goal in USD.

### 10.2 Events

| Event                  | When                                                                                                                                               | Props                                |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `form_start`           | First interaction with a form, once per form per page load                                                                                         | `form`                               |
| `form_submit`          | Thank-you page, once: only when the form left a pending marker in `sessionStorage`, which it then clears (refreshes and direct visits don't count) | `form`, `territory`, `audience_type` |
| `donate_click`         | Any Donate button click (`data-action="donate"`)                                                                                                   | `location` (the page path)           |
| `donation_complete`    | Thank-you page after the session is confirmed paid, once per session ID                                                                            | Revenue: amount and currency         |
| `Outbound Link: Click` | Any external link (Luma, Substack, partners). Plausible's own event                                                                                | `url`                                |

### 10.3 Data attributes

Every CTA button and outbound link carries `data-journey`, `data-action`, `data-destination-type`. Names are fixed.

### 10.4 Rules

No personal data in any event or prop. No advertising pixels. Plausible replaced the planned Google Tag Manager and Google Analytics on 8 October 2026; `integrations.gtmContainerId` and the Consent Mode defaults stay until T015 removes them.

### 10.5 Cookie consent

Analytics sets no cookies, so the site sets no non-essential cookies and needs no consent for analytics. The banner from T030 still shows until we decide whether to remove it (§13 D10):

- On a first visit, a banner offers **Accept** and **Reject**, equally prominent, with a link to `/cookies`. Copy comes from the `cookie-consent` global.
- The choice is kept for 6 months in a first-party cookie, `cbhs_consent` (`analytics` or `rejected`), which is strictly necessary.
- A "Cookie settings" link in the footer reopens the banner.
- The banner is keyboard accessible, isn't a modal, doesn't trap focus and never covers the Donate button.

## 11. Environments and deployment

### 11.1 Environments

There is no staging environment and there are no preview deployments. Work is verified locally, and every merge to `main` deploys to production.

- **Local:** the Supabase CLI stack (`pnpm supabase start`): Postgres on port 54322 and S3-compatible Storage. Schema and content come one way from production with `pnpm db:pull` (§11.5).
- **Production:** the Vercel deployment of `main` on the one Supabase project. Public from the start, serving the site as built so far, and in test mode until launch (T018). Editors enter real content here from the start, so nothing is copied between environments at launch.

One environment variable controls behaviour, and it is unset locally:

- **`SITE_LIVE=true`** switches off test mode. In test mode, submissions are saved with `isTest: true` and email goes only to `EMAIL_SANDBOX_TO`. Airtable writes go to the one base (§9.1). Set in production at launch.

Stripe is outside test mode: production uses Amagi's live Stripe keys from the start, so donations are real as soon as the donate page is deployed. Local development uses Stripe test keys.

### 11.2 Hosting

Vercel, building `main` with the Next.js preset. Non-production deployments are switched off (`git.deploymentEnabled` in `vercel.json` allows `main` only). Until launch the project is on Tandem's Hobby team; in T018 it moves to an Amagi-owned Pro team (Hobby is for non-commercial use and runs cron at most once a day). Cloudflare manages DNS only, with no proxying in front of Vercel.

- **Database:** Supabase Postgres through the transaction pooler (port 6543). The direct address is IPv6-only and Vercel can't reach it. The build pre-renders pages and connects to the database, so `DATABASE_URL` is set for every environment.
- **Storage:** Supabase Storage through its S3 API, with `clientUploads: true` so admin uploads go straight to storage and avoid Vercel's 4.5 MB request limit.
- **Row-level security:** Supabase exposes the `public` schema through its Data API. Every Payload table has RLS enabled with no policies, and automatic RLS is on for new tables. Payload connects as the table owner, so it isn't affected.
- **Migrations:** `pnpm payload migrate` runs in every Vercel build, before `next build` (`buildCommand` in `vercel.json`). The previous deployment keeps serving until the new one is ready, so every migration must work with both versions: add first, then drop or rename in a later release. Migrations reach production only by merging to `main`; verify them locally first.

### 11.3 Release 1 vs Release 2

| Release | Date                     | Delivers                                                                                                                                                                                                                                                                               | Tickets                                 |
| ------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| 1       | **16 October 2026**      | Release 1 pages (§4.2); donations via Stripe Checkout with server-confirmed thank-you (§7 steps 1–4); Register Interest and Call to Action consultation forms (§8.3) with Airtable sync and email (§9.1–9.2); privacy, cookies and terms pages; cookie consent (§10.5); tracking (§10) | T001–T015, T017, T018, T029, T030       |
| 2       | To be confirmed (§13 D6) | Host Countries and Programme with Luma links (§4.3, §9.5); Substack posts on News (§9.3); video block (§9.4); donation webhook to Airtable (§7 step 5); Partner, Relay and Contact forms (§8.3); accessibility and performance pass (end-to-end suite deferred)                        | T016, T019–T022, T024, T025, T027, T028 |

Every ticket's `release` frontmatter says which release it belongs to. Release 1 work takes priority: no Release 2 ticket starts while a Release 1 ticket is ready to start.

### 11.4 Coming Soon

`/` renders Home from T011, and there is no site lock (§11.1), so nothing renders the Coming Soon page. T011's content migration copied its logo and background images into the `header` global and the Home hero. T017 hides the `coming-soon` global in the admin but keeps it in the config, so no migration drops its tables. T027 removes it and drops the tables, once nothing reads it (the T011 content migration and `src/seed/` read its images).

### 11.5 Local data pull

`pnpm db:pull` replaces the local main database (`amagi_cbhs`) with production's `public` schema and data, syncs the production bucket into local Storage, then runs `pnpm payload migrate` to apply any newer migrations from the branch. It is one way: nothing is ever written to a remote. `form_submissions` rows are left out because they hold personal data; the data processing agreement must allow the rest (editor accounts and content) on developer machines. Because pulls copy schema too, the remote schema changes only through migrations, never by hand in the Supabase dashboard.

## 12. Out of scope

Copywriting and brand design; translation; analytics and dashboard configuration; Airtable views, automations and reporting (we supply the base structure and the writes); on-site card processing; event registration or ticketing; member logins; forms beyond §8.3; Summit week support beyond launch.

## 13. Open decisions

| #   | Decision                                                                                                                                        | Owner          | Blocks                           |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | -------------------------------- |
| D5  | Suggested donation amounts and currency                                                                                                         | Amagi          | T010 (seed can use placeholders) |
| D6  | Release 2 date                                                                                                                                  | Tandem + Amagi | Release 2 scheduling             |
| D8  | Whether donor name and email go to Airtable                                                                                                     | Amagi          | T022                             |
| D9  | Whether merges keep deploying straight to production after launch, or production deploys from a `production` branch that a person fast-forwards | Tandem         | T018                             |
| D10 | Whether to remove the cookie banner now that analytics is cookieless (§10.5)                                                                    | Tandem         | T015                             |
