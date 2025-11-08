- Don't use `this` inside of class `static { }` blocks
  - KubeJS shares global scope across files and the TypeScript compiled code will get overridden leading to undefined function calls.



Credits:
Co-authored-by: crisisapart <crisisapart@users.noreply.github.com>