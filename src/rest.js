import axios from 'axios';
import cookies from 'js-cookie';

export default axios


export const getApiUrl = () => axios.defaults.baseURL

/**
 * This should be called prior to making any REST API calls to Girder. It
 * configures this module such that all API calls are made relative to the
 * URL provided.
 * @param {string} url Girder's REST API URL root, e.g. "/api/v1"
 */
export const setApiUrl = (url) => {
  axios.defaults.baseURL = url
}

/**
 * Set the value of the Girder-Token header for future requests made with this module.
 * @param {string} token the token value
 */
export const setToken = (token) => {
  axios.defaults.headers.common['Girder-Token'] = token
}

/**
 * Read the Girder REST authentication token from the cookie.
 */
export const getTokenFromCookie = () => cookies.get('girderToken')
