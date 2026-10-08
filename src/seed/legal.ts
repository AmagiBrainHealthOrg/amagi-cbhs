import { bold, bullets, heading, link, paragraph, richText } from './lexical'

// Draft copy for Amagi's review (not legal advice). It describes what the site does at
// Release 1: see the inventory in the PR that added it.

const LAST_UPDATED = 'Last updated: 8 October 2026'

// TODO: confirm the privacy contact address with Amagi; this is the footer's placeholder.
const CONTACT_EMAIL = 'info@amagibrainhealth.org'

const company =
  'Amagi Health Ltd is a company registered in England (company number 15274813). Our registered office is 86-90 Paul Street, London, England, United Kingdom, EC2A 4NE.'

const email = link(CONTACT_EMAIL, `mailto:${CONTACT_EMAIL}`)

export const privacyContent = richText(
  paragraph(LAST_UPDATED),
  paragraph(
    'This policy explains what personal data Amagi Health Ltd collects through amagisummit.org, why we collect it, who we share it with and the rights you have.',
  ),

  heading('Who we are'),
  paragraph(
    'Amagi Health Ltd ("Amagi", "we", "us") runs the Caribbean Brain Health Summit and this website.',
  ),
  paragraph(company),
  paragraph(
    'For the personal data described here, Amagi is the controller. That means we decide how and why it is used, and we are responsible for looking after it.',
  ),

  heading('How to contact us'),
  paragraph(
    'Email ',
    email,
    ' with "Privacy" in the subject line, or write to us at our registered office. You can use either to ask a question or to exercise any of your rights.',
  ),

  heading('What we collect and why'),
  heading('When you fill in a form', 'h3'),
  paragraph(
    'Our Register Interest and Call to Action consultation forms ask for some or all of the following:',
  ),
  bullets(
    'your name and email address',
    'a phone or WhatsApp number, if you choose to give one',
    'your organisation and role, if relevant',
    'the country or territory you are in, and which group best describes you (for example, family carer or researcher)',
    'your area of interest in the Call to Action, and anything you write in the form',
    'your answers to the consent boxes on the form',
  ),
  paragraph(
    'We also record the date you sent the form and, if you arrived through one of our campaign links, which campaign it was. We never ask about your health.',
  ),
  paragraph('We use this information:'),
  bullets(
    [
      bold('To confirm your registration, reply to you and run the Summit. '),
      'Our lawful basis is our legitimate interest in organising the Summit and responding to the people who contact us.',
    ],
    [
      bold('To include your views in the Call to Action consultation. '),
      'Our lawful basis is our legitimate interest in developing the Call to Action with the people it affects. We only name you publicly if you agree (see below).',
    ],
    [
      bold('To send you news and updates, '),
      'only if you tick the box to agree. Our lawful basis is your consent.',
    ],
    [
      bold('To name you or your organisation publicly, or to share your story, '),
      'only if you tick the box for each. Our lawful basis is your consent.',
    ],
    [
      bold('To understand which of our campaigns bring people to the site. '),
      'Our lawful basis is our legitimate interest in using our resources well.',
    ],
  ),
  paragraph(
    'You can withdraw your consent at any time by emailing us or using the unsubscribe link in any email we send. This does not affect anything we did before you withdrew it.',
  ),

  heading('When you donate', 'h3'),
  paragraph(
    'Donations are taken by Stripe on its own secure checkout page. Stripe collects your card details, name, email address and billing details. Your card details never reach our website and we never see them.',
  ),
  paragraph(
    'Stripe tells us the amount, the currency and whether the payment succeeded. Your name and email address are kept in our Stripe account so we can deal with any questions about your donation. We also attach to the payment the page you donated from and, if you arrived through a campaign link, which campaign it was.',
  ),
  paragraph(
    'Our lawful basis is that we need this information to take your donation, and that the law requires us to keep financial records. Stripe also uses some of this information for its own purposes, such as preventing fraud. See ',
    link("Stripe's privacy policy", 'https://stripe.com/privacy'),
    '.',
  ),

  heading('When you browse the site', 'h3'),
  bullets(
    [
      bold('Server logs. '),
      'Our hosting provider records technical details of each visit, such as your IP address, browser and the pages you request, to keep the site secure and running. Our lawful basis is our legitimate interest in running a secure website.',
    ],
    [
      bold('Analytics. '),
      'Plausible Analytics counts visits and shows us which pages are useful: the page, the site that sent you, your browser, device type and country, and whether you clicked Donate or completed a donation (the amount, never who gave it). It sets no cookies, stores nothing in your browser and does not identify you. Your IP address is used only to tell visits apart for a day and is never stored. Our lawful basis is our legitimate interest in understanding how the site is used.',
    ],
    [
      bold('Fonts. '),
      "Some of the site's lettering is loaded from Adobe Fonts, so your browser sends your IP address to Adobe when a page loads. Our lawful basis is our legitimate interest in presenting the site properly.",
    ],
  ),
  paragraph(
    'Our ',
    link('cookies page', '/cookies'),
    ' lists every cookie and similar item the site stores in your browser.',
  ),

  heading('When you email us', 'h3'),
  paragraph(
    'We keep your message and contact details so we can reply and keep a record of our conversation. Our lawful basis is our legitimate interest in responding to you.',
  ),

  heading('Who we share it with'),
  paragraph(
    'We do not sell your personal data. Supporters of the Summit do not receive attendee contact lists. We share personal data only with organisations that help us run the site and the Summit, and only as much as they need:',
  ),
  bullets(
    [bold('Vercel'), ' hosts the website.'],
    [bold('Supabase'), ' hosts the database and file storage behind the website.'],
    [bold('Airtable'), ' holds our contact records, so we can manage registrations.'],
    [bold('Resend'), ' sends the emails the website sends, such as form confirmations.'],
    [bold('Stripe'), ' processes donations.'],
    [bold('Plausible Analytics'), ' counts visits to the site, with data stored in the EU.'],
    [bold('Google'), ' hosts some of our forms on Google Forms.'],
    [bold('Adobe'), ' provides some of the fonts on the site.'],
    [
      bold('Our web developer and analytics agency'),
      ', who build and look after the site and its analytics reports for us.',
    ],
  ),
  paragraph(
    'We may also share personal data if the law requires it, or to protect the rights, property or safety of Amagi, our visitors or others.',
  ),

  heading('Transfers outside the UK'),
  paragraph(
    'Several of these providers are based in, or store data in, the United States or other countries outside the UK. Where they do, the transfer is protected by the UK Extension to the EU-US Data Privacy Framework, or by the International Data Transfer Agreement or Addendum approved by the Information Commissioner. Contact us if you would like more detail.',
  ),

  heading('How long we keep it'),
  bullets(
    'Form submissions and contact records: for up to 3 years after you last contacted us, unless you ask us to delete them sooner.',
    'Donation records: 6 years after the end of the financial year in which you donated, as UK law requires for financial records.',
    'Server logs: a short period, set by our hosting provider, usually no more than 30 days.',
    'Emails: for as long as we need them to deal with your enquiry, and no more than 3 years.',
  ),

  heading('Your rights'),
  paragraph('Under UK data protection law you have the right to:'),
  bullets(
    'ask for a copy of the personal data we hold about you',
    'ask us to correct anything that is wrong or incomplete',
    'ask us to delete your personal data',
    'ask us to limit how we use it',
    'object to us using it on the basis of our legitimate interests',
    'ask us to send it to you, or to another organisation, in a common format',
    'withdraw your consent at any time, where we rely on it',
  ),
  paragraph(
    'To use any of these rights, email ',
    email,
    '. It is free, and we will reply within one month. We may need to check your identity first.',
  ),

  heading('Complaints'),
  paragraph(
    "If you are unhappy with how we have handled your personal data, please tell us first so we can try to put it right. You also have the right to complain to the Information Commissioner's Office (ICO), the UK regulator, at ",
    link('ico.org.uk/make-a-complaint', 'https://ico.org.uk/make-a-complaint/'),
    ' or on 0303 123 1113.',
  ),

  heading('Keeping your data safe'),
  paragraph(
    'We use encrypted connections, restrict access to the people who need it, and choose providers that keep data secure. No website can be completely secure, but we take reasonable steps to protect your information.',
  ),

  heading('Children'),
  paragraph(
    'This site is for adults. Our forms are not meant for anyone under 13, and we do not knowingly collect their personal data.',
  ),

  heading('Changes to this policy'),
  paragraph(
    'We will update this policy when the way we use personal data changes. The date at the top shows when it last changed.',
  ),
)

const cookie = (name: string, details: string) => [bold(name), ` ${details}`]

export const cookiesContent = richText(
  paragraph(LAST_UPDATED),
  paragraph(
    'This page explains the cookies and similar technologies amagisummit.org uses, and how you can control them.',
  ),

  heading('What cookies are'),
  paragraph(
    'Cookies are small files a website stores in your browser. Session storage is similar, but is cleared when you close the tab. This site only uses the ones it needs to work. Our analytics uses neither.',
  ),

  heading('Strictly necessary'),
  paragraph('These are always on, because the site needs them.'),
  bullets(
    cookie(
      'cbhs_consent',
      "(cookie, set by us). Remembers your answer to the cookie banner, so we don't ask on every page. Lasts 6 months.",
    ),
  ),

  heading('Analytics'),
  paragraph(
    'We use Plausible Analytics to count visits and see which pages are useful. It sets no cookies and stores nothing in your browser, so there is nothing to accept or reject for analytics. It does not identify you, and we never use it for advertising.',
  ),

  heading('Session storage'),
  paragraph(
    'These are kept in your browser only until you close the tab. They stay in your browser unless you send a form or make a donation, when they go with it.',
  ),
  bullets(
    cookie(
      'cbhs_utm',
      '(set by us). If you arrived through one of our campaign links, records which campaign it was.',
    ),
    cookie(
      'cbhs_page_trail',
      '(set by us). Remembers the page you were on before, so a donation can record which page it started from.',
    ),
    cookie(
      'cbhs_donation_tracked',
      '(set by us). After a donation, stops it being counted twice if you reload the thank-you page.',
    ),
  ),

  heading('Cookies for site editors'),
  paragraph(
    'People who edit this website get a cookie that keeps them signed in (payload-token, lasts 2 hours) and, while previewing unpublished changes, one that shows them draft pages. Visitors never receive these.',
  ),

  heading('Other websites'),
  paragraph(
    "When you donate, you pay on Stripe's checkout page, which sets its own cookies to process the payment and prevent fraud. See ",
    link("Stripe's cookie policy", 'https://stripe.com/cookies-policy/legal'),
    '. Adobe Fonts, which supplies some of our lettering, does not set cookies.',
  ),

  heading('Changing your mind'),
  paragraph(
    'Use "Cookie settings" at the bottom of any page to change your choice at any time. You can also block or delete cookies in your browser settings, though the site may not remember your choice if you do.',
  ),
  paragraph(
    'For more on how we use personal data, see our ',
    link('privacy policy', '/privacy'),
    '.',
  ),
)

export const termsContent = richText(
  paragraph(LAST_UPDATED),

  heading('About these terms'),
  paragraph(
    'These terms apply to your use of amagisummit.org, which is run by Amagi Health Ltd ("Amagi", "we", "us"). ',
    company,
  ),
  paragraph('By using the site you accept these terms. If you do not agree, please do not use it.'),

  heading('Using the site'),
  paragraph(
    'You may use the site for lawful purposes only. Please do not try to break, overload or gain unauthorised access to it, introduce viruses or harmful code, or copy its content in bulk by automated means.',
  ),
  paragraph(
    "The information on the site is general information about the Caribbean Brain Health Summit. It is not medical advice. If you are worried about your own health or someone else's, please speak to a qualified health professional.",
  ),
  paragraph(
    'We may change, suspend or withdraw any part of the site at any time. We try to keep it accurate and up to date, but we cannot promise that it always will be.',
  ),

  heading('Summit sessions and registration'),
  paragraph(
    "Summit dates, sessions, speakers and locations may change. Registering your interest on this site does not reserve or guarantee a place at any session. Where places are limited, the session organiser will confirm your place separately. If you book a session on another platform, that platform's own terms also apply.",
  ),

  heading('The Call to Action consultation'),
  paragraph(
    'If you send us comments on the Caribbean Call to Action on Brain Health, you allow us to use, summarise and quote them in developing the Call to Action and reporting on the consultation. We will only name you or your organisation if you agree to it. Taking part in the consultation is not an endorsement of the Call to Action.',
  ),

  heading('Donations'),
  bullets(
    'Donations are made to Amagi Health Ltd and support the Caribbean Brain Health Summit and the work around it.',
    "Payments are processed by Stripe on its secure checkout page. Your card details never reach our website. Stripe's own terms apply to the payment.",
    'You will see the amount and currency before you pay. Stripe emails you a receipt once the payment goes through.',
    'Donations are gifts and are not refundable, unless the payment was made in error or without your authority, or the law requires a refund. If you think something has gone wrong, contact us within 30 days.',
    "We decide how donations are used to support the Summit's work. Please check with a tax adviser whether your donation qualifies for any tax relief where you live.",
  ),

  heading('Intellectual property'),
  paragraph(
    'The content of this site, including its text, images, the Caribbean Brain Health Summit name and logo and the Amagi name and logo, belongs to Amagi or to the people who license it to us. Partner and supporter logos belong to their owners and appear with their permission.',
  ),
  paragraph(
    'You may view the site, print or download pages for your own non-commercial use, and share links to it. Please do not use our names or logos, or reproduce our content for other purposes, without our written permission.',
  ),

  heading('Links to other websites'),
  paragraph(
    'The site links to websites run by others, such as our partners and booking platforms. We are not responsible for their content or for how they use your data.',
  ),

  heading('Our responsibility to you'),
  paragraph(
    'We provide the site free of charge and "as is". As far as the law allows, we are not responsible for any loss or damage that comes from using the site or relying on its content, and we are not liable for any business losses.',
  ),
  paragraph(
    'Nothing in these terms limits our liability for death or personal injury caused by our negligence, for fraud, or for anything else that the law does not allow us to limit.',
  ),

  heading('Your personal data'),
  paragraph(
    'Our ',
    link('privacy policy', '/privacy'),
    ' and ',
    link('cookies page', '/cookies'),
    ' explain how we use personal data.',
  ),

  heading('Changes to these terms'),
  paragraph(
    'We may update these terms from time to time. The date at the top shows when they last changed. Please check this page when you use the site.',
  ),

  heading('Governing law'),
  paragraph(
    'These terms are governed by the law of England and Wales, and the courts of England and Wales have jurisdiction. If you live outside the UK, you may also have rights under the law of your own country.',
  ),

  heading('Contact'),
  paragraph('Questions about these terms can be sent to ', email, '.'),
)
