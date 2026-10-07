# CBHS 2026 Website: Implementation Plan

## 1. Strategy

Build on the existing Payload + Next.js repo. There is no staging and there are no preview deployments: work is verified locally, and every merge to `main` deploys to production, which is public and stays in test mode until launch (SPEC §11.1). Tidy and harden the foundations first (clean-up, migrations, test mode, roles, CI), then the content model, then the design system and donation flow, then pages and forms. Release 1 is everything an editor and a donor need. Release 2 adds the remaining journeys and the quality pass.

## 2. Principles

- **Release 1 first.** Release 1 ships on 16 October 2026 (SPEC §11.3). No Release 2 ticket starts while a Release 1 ticket is ready.
- **Donations first.** When choosing between two pieces of work, pick the one closer to a working donation.
- **Content in the CMS.** Editors change copy; developers change structure.
- **Thin vertical slices.** Each ticket leaves the app building, migrated and deployable.
- **Evidence, not assertion.** Every acceptance criterion is verified by the method it names.
- **One migration at a time.**

## 3. Milestones

**Release 1, 16 October 2026: M0–M3 (T001–T015, T017, T018, T029, T030).** **Release 2, date to be confirmed: M4–M5 (T016, T019–T022, T024–T028).**

### M0: Foundations

T001 tooling and clean-up · T002 CI · T003 migrations baseline and migrate on deploy · T017 test mode, health check and Coming Soon retirement · T004 roles and access · T029 Airtable base design.

### M1: Content model and design system

T005 tokens and fonts · T006 globals · T007 core collections · T008 form submissions · T009 shell and blocks.

### M2: Release 1 features

T010 donations · T011 pages and seed · T012 form system · T013 Airtable and email · T014 Release 1 forms · T030 cookie consent · T015 tracking.

### M3: Release 1 launch

T018 Release 1 launch.

### M4: Release 2 features

T019 remaining forms · T020 Host Countries · T021 programme · T022 donation webhook · T016 video block · T028 Substack.

### M5: Quality and go-live

T024 accessibility · T025 performance · T027 go-live. (T026 end-to-end suite is deferred.)

## 4. Dependency graph

```
T001 ─┬─ T002
      ├─ T003 ─┬─ T004 ─ T006 ─ T007 ─ T008
      │        └─ T017
      └─ T005
T029 (no dependencies; Amagi signs off the Airtable base)
T005 + T006 + T007 + T017 ─ T009
T009 ─┬─ T010
      ├─ T011
      └─ T012 (needs T008) ─ T013 (needs T029) ─ T014 (needs T011)
T006 + T009 ─ T030
T010 + T011 + T012 + T030 ─ T015
T010 + T011 + T014 + T015 + T017 ─ T018

Release 2:
T009 ─ T016 · T011 ─ T028 · T014 ─ T019 · T011 + T019 ─ T020 ─ T021 · T010 + T013 ─ T022
T016, T019..T022, T028 ─ T024, T025 ─ T027
```

## 5. Practices

### 5.1 Branches and PRs

- Branch per ticket: `ticket/<id>-<slug>`.
- Conventional Commits with the ticket ID, e.g. `feat(forms): shared form system (T012)`. No AI attribution.
- Squash-merge to `main`.

### 5.2 Testing by layer

- **Vitest (`tests/int/`):** access helpers, hooks, validation schemas, Airtable and Stripe wrappers (with recorded fixtures), Substack parsing.
- **Browser checks:** done per ticket with the system Chrome (INSTRUCTIONS §2.3). There is no automated end-to-end suite for now (T026 deferred).

### 5.3 Definition of done (every ticket)

1. `pnpm typecheck && pnpm lint && pnpm test:int && pnpm build` exit 0.
2. Every AC verified by its stated method, with evidence in the report.
3. Migrations created and applied cleanly on a fresh database (`pnpm payload migrate` from empty).
4. Types and import map regenerated if the schema or admin components changed.
5. No hard-coded copy, raw hex colours, personal data in tracking, or forbidden wording (`CLAUDE.md` hard rules).
6. Visual changes screenshotted at 390px and 1280px.
7. `docs/SPEC.md` updated in the same PR if behaviour diverged.

## 6. Risks

| Risk                                                      | Mitigation                                                                 |
| --------------------------------------------------------- | -------------------------------------------------------------------------- |
| Amagi inputs arrive late (copy, dropdown values, amounts) | Content lives in the CMS; seed placeholders; editors fill in later         |
| Vercel Hobby limits before launch                         | Nothing in Release 1 needs Pro; T018 moves to Amagi's Pro team             |
| An automated merge breaks production                      | Test mode until launch; Instant Rollback; D9 decides the gate after launch |
| Test data leaks before launch                             | Test mode (T017) keeps Stripe, Airtable and email off live accounts        |
| A migration breaks the live deployment                    | Backward-compatible migrations (SPEC §11.2); Instant Rollback              |
| Tracking spec changes                                     | Event names and attributes centralised in `src/lib/tracking/`              |
| Existing users locked out by roles                        | T004 backfills existing users to `admin`                                   |
