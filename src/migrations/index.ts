import * as migration_20261006_141524_baseline from './20261006_141524_baseline'
import * as migration_20261006_141525_enable_rls from './20261006_141525_enable_rls'
import * as migration_20261006_144657_add_user_role from './20261006_144657_add_user_role'
import * as migration_20261007_135743_t006_globals from './20261007_135743_t006_globals'
import * as migration_20261007_140638_t007_collections from './20261007_140638_t007_collections'
import * as migration_20261007_144302_t011_copy_fields from './20261007_144302_t011_copy_fields'
import * as migration_20261007_144558_t011_content from './20261007_144558_t011_content'
import * as migration_20261007_174846_t008_form_submissions from './20261007_174846_t008_form_submissions'
import * as migration_20261007_190003_donation_checkout_item from './20261007_190003_donation_checkout_item'
import * as migration_20261008_163317_partners_order_logo_grid_display from './20261008_163317_partners_order_logo_grid_display'
import * as migration_20261008_170000_release_1_content from './20261008_170000_release_1_content'
import * as migration_20261008_174216_plausible_domain from './20261008_174216_plausible_domain'
import * as migration_20261008_175856_plausible_host from './20261008_175856_plausible_host'
import * as migration_20261008_180000_plausible_legal_copy from './20261008_180000_plausible_legal_copy'
import * as migration_20261009_120000_rate_limits from './20261009_120000_rate_limits'
import * as migration_20261009_130000_forms_content from './20261009_130000_forms_content'

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
  {
    up: migration_20261007_190003_donation_checkout_item.up,
    down: migration_20261007_190003_donation_checkout_item.down,
    name: '20261007_190003_donation_checkout_item',
  },
  {
    up: migration_20261008_163317_partners_order_logo_grid_display.up,
    down: migration_20261008_163317_partners_order_logo_grid_display.down,
    name: '20261008_163317_partners_order_logo_grid_display',
  },
  {
    up: migration_20261008_170000_release_1_content.up,
    down: migration_20261008_170000_release_1_content.down,
    name: '20261008_170000_release_1_content',
  },
  {
    up: migration_20261008_174216_plausible_domain.up,
    down: migration_20261008_174216_plausible_domain.down,
    name: '20261008_174216_plausible_domain',
  },
  {
    up: migration_20261008_175856_plausible_host.up,
    down: migration_20261008_175856_plausible_host.down,
    name: '20261008_175856_plausible_host',
  },
  {
    up: migration_20261008_180000_plausible_legal_copy.up,
    down: migration_20261008_180000_plausible_legal_copy.down,
    name: '20261008_180000_plausible_legal_copy',
  },
  {
    up: migration_20261009_120000_rate_limits.up,
    down: migration_20261009_120000_rate_limits.down,
    name: '20261009_120000_rate_limits',
  },
  {
    up: migration_20261009_130000_forms_content.up,
    down: migration_20261009_130000_forms_content.down,
    name: '20261009_130000_forms_content',
  },
]
