import * as migration_20261006_141524_baseline from './20261006_141524_baseline';
import * as migration_20261006_141525_enable_rls from './20261006_141525_enable_rls';

export const migrations = [
  {
    up: migration_20261006_141524_baseline.up,
    down: migration_20261006_141524_baseline.down,
    name: '20261006_141524_baseline'
  },
  {
    up: migration_20261006_141525_enable_rls.up,
    down: migration_20261006_141525_enable_rls.down,
    name: '20261006_141525_enable_rls'
  },
];
