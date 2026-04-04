
## Language Quirks
- Don't use `this` inside of class `static { }` blocks
  - KubeJS shares global scope across files and the TypeScript compiled code will get overridden leading to undefined function calls.
- `Java String !== JS string` when it comes to `Map<K, V>` and `Set<T>` indexing.
  - Java String must be prepended with `""` in order to coerce to a JS string
- `Map<K, V>` must have an object for `V`, no primitives like `number` or `boolean`.

## Rules
- All native event listeners need to be wrapped in a try catch block
- Getters should always be idempotent

## Script Priority Loading
  - 10000: Class loading
  - 9000: Global functions
  - 1000: Utility

A subclass must have a lower priority than their superclass



## Credits
crisisapart <https://github.com/crisisapart>
  - Basic skills for Dunestrider
  - Some loot table modifications
  - Some gameplay enhancements