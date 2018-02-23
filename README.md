# girder

> Girder web client

## Build Setup

``` bash
# install dependencies
yarn

# serve with hot reload
# assumes Girder is running locally on port 8080 with CORS enabled
# with an Allowed Origins that includes http://localhost:8081,
# see http://girder.readthedocs.io/en/latest/security.html?#cors-cross-origin-resource-sharing
yarn start

# build for production with minification
yarn build

# build for production and view the bundle analyzer report
yarn build:report

# run all tests
yarn test

# run linter
yarn lint
```

## Component pattern

Components are separated into *containers*, which are responsible for data sync & app state management,
*views*, which are responsible solely for presentation/UI, and *route* components, which manage interaction with
the router. Any given component should belong to at most one of these categories
in order to separate these concerns for testability & reusability.


### Best practices

* Container components should never contain any components from the UI framework or any `<style>`
section.
* Container components should not make any references at
all to the router, in fact; if you reach a point where that seems necessary, point your route to
a route component that wraps the container component and converts events from the container component
to route updates.
* View components should never contain REST calls, Vuex store references, or router references. They
should simply trigger events that should be handled by an ancestor container component.
* View components that contain container components inside them should put them into a named slot
so that they can be easily replaced or mocked by callers.
* In order to make container components usable independently of the presentation layer, it's a good idea to
use dependency injection with dynamic components rather than statically importing a view component
into the container component and registering it as a local component.
* Route components should be extremely light, just wrapping a single container component and managing
its interaction with the router state. For any routes that contain wildcards that should cause a
re-fetch on their container when the route updates (e.g. routes with wildcard tokens that refer to
document IDs), make sure to include the `fetchingRoute` mixin.

## Debugging test failures

### Locally

When you run `yarn test` or `yarn unit`, Karma uses Chrome Headless as the runtime environment,
and also will kill the browser as soon as the test suite is finished. For debugging, we want to
use a different browser, and keep it alive after the tests are done. The following command achieves
these goals:

    KARMA_BROWSER=Chrome yarn unit --single-run=false

Since unit tests of components do not render into the DOM by default, you won't see what you are
interested in. To get your component to render into the DOM, pass `attachToDocument: true` when using
the `mount` function for the component you want to visually inspect:

```
import { mount } from '@vue/test-utils'
import SomeComponent from '@/views/SomeComponent'

...

mount(SomeComponent, {
  attachedToDocument: true,
  ...
})
```

### For failures that only appear in CI

TODO -- the puppeteer library claims to work for taking screenshots in headless Chrome, but I ran into strange
errors with it. If we can get it working, we can easily make a custom karma reporter to dump
screenshots on test failure that we can use for debugging failures that only appear in CI, though I hope
those are much more of a rarity.
