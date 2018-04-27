export const AccessType = {
  NONE: -1,
  READ: 0,
  WRITE: 1,
  ADMIN: 2,
  SITE_ADMIN: 100,
};

/**
 * Icons corresponding to resource types in Girder.
 */
export const ResourceIcons = {
  COLLECTION: 'collections',
  FOLDER: 'folder',
  GROUP: 'people',
  ITEM: 'description',
  USER: 'person',
};

export const UPLOAD_CHUNK_SIZE = 1024 * 1024 * 64;
export const API_ROOT =
  process.env.NODE_ENV === 'production' ? '/api/v1' : '//localhost:8080/api/v1';
