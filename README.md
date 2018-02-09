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

## Structure & architecture

The application lives under the `src` directory, with `main.js` as its
entry point. The main file sets up some initial configuration, like setting the API root URL,
pulling in the router and global store, fetching the current Girder user, and then starts
the app itself, which is the `App.vue` presentation component.

### Components

The components directory contains Vue single-page components, but these are divided into
two categories, *containers* and *views*.

> See [here](https://medium.com/@learnreact/container-components-c0e67432e005) and
[here](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) for a full
description of the container vs. presentation pattern.

* *Container* components are concerned with data sync and global state. They should **never**
contain any UI framework components or <style> section; their template should just be a single
view component into which they pass the data as reactive props. The underlying view component will
fire events, and the container will listen to those events and handle any data synchronization.

> **Note**: I broke this rule for the Layout component; it is a presentation component that also interacts
with the global store. I'm OK with this right now, but if we want to err on the side of purity,
we can fix this later.

* *View* components are concerned with presenting data, not how to sync it to/from a server, etc.
They should **never** contain references to the ``rest`` module, the router, or the global store.

Among the many benefits of this separation of concerns, one very compelling one is the ability to
easily unit test the view components without the need for any mocking.

### Store

The App is created with a global store, which is a Vuex store. At the moment, this is only used
for truly global state that should be available to all components, including:

* Logged in status / current user / current token
* Router state

### REST interaction

The file `rest.js` is used to interact with Girder's REST API. You can import it as a module;
that module just exposes the [axios](https://github.com/axios/axios) API, which we configure at
startup time (inside `main.js` prior to mounting the App) to work with Girder's REST API.

## Tests

TODO
