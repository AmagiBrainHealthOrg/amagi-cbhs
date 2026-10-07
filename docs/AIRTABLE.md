# Airtable base: CBHS 2026

The Airtable base the website writes to. Build it exactly as below: the site finds tables and fields **by name**, so a renamed or missing table or field stops the sync. Status: draft, waiting for Amagi's sign-off (SPEC §13 D7).

## Overview

Build **two identical bases**:

- **CBHS 2026 (Test):** used before launch and for testing. Every record it gets has `Test` ticked.
- **CBHS 2026:** the production base, owned by Amagi. The site starts writing here at launch.

Each base has seven tables:

| Table                         | One record per                              | Release |
| ----------------------------- | ------------------------------------------- | ------- |
| `Contacts`                    | Person, matched by email                    | 1       |
| `Register Interest`           | Register Interest form submission           | 1       |
| `Call to Action Consultation` | Call to Action consultation form submission | 1       |
| `Partner Sign-Ups`            | Partner Sign-Up form submission             | 2       |
| `Relay`                       | Brain Health Relay form submission          | 2       |
| `Contact Enquiries`           | Contact and media form submission           | 2       |
| `Donations`                   | Completed donation on Stripe                | 2       |

Build all seven now, including the Release 2 tables, so the base is only built once.

### Rules for the base

- **Written by the site** (marked **Site** below): don't rename these fields, change their type or delete them. If a change is needed, tell the developers first: the names live in one config file and can be changed there.
- **Amagi may add** any other fields, views, filters, colours, interfaces and automations freely. The site ignores fields it doesn't know about.
- **Single select fields:** create them with the options listed. The site sends the stored value (for example `country_lead`). If it sends a value the field doesn't have yet, Airtable adds it as a new option automatically, so a new dropdown value on the site never breaks the sync.
- **Dates:** "Date and time" fields use GMT/UTC and show the time.
- **Personal data:** names, emails and phone numbers go only into `Contacts` and the form tables. Donor names and emails are **not** sent to Airtable for now (SPEC §13 D8).

## Shared field groups

Several tables use the same groups of fields. They are listed once here and referred to below.

### Classification

| Field           | Type          | Notes                                                                                              |
| --------------- | ------------- | -------------------------------------------------------------------------------------------------- |
| `Territory`     | Single select | Options to be confirmed by Amagi (SPEC §13 D3). Each country lead filters their view on this field |
| `Audience type` | Single select | Options below                                                                                      |
| `Industry`      | Single select | Organisation forms only. Options to be confirmed by Amagi (SPEC §13 D3)                            |

`Audience type` options (value, then what it means):

| Value                  | Label                   |
| ---------------------- | ----------------------- |
| `country_lead`         | Country lead            |
| `activity_host`        | Activity host           |
| `partner_organisation` | Partner organisation    |
| `supporter`            | Supporter               |
| `connector`            | Connector               |
| `lived_experience`     | Lived experience        |
| `researcher_clinician` | Researcher or clinician |
| `media`                | Media                   |
| `diaspora`             | Diaspora                |
| `general_public`       | General public          |

### Consents

Three separate checkboxes, unticked by default on the form. Each one is independent.

| Field                  | Type     | Means the person agreed to                |
| ---------------------- | -------- | ----------------------------------------- |
| `Consent: contact`     | Checkbox | Being contacted by Amagi about the Summit |
| `Consent: public name` | Checkbox | Their name being shown publicly           |
| `Consent: share story` | Checkbox | Their story being shared                  |

### UTM

Where the visitor came from, captured from the link they landed on. Any of these can be blank.

| Field          | Type             |
| -------------- | ---------------- |
| `UTM source`   | Single line text |
| `UTM medium`   | Single line text |
| `UTM campaign` | Single line text |
| `UTM term`     | Single line text |
| `UTM content`  | Single line text |

## Tables

### `Contacts`

One record per person. When someone submits a form, the site looks them up by `Email`: if they exist it updates their record, otherwise it creates one. Consents and classification always hold the **latest** values the person gave.

| Field                                      | Type                         | Written by | Notes                                                                       |
| ------------------------------------------ | ---------------------------- | ---------- | --------------------------------------------------------------------------- |
| `Email`                                    | Email (**primary field**)    | Site       | Lower-cased. The match key: keep it unique                                  |
| `Name`                                     | Single line text             | Site       | Latest value                                                                |
| `Phone`                                    | Phone number                 | Site       | Latest value given. Optional on every form; never cleared by a blank answer |
| `Organisation`                             | Single line text             | Site       | Latest value, when the form asks for it                                     |
| Classification                             | See above                    | Site       | `Territory`, `Audience type`, `Industry`. Latest values                     |
| Consents                                   | See above                    | Site       | Latest values                                                               |
| `First UTM source` … `First UTM content`   | Single line text × 5         | Site       | From their first submission. Never overwritten                              |
| `Latest UTM source` … `Latest UTM content` | Single line text × 5         | Site       | From their latest submission                                                |
| `First seen`                               | Date and time                | Site       | Their first submission. Never overwritten                                   |
| `Last seen`                                | Date and time                | Site       | Their latest submission                                                     |
| `Test`                                     | Checkbox                     | Site       | Ticked when the record came from the test site                              |
| Linked submissions                         | Link (created automatically) | Airtable   | Airtable adds one reverse link field per form table below                   |

### Every form table

All five form tables start with the same fields, then add their own (listed per table).

| Field           | Type                                 | Written by | Notes                                                                     |
| --------------- | ------------------------------------ | ---------- | ------------------------------------------------------------------------- |
| `Submission ID` | Single line text (**primary field**) | Site       | The website's ID for the submission, so a record can be traced back to it |
| `Contact`       | Link to `Contacts` (one record)      | Site       | The person who submitted it                                               |
| `Name`          | Single line text                     | Site       | As given on this form                                                     |
| `Email`         | Email                                | Site       | As given on this form                                                     |
| `Phone`         | Phone number                         | Site       | Phone or WhatsApp, as given on this form. Optional, so often blank        |
| Classification  | See above                            | Site       | `Territory`, `Audience type`; `Industry` only on `Partner Sign-Ups`       |
| Consents        | See above                            | Site       | As given on this form                                                     |
| UTM             | See above                            | Site       | For this visit                                                            |
| `Source page`   | URL                                  | Site       | The page the form was on                                                  |
| `Submitted at`  | Date and time                        | Site       |                                                                           |
| `Test`          | Checkbox                             | Site       | Ticked when the record came from the test site                            |

### `Register Interest` (Release 1)

No extra fields.

### `Call to Action Consultation` (Release 1)

The form states clearly that registering is **not** an endorsement of the Call to Action.

| Field              | Type             | Written by | Notes                               |
| ------------------ | ---------------- | ---------- | ----------------------------------- |
| `Organisation`     | Single line text | Site       | Optional on the form                |
| `Role`             | Single line text | Site       |                                     |
| `Area of interest` | Single select    | Site       | One of the five action areas, below |

`Area of interest` options (the five action areas on the Call to Action page; editors can reword them on the site, and a new wording arrives as a new option):

- Brain health as workforce and development capacity
- Coordinated investment in brain-health infrastructure
- Workforce capacity and support for family carers
- Caribbean-specific evidence for Caribbean-specific action
- Sustained coordination, review and accountability

### `Partner Sign-Ups` (Release 2)

An organisation form, so it also has `Industry` (see Classification).

| Field          | Type             | Written by | Notes                           |
| -------------- | ---------------- | ---------- | ------------------------------- |
| `Organisation` | Single line text | Site       |                                 |
| `Website`      | URL              | Site       |                                 |
| `Involvement`  | Long text        | Site       | "How you'd like to be involved" |

### `Relay` (Release 2)

The Brain Health Relay. Each country lead gets a view filtered on `Territory`.

| Field               | Type             | Written by | Notes                |
| ------------------- | ---------------- | ---------- | -------------------- |
| `Organisation`      | Single line text | Site       | Optional on the form |
| `Proposed activity` | Long text        | Site       |                      |
| `Activity date`     | Date             | Site       | Date only, no time   |

### `Contact Enquiries` (Release 2)

| Field          | Type             | Written by | Notes                       |
| -------------- | ---------------- | ---------- | --------------------------- |
| `Enquiry type` | Single select    | Site       | Options: `general`, `media` |
| `Message`      | Long text        | Site       |                             |
| `Outlet`       | Single line text | Site       | Media enquiries only        |

### `Donations` (Release 2)

One record per completed payment on Stripe. Not linked to `Contacts`: donor names and emails aren't sent (SPEC §13 D8).

| Field         | Type                                 | Written by | Notes                                                |
| ------------- | ------------------------------------ | ---------- | ---------------------------------------------------- |
| `Session ID`  | Single line text (**primary field**) | Site       | The Stripe Checkout session ID, to find it in Stripe |
| `Amount`      | Number, 2 decimal places             | Site       | In the currency below (for example `25.00`)          |
| `Currency`    | Single line text                     | Site       | Three-letter code, lower case (for example `usd`)    |
| `Donated at`  | Date and time                        | Site       |                                                      |
| UTM           | See above                            | Site       | From the visit that led to the donation              |
| `Source page` | URL                                  | Site       | The page the visitor clicked Donate on               |
| `Test`        | Checkbox                             | Site       | Ticked for Stripe test-mode payments                 |

## Access token

The site needs a personal access token for each base. Create one per base, scoped to that base only.

1. Sign in to Airtable as the account that owns the base (for production, Amagi's account).
2. Go to <https://airtable.com/create/tokens> and choose **Create token**.
3. Name it `CBHS website (Test)` or `CBHS website (Production)`.
4. Add these scopes, and no others:
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read`
5. Under **Access**, add only the matching base.
6. Create the token and copy it once.
7. Send the token to the developers through a password manager or another secure channel, never by email or chat. Also send the base ID: it starts with `app` and is in the base's URL (`airtable.com/appXXXXXXXXXXXXXX/…`).

## Open points

| Point                                    | Who   | Until then                                                              |
| ---------------------------------------- | ----- | ----------------------------------------------------------------------- |
| Territory and industry options (D3)      | Amagi | Create the fields with no options; values arrive as the site sends them |
| Donor name and email in `Donations` (D8) | Amagi | Not sent                                                                |
| Sign-off of this structure (D7)          | Amagi | The site's Airtable sync can't be finished                              |
