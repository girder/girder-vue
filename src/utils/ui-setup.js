/**
 * This file must be imported once for side effects in any application that needs to use Girder's
 * view components. It sets up the required global state needed to use Vuetify components.
 * Hopefully future versions of Vuetify can be used without needing global side effects.
 */

import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);
