# Airtable base: Amagi CBHS CRM

The Airtable base the website's forms write to (SPEC §9.1). **The base is the source of truth**: Amagi builds and changes it, and the site adapts. This document describes the base as the site uses it on 9 October 2026.

- Base: `Amagi CBHS CRM`, ID `app1SgLnjxkPZ9v4X`. One base for testing and production.
- The site refers to every table, field and choice **by ID** (`src/config/airtable.ts`), so renaming anything is safe.
- `pnpm airtable:check` confirms the base still has everything the site writes to.

## Rules for the base

- **Renaming** a table, field or select choice is always safe.
- **Deleting** a field the site writes to (marked below), or changing its type to one that doesn't fit, stops that form syncing. Run `pnpm airtable:check` or ask the developers first. Submissions are never lost: they wait in the website's admin until the base is fixed and the sync is retried.
- **Adding** fields, views, interfaces and automations is always safe. The site ignores fields it doesn't write to.
- **Options:** the forms read their options from the base every five minutes. Add, rename or remove a record in a lookup table (below), or a choice on a select field, and the forms follow.
- **Single or multiple select:** the site sends every ticked choice to a multiple select, and only the first ticked choice to a single select. Keep `Follow-up preferences` a multiple select so nothing is dropped.
- **Test submissions** go to this base too. They use obvious names ("Testy Testerson"); delete them by hand.
- **No health questions** on any form or in any field the site writes (SPEC §3.4).

## Form tables

One table per website form. Each submission becomes one record. There is no contacts table: someone who submits twice has two records.

Shared fields, written on every form table:

| Field                   | Type                       | Site field | Notes                                    |
| ----------------------- | -------------------------- | ---------- | ---------------------------------------- |
| `Name` / `Full Name`    | Single line text (primary) | `name`     |                                          |
| `Email`                 | Email                      | `email`    | Lower-cased                              |
| `Phone/Whatsapp`        | Phone number               | `phone`    | Optional                                 |
| `Country / location`    | Link to `Locations`        | `location` | Country leads filter their views on this |
| `Follow-up preferences` | Multiple select            | `followUp` | Optional                                 |

The site does not write `Permissions`: the forms ask `Follow-up preferences` instead (decided 9 October 2026). It does not write `Location` (single select) either. It duplicates `Country / location`; Amagi can delete it.

### `Registered Interest` (Register Interest form)

Also written: `Organisation / affiliation`, `Role / Title`, `Experiance` (link to `Experience`; "Which best describes you?"), `Engagement` (link), `Area of work` (link), `Other` (other area of work), `Interest / potential contribution`, `financial or in-kind support`.

Not written (Amagi's own): `About`, `Organisation`, `Function`, `Opt-in Status`, `Consent Notes`, `Primary Themes of Interest`, `Notes`, `Last Contact Date`, `Next Planned Contact`, `Interactions`, `Enquiry type`, `Enquiry`, `Outlet`.

### `Join the consultation` (Call to Action consultation form)

Also written: `Organisation / affiliation`, `Role / Title`, `Experience` (link), `Action area` (link to `Action areas`).

### `Partner with the Summit` (Partner form, Release 2)

Also written: `Organisation / affiliation`, `Role / Title`, `Website`, `Experience` (link), `Industry` (link to `Industries`), `Other` (other industry), `Involvement`.

### `Propose a Brain Health Relay activity` (Relay form, Release 2)

Also written: `Organisation / affiliation`, `Role / Title`, `Experience ` (link), `Date of activity ` (date only), `About` (the proposed activity).

### `Enquiries` (Get in touch form, Release 2)

Also written: `Enquiry type` (General or Media), `Outlet` (Media only), `Organisation / affiliation`, `Role / Title`, `Enquiry` (the message).

Not written (Amagi's own): `About`, `Engagement`, `Area of work`, `Interest / potential contribution`, `financial or in-kind support`, `Organisation`, `Function`, `Opt-in Status`, `Consent Notes`, `Primary Themes of Interest`, `Notes`, `Last Contact Date`, `Next Planned Contact`, `Interactions`.

## Lookup tables

Each record is one option on the forms; its primary field is the label.

| Table           | Primary field | Used for                                    |
| --------------- | ------------- | ------------------------------------------- |
| `Locations`     | `Area`        | "Where are you based?" on every form        |
| `Experience`    | `Experiance`  | "Which best describes you?"                 |
| `Engagement`    | `Name`        | How someone would like to be involved       |
| `Areas of work` | `Name`        | Register Interest                           |
| `Industries`    | `Name`        | Partner                                     |
| `Action areas`  | `Name`        | Consultation: the five Call to Action areas |

## Not written by the site

`People`, `Contacts OLD -`, `Organisations`, `Supporter Levels`, `Themes / Access Areas`, `Engagement & Impact Snapshots`, `Events / Series`, `Interactions`.

## Not in the base

- **UTM and source page:** the site saves them on each submission in its admin, not in Airtable. Add `UTM source`, `UTM medium`, `UTM campaign`, `UTM term`, `UTM content` (single line text) and `Source page` (URL) to the form tables if Amagi wants them in Airtable, and the developers will map them.
- **Donations** (SPEC §7 step 5, Release 2): needs a table before T022.
