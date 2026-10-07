import * as migration_20261006_141524_baseline from './20261006_141524_baseline'
import * as migration_20261006_141525_enable_rls from './20261006_141525_enable_rls'
import * as migration_20261006_144657_add_user_role from './20261006_144657_add_user_role'
import * as migration_20261007_135743_t006_globals from './20261007_135743_t006_globals'

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
]
