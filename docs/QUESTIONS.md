# Questions for Amagi

Open questions for Amagi Health about the CBHS 2026 website and its Airtable base. Answers go back into `docs/SPEC.md` and `docs/AIRTABLE.md`.

**Decided:** where the current Google Forms and the website docs (`docs/SPEC.md`) disagree, the docs win. The website's forms ask what the docs say, not everything the Google Forms ask.

## TLDR

- **Do Partner and Relay stay on Google Forms until Release 2, and should past responses be imported?** (questions 1–2)
- **Which lists?** Which territories, industries and audience types do the forms use? (questions 3–5)
- **What is the Kingston Declaration?** Is it the same as the Caribbean Call to Action on Brain Health? (question 6)
- **Airtable sign-off, and donor details in Airtable** (questions 7–8)
- **Donation amounts and currency** (question 9)
- **Who supplies copy, and when is Release 2?** (questions 10–11)

## Forms

1. **Should Partner Sign-Up and Relay Sign-Up stay on Google Forms until Release 2?** The website versions are planned for after the 16 October launch. Release 2 doesn't have a date yet (question 11).

2. **Should the existing Google Form responses be imported into Airtable?** If so, which forms, and should they be matched to people by email? Only the answers the website's forms also ask would have somewhere to go.

## Lists

3. **Territories.** Is this the list of 40 locations from the Partner and Relay Google Forms, used everywhere a form asks where someone is based? It lists Trinidad and Tobago separately and includes four diaspora options:
   - United States
   - Canada
   - United Kingdom
   - other

4. **Industry.** Which list should organisation forms use?
   - The 8 "areas of work" from Register Interest, plus "Other":
     - health and care
     - technology
     - government
     - finance
     - civil society
     - academia
     - climate
     - philanthropy
   - The 20 "organisation types" from the Partner Google Form.

5. **Audience types.** Is this list right?
   - country lead
   - activity host
   - partner organisation
   - supporter
   - connector
   - lived experience
   - researcher or clinician
   - media
   - diaspora
   - general public

## Wording

6. **Kingston Declaration and the Caribbean Call to Action on Brain Health.** The Google Forms talk about the Kingston Declaration; the website has a page for the Caribbean Call to Action on Brain Health. Are these the same document?

## Airtable

7. ~~**Sign-off of the base design.**~~ Answered 9 October 2026: the base Amagi built is the source of truth, and `docs/AIRTABLE.md` describes it.

8. **Donor names and emails.** Should donors' names and emails from Stripe go into Airtable? Until you decide, they don't.

## Donations

9. **Suggested amounts and currency.** Which amounts should the Donate page suggest, and in which currency? The website currently uses placeholders.

## Launch

10. **Copy.** Who supplies the final copy for every page, including privacy, cookies and terms, and by when? Launch is 16 October.

11. **Release 2 date.** When should these go live?
    - Host Countries
    - Programme
    - News from Substack
    - the Partner, Relay and Contact forms
    - the donations record in Airtable

## Summit Week page

12. **Anchor Day date.** Answered 3 November 2026: the Anchor Day is Monday 16 November. Nothing on the site gives a date yet; every mention says it takes place in Jamaica.

13. **Livestreaming.** The Summit Week page leaves out "Key sessions will be streamed" until livestreaming is confirmed. Is it?

14. **Changing Minds.** What is the Substack address for "Subscribe to Changing Minds"? The button is left out until we have it.

15. **"Propose an activity" form.** Your copy has a separate "Host an Activity" form. The site has one form for both, "Propose a Brain Health Relay activity" at `/relay`. Is one form enough?

## Team (About page)

16. **Roles.** The folder is called "Country Leads/Liaisons", but it doesn't say who is which. The site shows each person's country, and only Ishtar's role ("Convenor"). What role should each person show, for example "Country lead, Jamaica"?

17. **Michèle Saunders Clavery's photo.** The headshot has a grey-and-white checkerboard printed into its background (a transparency pattern saved into the image). Could she send a photo with a plain background?

18. **Trinidad and Tobago.** Michèle is listed under Trinidad and Dr Naila Edwards under Tobago, as in your folder. Should both say "Trinidad and Tobago"?

## Programme and session registration

19. **Themes.** The programme can be filtered by theme. Which themes should it use, for example Financing, Caregiver advice, Prevention, Policy? Or should it use the four streams (Anchor Day, Country Weeks, Brain Health Relay, Online and Diaspora)?

20. **Locations.** The programme has a tab for Online and for Jamaica, Suriname, Barbados, Trinidad and Tobago and the Cayman Islands. Is that the right list, and is each city right (Kingston, Paramaribo, Bridgetown, Port of Spain, George Town)?

21. **Registration confirmation.** After registering for an in-person session, people see and are emailed "You're registered. We'll email you nearer the time with anything you need to know before the session." Is that right? You can change it in the CMS under Forms.

22. **Full sessions.** Should sessions have a place limit? For now an editor unticks "Registration open" when a session is full, and the Register button disappears.

23. **Summit dates news item.** Resolved 6 November 2026: you updated the Anchor Day note on the News page yourself.

24. **Anchor Day FAQ wording.** Resolved 5 November 2026: "What is the Anchor Day? And where is it?" now uses your long description word for word, in three paragraphs.

25. **"Opening" on the programme.** Resolved 5 November 2026: the day note on Monday 16 November now says "Summit week begins", matching the calendar wording.

26. **Relay option wording.** Resolved 6 November 2026: your email of 6 November gives new wording for attendance, registration, activity type and publicity, plus a new question about post-activity material.

27. **Required Relay questions.** Decided 8 November 2026: every new question is required except the attendance follow-up, which shows only when you choose "A specific group". The "Other" activity type asks for a short description when ticked.

28. **"Not decided" wording.** Decided 8 November 2026: both questions now say "Not yet decided".

29. **Intended audience asked twice.** The form already asks for a "Short description, including the intended audience", and now also asks "Who is the activity intended for?". Should we drop "including the intended audience" from the description label? It is unchanged for now.

## PLADRR Jamaica 2027

30. **Privacy text on the expression of interest form.** Decided 10 November 2026: approved by the developers as written, and the form is live at `/pladrr/express-interest`. Please check it, the privacy notice it links to and the workflow behind it.

31. **Confirmation email subject.** Your copy gives no subject line, so the email's subject is its heading for now: "Thank you. We have received your expression of interest in PLADRR Jamaica 2027." What should it be? You can change the heading in the CMS under Forms.

32. **New form wording.** The form shows a word count ("12 of 100 words"), "Keep this to 100 words or fewer" when an answer is too long, and "1 of 2 selected" on the working themes. Is that wording right? The proposed group headings inside the scientific route ("Your perspective", "Your contribution", "Taking part") and a "Step 2 of 3" progress bar are left out until you approve them.

33. **"Suggested FAQs".** Decided 10 November 2026: the heading is "FAQs". You can change it in the CMS.

34. **PLADRR in the header.** PLADRR is linked from the footer and from the PLADRR step of the roadmap on Home and About, not from the header, which is full. Should it replace News in the header?
