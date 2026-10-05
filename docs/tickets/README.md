# Tickets

The execution protocol is in [`INSTRUCTIONS.md`](./INSTRUCTIONS.md) and the ticket format in [`_TEMPLATE.md`](./_TEMPLATE.md). Reports go in `reports/<id>.md`.

Status: `todo` → `in-progress` → `review` → `done` (or `blocked`). A ticket can start once everything in **Depends on** is `done`. **Mig** marks tickets that create migrations; run those one at a time. **Human** marks tickets that need the user to act.

## M0: Foundations

| ID                                    | Title                                                | Depends on | Mig | Human | Status |
| ------------------------------------- | ---------------------------------------------------- | ---------- | --- | ----- | ------ |
| [T001](./T001-tooling-and-cleanup.md) | Repo clean-up, scripts, env validation and preflight | —          |     |       | todo   |
| [T002](./T002-ci-pipeline.md)         | GitHub Actions CI                                    | T001       |     |       | todo   |
| [T003](./T003-migrations-baseline.md) | Switch to migrations and create the baseline         | T001       | ✔   |       | todo   |
| [T004](./T004-roles-and-access.md)    | User roles, backfill and access helpers              | T003       | ✔   |       | todo   |

## M1: Content model and design system

| ID                                       | Title                                                                           | Depends on       | Mig | Human | Status |
| ---------------------------------------- | ------------------------------------------------------------------------------- | ---------------- | --- | ----- | ------ |
| [T005](./T005-tokens-and-fonts.md)       | Design tokens and fonts                                                         | T001             |     |       | todo   |
| [T006](./T006-globals.md)                | Globals: header, footer, donation settings, anchor day, dropdowns, integrations | T004             | ✔   |       | todo   |
| [T007](./T007-core-collections.md)       | Collections: pages (blocks), news, partners, supporters, FAQs                   | T006             | ✔   |       | todo   |
| [T008](./T008-supporting-collections.md) | Collections: host countries, sessions, Substack posts, form submissions         | T007             | ✔   |       | todo   |
| [T009](./T009-shell-and-blocks.md)       | App shell, components and block renderers                                       | T005, T006, T007 |     |       | todo   |

## M2: Release 1 features

| ID                                   | Title                                                   | Depends on       | Mig | Human | Status |
| ------------------------------------ | ------------------------------------------------------- | ---------------- | --- | ----- | ------ |
| [T010](./T010-donations.md)          | Donations: amount chooser, Stripe Checkout, thank-you   | T006, T009       |     |       | todo   |
| [T011](./T011-pages-and-seed.md)     | Release 1 pages, partner announcements and seed script  | T007, T008, T009 |     |       | todo   |
| [T012](./T012-form-system.md)        | Shared form system                                      | T008, T009       |     |       | todo   |
| [T013](./T013-sheets-and-email.md)   | Google Sheets sync and email adapter                    | T012             |     | ✔     | todo   |
| [T014](./T014-release-1-forms.md)    | Register Interest and Call to Action consultation forms | T013             |     |       | todo   |
| [T015](./T015-tracking.md)           | Data layer, Google Tag Manager and events               | T009             |     |       | todo   |
| [T016](./T016-substack-and-video.md) | Substack sync and video block                           | T008, T009       |     |       | todo   |

## M3: Release 1 launch

| ID                                        | Title                               | Depends on                   | Mig | Human | Status |
| ----------------------------------------- | ----------------------------------- | ---------------------------- | --- | ----- | ------ |
| [T017](./T017-environments-and-deploy.md) | Staging and production environments | T010, T011, T014, T015, T016 |     | ✔     | todo   |
| [T018](./T018-release-1-launch.md)        | Release 1 launch                    | T017                         |     | ✔     | todo   |

## M4: Release 2

| ID                                 | Title                                     | Depends on | Mig | Human | Status |
| ---------------------------------- | ----------------------------------------- | ---------- | --- | ----- | ------ |
| [T019](./T019-release-2-forms.md)  | Partner, Relay and Contact/media forms    | T014       |     |       | todo   |
| [T020](./T020-host-countries.md)   | Host Countries index and profiles         | T008, T009 |     |       | todo   |
| [T021](./T021-programme.md)        | Programme page with filters               | T008, T009 |     |       | todo   |
| [T022](./T022-donation-webhook.md) | Stripe webhook writes donations to Sheets | T010, T013 |     | ✔     | todo   |
| [T023](./T023-translation.md)      | Automated translation                     | T018       |     | ✔     | todo   |

## M5: Quality and go-live

| ID                              | Title                         | Depends on             | Mig | Human | Status |
| ------------------------------- | ----------------------------- | ---------------------- | --- | ----- | ------ |
| [T024](./T024-accessibility.md) | Accessibility audit and fixes | T019, T020, T021, T023 |     |       | todo   |
| [T025](./T025-performance.md)   | Performance pass              | T019, T020, T021, T023 |     |       | todo   |
| [T026](./T026-e2e-suite.md)     | End-to-end suite              | T019, T020, T021, T022 |     |       | todo   |
| [T027](./T027-go-live.md)       | Full go-live                  | T024, T025, T026       |     | ✔     | todo   |
