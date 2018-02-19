import axios from 'axios';
import cookies from 'js-cookie';
import { stringify } from 'qs';

const instance = axios.create();

export const getApiUrl = () => instance.defaults.baseURL;

/**
 * This should be called prior to making any REST API calls to Girder. It
 * configures this module such that all API calls are made relative to the
 * URL provided.
 * @param {string} url Girder's REST API URL root, e.g. "/api/v1"
 */
export const setApiUrl = (url) => {
  instance.defaults.baseURL = url;
};

/**
 * Set the value of the Girder-Token header for future requests made with this module.
 * @param {string} token the token value
 */
export const setToken = (token) => {
  instance.defaults.headers.common['Girder-Token'] = token;
  cookies.set('girderToken', token);
};

/**
 * Read the Girder REST authentication token from the cookie.
 */
export const getTokenFromCookie = () => cookies.get('girderToken');

/**
 * Register a function that will be called on responses to API requests.
 * @param fn The function to call
 */
export const onResponse = (fn) => {
  instance.interceptors.response.use(undefined, fn);
};

/**
 * Convert an Object into an x-www-form-urlencoded string.
 * @param obj {Object} The object to encode
 */
export const formEncode = stringify;

export default instance;
