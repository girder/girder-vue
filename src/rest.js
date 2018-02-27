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
 * Fetch the child models of a resource.
 * @param model The model to find the children of. It must minimally contain _id and _modelType.
 * @returns A promise that resolves to the list of child models.
 */
export const fetchChildren = ({ _id, _modelType }) => {
  const urlMap = {
    collection: [`/folder?parentType=collection&parentId=${_id}`],
    user: [`/folder?parentType=user&parentId=${_id}`],
    folder: [`/folder?parentType=folder&parentId=${_id}`, `/item?folderId=${_id}`],
    item: [`/item/${_id}/files`],
  };
  return (Promise.all((urlMap[_modelType] || []).map(url => instance.get(url)))
    .then(result => result.reduce((agg, d) => [...agg, ...d.data], [])));
};

/**
 * A root path object to represent the base element of a path (e.g. "collections" or "users").
 * @param type The model type.
 * @returns An object that may be used in a breadcrumb whose name is the plural of the model type.
 */
const rootObject = type => ({ type: `${type}s`, object: { name: `${type}s` } });

/**
 * Fetch the root path of a resource.
 * @param model The model to retrieve the root path for.
 * @returns A promise that resolves to the root path to the resource.
 */
export const fetchRootPath = (model) => {
  const { _id, _modelType, itemId } = model;
  const component = { type: _modelType, object: model };

  // Special case for file. Would be nice if file had a rootpath endpoint.
  if (_modelType === 'file') {
    return (Promise.all([instance.get(`/item/${itemId}/rootpath`), instance.get(`/item/${itemId}`)])
      .then(([path, item]) => [
        rootObject(path.data[0].type),
        ...path.data,
        { type: 'item', object: item.data },
        component,
      ])
    );
  }

  if (['user', 'collection'].indexOf(_modelType) >= 0) {
    return Promise.resolve([rootObject(_modelType), component]);
  }
  return instance.get(`/${_modelType}/${_id}/rootpath`).then(r => [rootObject(r.data[0].type), ...r.data, component]);
};

/**
 * Convert an Object into an x-www-form-urlencoded string.
 * @param obj {Object} The object to encode
 */
export const formEncode = stringify;

export default instance;
