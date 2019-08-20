# @swim/angle

[![package](https://img.shields.io/npm/v/@swim/angle.svg)](https://www.npmjs.com/package/@swim/angle)
[![documentation](https://img.shields.io/badge/doc-TypeDoc-blue.svg)](https://docs.swimos.org/js/latest/modules/_swim_angle.html)
[![chat](https://img.shields.io/badge/chat-Gitter-green.svg)](https://gitter.im/swimos/community)

<a href="https://www.swimos.org"><img src="https://docs.swimos.org/readme/marlin-blue.svg" align="left"></a>

**@swim/angle** implements dimensional angle types with unit-aware algebraic
operators, conversions, and parsers.  **@swim/angle** is part of the
[**@swim/ui**](https://github.com/swimos/swim/tree/master/swim-system-js/swim-ui-js/@swim/ui)
framework.

## Installation

### npm

For an npm-managed project, `npm install @swim/angle` to make it a dependency.
TypeScript sources will be installed into `node_modules/@swim/angle/main`.
Transpiled JavaScript and TypeScript definition files install into
`node_modules/@swim/angle/lib/main`.  And a pre-built UMD script can
be found in `node_modules/@swim/angle/dist/main/swim-angle.js`.

### Browser

Browser applications can load `swim-ui.js`—which bundles the **@swim/angle**
library—along with its `swim-core.js` dependency, directly from the Swim CDN.

```html
<script src="https://cdn.swimos.org/js/latest/swim-core.js"></script>
<script src="https://cdn.swimos.org/js/latest/swim-ui.js"></script>
```

Alternatively, the standalone `swim-system.js` script may be loaded
from the Swim CDN, which bundles **@swim/angle** together with all other
[**@swim/system**](https://github.com/swimos/swim/tree/master/swim-system-js/@swim/system)
libraries.

```html
<script src="https://cdn.swimos.org/js/latest/swim-system.js"></script>
```

## Usage

### ES6/TypeScript

**@swim/angle** can be imported as an ES6 module from TypeScript and other
ES6-compatible environments.

```typescript
import * as angle from "@swim/angle";
```

### CommonJS/Node.js

**@swim/angle** can also be used as a CommonJS module in Node.js applications.

```javascript
var angle = require("@swim/angle");
```

### Browser

When loaded by a web browser, the `swim-ui.js` script adds all
**@swim/angle** library exports to the global `swim` namespace.  The
`swim-ui.js` script requires that `swim-core.js` has already been loaded.

The `swim-system.js` script also adds all **@swim/angl** library exports
to the global `swim` namespace, making it a drop-in replacement for
'swim-core.js' and `swim-ui.js` when additional **@swim/system**
libraries are needed.
