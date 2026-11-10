import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { DonateBanner } from '@/components/DonateBanner'
import { countryHref, getCountries } from '@/lib/countries'
import { getGlobal } from '@/lib/globals'

import './countries.css'

export const metadata: Metadata = { title: 'Countries | Caribbean Brain Health Summit' }

export default async function CountriesPage() {
  const [{ index }, countries] = await Promise.all([getGlobal('country-pages'), getCountries()])

  return (
    <>
      <section className="page-hero country-hero">
        <div className="page-hero-inner">
          <Breadcrumbs
            label="Breadcrumb"
            items={[{ label: 'Home', href: '/' }, { label: 'Countries' }]}
          />
          {index?.kicker && <p className="page-kicker">{index.kicker}</p>}
          <h1>{index?.heading || 'Countries'}</h1>
          {index?.lead && <p className="page-hero-lead">{index.lead}</p>}
        </div>
      </section>
      {countries.length > 0 && (
        <section className="v1-section" aria-label="Host countries">
          <ul className="country-index">
            {countries.map(({ id, slug, name, tagline }) => (
              <li key={id}>
                <Link href={countryHref(slug)}>
                  <h2>{name}</h2>
                  <p>{tagline}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <DonateBanner />
    </>
  )
}
