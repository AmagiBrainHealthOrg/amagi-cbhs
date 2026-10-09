# Tickets

The execution protocol is in [`INSTRUCTIONS.md`](./INSTRUCTIONS.md) and the ticket format in [`_TEMPLATE.md`](./_TEMPLATE.md). Reports go in `reports/<id>.md`.

Status: `todo` → `in-progress` → `review` → `done` (or `blocked`). A ticket can start once everything in **Depends on** is `done`. **Mig** marks tickets that create migrations; run those one at a time. **Human** marks tickets that need the user to act.

Release scope and dates are in SPEC §11.3. Every Release 1 ticket goes before any Release 2 ticket.

# Release 1: 16 October 2026

## M0: Foundations

| ID                                        | Title                                                           | Depends on | Mig | Human | Status |
| ----------------------------------------- | --------------------------------------------------------------- | ---------- | --- | ----- | ------ |
| [T001](./T001-tooling-and-cleanup.md)     | Repo clean-up, scripts, env validation and preflight            | —          |     | ✔     | done   |
| [T002](./T002-ci-pipeline.md)             | GitHub Actions CI                                               | T001       |     |       | done   |
| [T003](./T003-migrations-baseline.md)     | Switch to migrations, create the baseline and migrate on deploy | T001       | ✔   | ✔     | done   |
| [T004](./T004-roles-and-access.md)        | User roles, backfill and access helpers                         | T003       | ✔   |       | done   |
| [T017](./T017-environments-and-deploy.md) | Test mode, health check and Coming Soon retirement              | T003       |     | ✔     | done   |
| [T029](./T029-airtable-base-design.md)    | Airtable base design for sign-off                               | —          |     | ✔     | done   |

## M1: Content model and design system

| ID                                 | Title                                                                           | Depends on             | Mig | Human | Status |
| ---------------------------------- | ------------------------------------------------------------------------------- | ---------------------- | --- | ----- | ------ |
| [T005](./T005-tokens-and-fonts.md) | Design tokens and fonts                                                         | T001                   |     |       | done   |
| [T006](./T006-globals.md)          | Globals: header, footer, donation settings, anchor day, dropdowns, integrations | T004                   | ✔   |       | done   |
| [T007](./T007-core-collections.md) | Collections: pages (blocks), news, partners, supporters, FAQs                   | T006                   | ✔   |       | done   |
| [T008](./T008-form-submissions.md) | Collection: form submissions                                                    | T007                   | ✔   |       | done   |
| [T009](./T009-shell-and-blocks.md) | App shell, components and block renderers                                       | T005, T006, T007, T017 |     |       | done   |

## M2: Release 1 features

| ID                                   | Title                                                              | Depends on             | Mig | Human | Status |
| ------------------------------------ | ------------------------------------------------------------------ | ---------------------- | --- | ----- | ------ |
| [T010](./T010-donations.md)          | Donations: amount chooser, Stripe Checkout, thank-you              | T006, T009             |     | ✔     | done   |
| [T011](./T011-pages-and-seed.md)     | Release 1 pages, content migration, partner announcements and seed | T007, T009, T017       | ✔   |       | done   |
| [T012](./T012-form-system.md)        | Shared form system                                                 | T008, T009, T017       | ✔   |       | done   |
| [T013](./T013-airtable-and-email.md) | Airtable sync and email adapter                                    | T012                   |     | ✔     | done   |
| [T014](./T014-release-1-forms.md)    | Register Interest and Call to Action consultation forms            | T011, T013             |     |       | done   |
| [T015](./T015-tracking.md)           | Plausible events for forms, consent clean-up                       | T010, T011, T012, T030 |     |       | todo   |
| [T030](./T030-cookie-consent.md)     | Cookie consent banner                                              | T006, T009             |     |       | done   |

## M3: Release 1 launch

| ID                                 | Title            | Depends on                   | Mig | Human | Status |
| ---------------------------------- | ---------------- | ---------------------------- | --- | ----- | ------ |
| [T018](./T018-release-1-launch.md) | Release 1 launch | T010, T011, T014, T015, T017 |     | ✔     | todo   |

# Release 2: date to be confirmed

## M4: Release 2 features

| ID                                 | Title                                        | Depends on       | Mig | Human | Status |
| ---------------------------------- | -------------------------------------------- | ---------------- | --- | ----- | ------ |
| [T019](./T019-release-2-forms.md)  | Partner, Relay and Contact/media forms       | T014             |     |       | done   |
| [T020](./T020-host-countries.md)   | Host Countries index and profiles            | T009, T011, T019 | ✔   |       | todo   |
| [T021](./T021-programme.md)        | Programme page with filters                  | T009, T020       | ✔   |       | todo   |
| [T022](./T022-donation-webhook.md) | Stripe webhook records donations in Airtable | T010, T013       |     | ✔     | todo   |
| [T016](./T016-video-block.md)      | Video block                                  | T009             | ✔   |       | todo   |
| [T028](./T028-substack.md)         | Substack posts on News                       | T011             | ✔   |       | todo   |

## M5: Quality and go-live

| ID                              | Title                         | Depends on                         | Mig | Human | Status   |
| ------------------------------- | ----------------------------- | ---------------------------------- | --- | ----- | -------- |
| [T024](./T024-accessibility.md) | Accessibility audit and fixes | T016, T019, T020, T021, T028       |     |       | todo     |
| [T025](./T025-performance.md)   | Performance pass              | T016, T019, T020, T021, T028       |     |       | todo     |
| [T026](./T026-e2e-suite.md)     | End-to-end suite              | T016, T019, T020, T021, T022, T028 |     |       | deferred |
| [T027](./T027-go-live.md)       | Full go-live                  | T024, T025                         |     | ✔     | todo     |
