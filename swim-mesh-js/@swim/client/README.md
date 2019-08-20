# @swim/client

[![package](https://img.shields.io/npm/v/@swim/client.svg)](https://www.npmjs.com/package/@swim/client)
[![documentation](https://img.shields.io/badge/doc-TypeDoc-blue.svg)](http://docs.swim.ai/js/latest/modules/_swim_client.html)
[![chat](https://img.shields.io/badge/chat-Gitter-green.svg)](https://gitter.im/swimos/community)

<a href="https://developer.swim.ai"><img src="https://cdn.swim.ai/images/marlin-blue.svg" align="left"></a>

`@swim/client` is a streaming API client for linking to lanes of stateful Web
Agents using the WARP protocol, enabling massively real-time applications that
continuously synchronize all shared states with ping latency. WARP is like
pub-sub without the broker, enabling every state of a Web API to be streamed,
without interference from billions of queues.  `@swim/client` is part of the
[`@swim/mesh`](https://www.npmjs.com/package/@swim/mesh) framework.

## Overview

### WarpRef

A `WarpRef` is a handle through which WARP downlinks can be opened.
`WarpClient` implements the `WarpRef` interface, as does the exported
`@swim/client` module object, and by extension, the global `swim` namespace
object used web browsers and other non-module contexts.

`WarpRef` instances have four methods that open different kinds of downlinks.
The `downlink` method creates an `EventDownlink` for streaming raw events from
any Web Agent lane.  The `valueDownlink` method creates a `ValueDownlink` for
synchronizing state with a Web Agent value lane.  The `mapDownlink` method
creates a `MapDownlink` for synchronizing state with a Web Agent map lane.
And the `listDownlink` method creates a `ListDownlink` for synchronizing state
with a Web Agent list lane.

```typescript
swim.downlink()
    .hostUri("warp://traffic.swim.services")
    .nodeUri("swim:meta:mesh")
    .laneUri("linkStats")
    .onEvent((value) => console.log(value.toAny()))
    .open();
```

`WarpRef` instances can also be used to observe key lifecycle events.
The `WarpRef.didConnect` method registers an observer callback that
gets invoked whenever a connection to a WARP host is establishes.
The `WarpRef.didDisconnect` method registers an observer callback that
gets invoked whenever a WARP host disconnects.  `WarpRef.didAuthenticate`
registers an observer callback that gets invoked whenever the client
successfully authenticates with a WARP host.  `WarpRef.didDeauthenticate`
gets invoked when a WARP host rejects the client's authentication credentials.
And the `WarpRef.didFail` method registers an observer callback that gets
invoked when the client encounters an unexpected error.

```typescript
swim.didConnect((host) => console.log("connected to", host));
swim.didDisconnect((host) => console.log("disconnected from", host));
swim.didAuthenticate((session, host) => console.log("authenticated to", host, "with session", session.toAny()));
swim.didDeauthenticate((reason, host) => console.log("deauthenticated from", host, "because", reason.toAny()));
swim.didFail((error, host) => console.log("host", host, "failed because", error));
```

### WarpClient

The `WarpClient` class handles connection management and link routing,
and implements the `WarpRef` interface.  In addition to opening downlinks,
`WarpClient` instances can be used to send arbitrary WARP commands, to provide
authentication credentials for hosts, to control network reconnection behavior,
and to create `HostRef`, `NodeRef`, and `LaneRef` scopes to facilitate downlink
management.

The `WarpClient.authenticate` method associates a credentials structure with
a particular host URI.  The credentials will be sent in a WARP `@auth` envelope
whenever the client connects to the specified host.

```typescript
swim.authenticate("warps://example.com", {"@openId": jwt});
```

Distinct `WarpClient` instances can be used to create isolated connection pools
for different security domains.

```typescript
const userClient = new WarpClient();
userClient.authenticate("warps://example.com", {"@openId": userJwt});

const toolClient = new WarpClient();
toolClient.authenticate("warps://example.com", {"@oauth": toolJwt});
```

The `WarpClient.command` method sends a WARP command message to a lane of
a remote node.  `WarpClient.command` takes either three our four arguments.
The three argument `command` overload takes a node URI, a lane URI, and a
command payload.  The node URI must have an authority component that specifies
the host to which the command should be sent.  The four argument `command`
overload takes a host URI, a node URI, a lane URI, and a command payload; the
node URI is interpreted relative to the host URI.

```typescript
swim.command("warp://example.com/house/kitchen", "light", "on");
swim.command("warp://example.com", "/house/kitchen", "light", "off");
```

The `WarpClient.isOnline` method returns `true` when the the client has
access to a network; it can also be used to force a client online or offline.
The `WarpClient.keepOnline` method controls whether or not the client should
automatically reopen connections after a network failure.  Note that the
`keepOnline` state of the client overrides the `keepLinked` state of
individual downlinks.  Setting `keepOnline` to false can be useful for
ephemeral clients, but should typically be left `true`.

```typescript
swim.isOnline(); // true most of the time

swim.isOnline(false); // force offline
swim.isOnline(true); // force online

swim.keepOnline(); // defaults to true

swim.keepOnline(false); // disable network reconnection
```

The `WarpClient.hostRef` method returns a new `HostRef` bound to the given
host URI.   The `WarpClient.nodeRef` method returns a new `NodeRef` bound
to the given host and node URIs.  The `WarpClient.laneRef` method returns
a new `LaneRef` bound to the given host, node, and lane URIs.  

### HostRef

A `HostRef` is a `WarpRef` that automatically provides its bound host URI when
opening downlinks, sending commands, and providing authentication credentials.
`HostRef` instances keep track of all the downlinks they directly open.  When
a `HostRef` is closed, it automatically closes all of its open downlink views.

```typescript
const hostRef = swim.hostRef("warp://traffic.swim.services");
hostRef.downlink()
       .nodeUri("swim:meta:mesh")
       .laneUri("linkStats")
       .onEvent((value) => console.log(value.toAny())})
       .open();
// ...
hostRef.close();
```

The `HostRef.nodeRef` and `HostRef.laneRef` instance methods can be used to
create further resolved `WarpRef` scopes.

```typescript
const hostRef = swim.hostRef("warp://traffic.swim.services");
const nodeRef = hostRef.nodeRef("swim:meta:mesh");
const laneRef = hostRef.laneRef("swim:meta:mesh", "linkStats");
```

### NodeRef

A `NodeRef` is a `WarpRef` that automatically provides its bound host and node
URIs when opening downlinks and sending commands.  `NodeRef` instances keep
track of all the downlinks they directly open.  When a `NodeRef` is closed,
it automatically closes all of its open downlink views.

```typescript
const nodeRef = swim.nodeRef("warp://traffic.swim.services", "swim:meta:mesh");
nodeRef.downlink()
       .laneUri("linkStats")
       .onEvent((value) => console.log(value.toAny())})
       .open();
// ...
nodeRef.close();
```

The `NodeRef.laneRef` instance method can be used to create further resolved
`WarpRef` scopes.

```typescript
const nodeRef = swim.nodeRef("warp://traffic.swim.services", "swim:meta:mesh");
const laneRef = nodeRef.laneRef("linkStats");
```

### LaneRef

A `LaneRef` is a `WarpRef` that automatically provides its bound host, node,
and lane URIs when opening downlinks and sending commands.  `LaneRef` instances
keep track of all the downlinks they directly open.  When a `LaneRef` is closed,
it automatically closes all of its open downlink views.

```typescript
const laneRef = swim.laneRef("warp://traffic.swim.services", "swim:meta:mesh", "linkStats");
laneRef.downlink()
       .onEvent((value) => console.log(value.toAny())})
       .open();
// ...
laneRef.close();
```

### Downlink

A `Downlink` provides a virtual bidirectional stream between the client and a
lane of a remote Web Agent.  WARP clients transparently multiplex all links to
Web Agents on a given host over a single WebSocket connection, and automatically
manage the network connection to each host, including reconnection and
resynchronization after a network failure.  WARP clients also seamlessly handle
multicast event routing when multiple downlinks are opened to the same lane of
the same remote Web Agent.

Downlinks come in several flavors, depending on the WARP subprotocol to which
they conform.  An `EventDownlink` observes raw WARP events, and can be used to
observe lanes of any kind.  A `ValueDownlink` synchronizes a structured value
with a remote value lane.  A `MapDownlink` implements the WARP map subprotocol
to synchronize key-value state with a remote map lane.  A `ListDownlink`
implements the WARP list subprotocol to to synchronize sequential list state
with a remote list lane.

Before opening, a downlink must be addressed with the `hostUri`, `nodeUri`,
and `laneUri` to which the link should connect.  A downlink may also be
configured with a relative `prio`rity, a max `rate`, and an optional `body`
structure that can contain query or other link parameters to be passed to the
remote lane.

The `keepLinked` parameter determines whether or not a downlink should be
automatically reopened after a network failure; it defaults to `true`.  The
`keepSynced` parameter determines whether or not a downlink should synchronize
with the remote lane when opened; it defaults to `true` for stateful lanes.

The `open` method is used to open a downlink after it has been configured.
The `close` method closes a downlink.  Closing a downlink does not necessarily
close the underlying WARP link.  The WARP client will keep a link open so long
as at least one downlink to a given node and lane URI remains open.  This
prevents application components from stepping on each other's toes when they
link to the same lanes of the same Web Agents.  This can happen, for example,
when a UI has a summary view and a detail view both display information derived
from the same remote lane.  The WARP link should not be closed when a detail
view is hidden, if state updates are still required by the summary view.
Events should also not be sent twice: once for the summary view, and once for
the detail view.  Neither the summary view nor the detail view should have to
know about each other.  And no global event dispatcher should be required,
which could introduce consistency problems.  WARP clients efficiently, and
transparently handle all of these cases on behalf of all downlinks.

The `isConnected` method returns `true` if the underlying connection to the
remote host is currently open.  The `isAuthenticated` method returns `true`
if the underlying connection to the remote host is currently authenticated.
The `isLinked` method returns `true` if the logical WARP link is currently
open.  And the `isSynced` method returns `true` if the WARP link is currently
synchronized.

All downlinks support registering `onEvent`, `onCommand`, `willLink`, `didLink`,
`willSync`, `didSync`, `willUnlink`, `didUnlink`, `willConnect`, `didConnect`,
`didDisconnect`, `didClose`, and `didFail` callbacks.

### EventDownlink

An `EventDownlink` provides a raw view of a WARP link.

```typescript
swim.downlink()
    .hostUri("warp://example.com")
    .nodeUri("/house")
    .laneUri("power/meter")
    .onEvent((body) => /* ... */)
    .open();
```

### ValueDownlink

A `ValueDownlink` synchronizes a structured value with a remote value lane.
Value downlinks support registering `willSet` and `didSet` callbacks, in
addition to the standard `Downlink` callbacks.

```typescript
swim.downlinkValue()
    .hostUri("warp://example.com")
    .nodeUri("/house/kitchen")
    .laneUri("light")
    .didSet((value) => /* ... */)
    .open();
```

### MapDownlink

A `MapDownlink` implements the WARP map subprotocol to synchronize key-value
state with a remote map lane.  Map downlinks support registering `willUpdate`,
`didUpdate`, `willRemove`, and `didRemove` callbacks, in addition to the
standard `Downlink` callbacks.

```typescript
swim.downlinkMap()
    .hostUri("warp://example.com")
    .nodeUri("/house")
    .laneUri("rooms")
    .didUpdate((key, value) => /* ... */)
    .didRemove((key) => /* ... */)
    .open();
```

### ListDownlink

A `ListDownlink` implements the WARP list subprotocol to to synchronize
sequential list state with a remote list lane.  List downlinks support
registering `willUpdate`, `didUpdate`, `willMove`, `didMove`, `willRemove`,
and `didRemove` callbacks, in addition to the standard `Downlink` callbacks.

```typescript
swim.downlinkList()
    .hostUri("warp://example.com")
    .nodeUri("/house")
    .laneUri("todo")
    .didUpdate((index, value) => /* ... */)
    .didMove((fromIndex, toIndex, value) => /* ... */)
    .didRemove((index) => /* ... */)
    .open();
```

## Installation

### npm

For an npm-managed project, `npm install @swim/client` to make it a dependency.
TypeScript sources will be installed into `node_modules/@swim/client/main`.
Transpiled JavaScript and TypeScript definition files install into
`node_modules/@swim/client/lib/main`.  And a pre-built UMD script can
be found in `node_modules/@swim/client/dist/main/swim-client.js`.

### Browser

Browser applications can load `swim-mesh.js`—which bundles the `@swim/client`
library—along with its `swim-core.js` dependency, directly from the Swim CDN.

```html
<script src="https://cdn.swim.ai/js/latest/swim-core.js"></script>
<script src="https://cdn.swim.ai/js/latest/swim-mesh.js"></script>
```

Alternatively, the standalone `swim-system.js` script may be loaded
from the Swim CDN, which bundles `@swim/client` along with all other
[`@swim/system`](https://www.npmjs.com/package/@swim/system) libraries.

```html
<script src="https://cdn.swim.ai/js/latest/swim-system.js"></script>
```

## Usage

### ES6/TypeScript

`@swim/client` can be imported as an ES6 module from TypeScript and other
ES6-compatible environments.

```typescript
import * as client from "@swim/client";
```

### CommonJS/Node.js

`@swim/client` can also be used as a CommonJS module in Node.js applications.

```javascript
var client = require("@swim/client");
```

### Browser

When loaded by a web browser, the `swim-core.js` script adds all
`@swim/client` library exports to the global `swim` namespace.  The
`swim-mesh.js` script requires that `swim-core.js` has already been loaded.

The `swim-system.js` script also adds all `@swim/client` library exports
to the global `swim` namespace, making it a drop-in replacement for
'swim-core.js' and `swim-mesh.js` when additional `@swim/system`
libraries are needed.
