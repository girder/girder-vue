# girder

> Girder web client

## Build Setup

``` bash
# install dependencies
yarn

# serve with hot reload
yarn start

# build for production with minification
yarn build

# build for production and view the bundle analyzer report
yarn build --report

# run unit tests
yarn run unit

# run all tests
yarn test
```

## Component pattern

Components are separated into *containers*, which are responsible for data sync & app state management,
and *views*, which are responsible solely for presentation/UI. Any given component should be one or the other
in order to separate these concerns for testability & reusability. Note that the `Layout` component is the
one view that breaks from this convention, but that is probably OK since it's not really meant
to be reused externally and unit testing it is not as important.

> See [here](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) for a full
run-down of this pattern.

### Best practices

* Container components should never contain any components from the UI framework or any `<style>`
section.
* Container components should not read input data from `this.$route` properties; instead the route
that refers to them should set `props: true` as documented
[here](https://router.vuejs.org/en/essentials/passing-props.html)
to cause the path params to be passed in as props to the component. Using this with the function
mode can also be used to pass router query params as props.
* View components should never contain REST calls, Vuex store references, or router references. They
should simply trigger events that should be handled by an ancestor container component.
* View components that contain container components inside them should put them into a named slot
so that they can be easily replaced or mocked by callers.

## Debugging test failures

### Locally

When you run `yarn test` or `yarn run unit`, Karma uses Chrome Headless as the runtime environment,
and also will kill the browser as soon as the test suite is finished. For debugging, we want to
use a different browser, and keep it alive after the tests are done. The following command achieves
these goals:

    KARMA_BROWSER=Chrome yarn run unit --single-run=false

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
