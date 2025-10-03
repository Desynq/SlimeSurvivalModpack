- Don't use `this` inside of class `static { }` blocks
  - KubeJS shares global scope across files and the TypeScript compiled code will get overriden leading to missing function calls.



Credits:
Co-authored-by: crisisapart <crisisapart@users.noreply.github.com>