# @swim/web

[![package](https://img.shields.io/npm/v/@swim/web.svg)](https://www.npmjs.com/package/@swim/web)
[![documentation](https://img.shields.io/badge/doc-TypeDoc-blue.svg)](http://docs.swim.ai/js/latest/modules/_swim_web.html)
[![chat](https://img.shields.io/badge/chat-Gitter-green.svg)](https://gitter.im/swimos/community)

<a href="https://developer.swim.ai"><img src="https://cdn.swim.ai/images/marlin-blue.svg" align="left"></a>

`@swim/web` implements a thin web application framework built on the `@swim/ui`
toolkit.  `@swim/web` makes it easy to embed [`@swim/ui`](https://www.npmjs.com/package/@swim/ui)
views and [`@swim/ux`](https://www.npmjs.com/package/@swim/ux) widgets in any
web page by simply adding special `swim-` attributes to ordinary HTML elements.
`@swim/web` is a part of the broader [`@swim/system`](https://www.npmjs.com/package/@swim/system)
framework.

## Libraries

The `@swim/web` umbrella package depends on, and re-exports, the following
component libraries:

- **`@swim/site`**
  ([github](https://github.com/swimos/swim/tree/master/swim-system-js/swim-ui-js/%40swim/site),
  [npm](https://www.npmjs.com/package/@swim/site),
  [typedoc](http://docs.swim.ai/js/latest/modules/_swim_site.html)) –
  inimalist components that implement common dynamic website behaviors.
- **`@swim/app`**
  ([github](https://github.com/swimos/swim/tree/master/swim-system-js/swim-ui-js/%40swim/app),
  [npm](https://www.npmjs.com/package/@swim/app),
  [typedoc](http://docs.swim.ai/js/latest/modules/_swim_app.html)) –
  lightweight application loader that dynamically instantiates views and
  controllers declared by `swim-` HTML attributes.

`@swim/web` builds on the [`@swim/core`](https://www.npmjs.com/package/@swim/core)
and [`@swim/ui`](https://www.npmjs.com/package/@swim/ui) frameworks; it has no
additional dependencies.

## Installation

### npm

For an npm-managed project, `npm install @swim/web` to make it a dependency.
TypeScript sources will be installed into `node_modules/@swim/web/main`.
Transpiled JavaScript and TypeScript definition files install into
`node_modules/@swim/web/lib/main`.  And a pre-built UMD script, which
bundles all `@swim/web` component libraries, can be found in
`node_modules/@swim/web/dist/main/swim-web.js`.

### Browser

Browser applications can load `swim-web.js`, along with its `swim-core.js`
and `swim-ui.js` dependencies, from the Swim CDN.

```html
<script src="https://cdn.swim.ai/js/latest/swim-core.js"></script>
<script src="https://cdn.swim.ai/js/latest/swim-ui.js"></script>
<script src="https://cdn.swim.ai/js/latest/swim-web.js"></script>
```

Alternatively, the standalone `swim-system.js` script may be loaded
from the Swim CDN, which bundles `@swim/web` along with all other
[`@swim/system`](https://www.npmjs.com/package/@swim/system) frameworks.

```html
<script src="https://cdn.swim.ai/js/latest/swim-system.js"></script>
```

## Usage

### ES6/TypeScript

`@swim/web` can be imported as an ES6 module from TypeScript and other
ES6-compatible environments.  All component libraries are re-exported,
in their entirety, from the top-level `@swim/web` namespace.

```typescript
import * as swim from "@swim/web";
```

### CommonJS

`@swim/web` can also be used with CommonJS-compatible module systems.
All component libraries are re-exported, in their entirety, from the
top-level `@swim/web` namespace.

```javascript
var swim = require("@swim/web");
```

### Browser

When loaded by a web browser, the `swim-web.js` script adds all component
library exports to the global `swim` namespace.  The `swim-web.js` script
requires that `swim-core.js` and `swim-ui.js` have already been loaded.

The `swim-system.js` script also adds all `@swim/web` component library
exports to the global `swim` namespace, making it a drop-in replacement
for `swim-web.js` when additional `@swim/system` frameworks are needed.
