- Don't use `this` inside of class `static { }` blocks
  - KubeJS shares global scope across files and the TypeScript compiled code will get overridden leading to undefined function calls.

- Priorities
  - 10000: Class loading
  - 1000: Utility

- A subclass must have a lower priority than their superclass



Credits:
Co-authored-by: crisisapart <crisisapart@users.noreply.github.com>