import { layout } from './layout'

export const syncAlertEmail = ({
  form,
  id,
  error,
  adminUrl,
}: {
  form: string
  id: number
  error: string
  adminUrl: string
}) =>
  layout(`Airtable sync failed: ${form} submission ${id}`, [
    `A ${form} submission was saved on the website but did not reach Airtable.`,
    `Error: ${error}`,
    `Fix the cause, then press "Retry sync" on the submission: ${adminUrl}`,
  ])
