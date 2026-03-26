
## Language Quirks
- Don't use `this` inside of class `static { }` blocks
  - KubeJS shares global scope across files and the TypeScript compiled code will get overridden leading to undefined function calls.
- Java String !== JS string when it comes to Map<K, V> indexing.
  - Java String must be prepended with `""` in order to coerce to a JS string

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