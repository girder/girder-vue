# girder

> Girder web client

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload
npm start

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
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
