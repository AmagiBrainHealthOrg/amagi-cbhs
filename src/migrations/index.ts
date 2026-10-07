import * as migration_20261006_141524_baseline from './20261006_141524_baseline'
import * as migration_20261006_141525_enable_rls from './20261006_141525_enable_rls'
import * as migration_20261006_144657_add_user_role from './20261006_144657_add_user_role'
import * as migration_20261007_135743_t006_globals from './20261007_135743_t006_globals'
import * as migration_20261007_140638_t007_collections from './20261007_140638_t007_collections'
import * as migration_20261007_144302_t011_copy_fields from './20261007_144302_t011_copy_fields'
import * as migration_20261007_144558_t011_content from './20261007_144558_t011_content'
import * as migration_20261007_174846_t008_form_submissions from './20261007_174846_t008_form_submissions'

export const migrations = [
  {
    up: migration_20261006_141524_baseline.up,
    down: migration_20261006_141524_baseline.down,
    name: '20261006_141524_baseline',
  },
  {
    up: migration_20261006_141525_enable_rls.up,
    down: migration_20261006_141525_enable_rls.down,
    name: '20261006_141525_enable_rls',
  },
  {
    up: migration_20261006_144657_add_user_role.up,
    down: migration_20261006_144657_add_user_role.down,
    name: '20261006_144657_add_user_role',
  },
  {
    up: migration_20261007_135743_t006_globals.up,
    down: migration_20261007_135743_t006_globals.down,
    name: '20261007_135743_t006_globals',
  },
  {
    up: migration_20261007_140638_t007_collections.up,
    down: migration_20261007_140638_t007_collections.down,
    name: '20261007_140638_t007_collections',
  },
  {
    up: migration_20261007_144302_t011_copy_fields.up,
    down: migration_20261007_144302_t011_copy_fields.down,
    name: '20261007_144302_t011_copy_fields',
  },
  {
    up: migration_20261007_144558_t011_content.up,
    down: migration_20261007_144558_t011_content.down,
    name: '20261007_144558_t011_content',
  },
  {
    up: migration_20261007_174846_t008_form_submissions.up,
    down: migration_20261007_174846_t008_form_submissions.down,
    name: '20261007_174846_t008_form_submissions',
  },
]
