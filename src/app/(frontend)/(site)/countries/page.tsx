import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { DonateBanner } from '@/components/DonateBanner'

import { countries } from '@/config/countries'
import './countries.css'

export const metadata: Metadata = { title: 'Countries | Caribbean Brain Health Summit' }

export default function CountriesPage() {
  return (
    <>
      <section className="page-hero country-hero">
        <div className="page-hero-inner">
          <Breadcrumbs
            label="Breadcrumb"
            items={[{ label: 'Home', href: '/' }, { label: 'Countries' }]}
          />
          <p className="page-kicker">Where it happens</p>
          <h1>Across the region, and online</h1>
          <p className="page-hero-lead">
            Each host country runs its own programme of free, local activity. Online sessions let
            anyone in the region or the diaspora join in.
          </p>
        </div>
      </section>
      <section className="v1-section" aria-label="Host countries">
        <ul className="country-index">
          {countries.map(({ slug, name, tagline }) => (
            <li key={slug}>
              <Link href={`/countries/${slug}`}>
                <h2>{name}</h2>
                <p>{tagline}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <DonateBanner />
    </>
  )
}
