import { UPLOAD_CHUNK_SIZE } from '@/constants';
import { UploadError } from '@/errors';
import rest, { formEncode } from '@/rest';
import s3 from './s3';

/**
 * Custom upload behaviors should be registered in this object.
 */
export const uploadBehaviors = { s3 };

async function sendChunks(file, upload, { progress = () => null, offset = 0 }) {
  let data;
  const onUploadProgress = e => progress({
    current: offset + e.loaded,
    total: file.size,
    indeterminate: !e.lengthComputable,
  });

  // eslint-disable-next-line no-await-in-loop
  while (offset < file.size) {
    const end = Math.min(offset + UPLOAD_CHUNK_SIZE, file.size);
    const blob = file.slice(offset, end);
    try {
      ({ data } = (await rest.post(`file/chunk?offset=${offset}&uploadId=${upload._id}`, blob, {
        onUploadProgress,
        headers: { 'Content-Type': 'application/octet-stream' },
      })));
    } catch ({ response }) {
      throw new UploadError(response, 'chunk', offset, upload);
    }
    offset = end;
  }
  return data;
}

/**
 * Upload a file to the server. The returned Promise will be resolved with the Girder
 * file that was created, or rejected with an ``UploadError``.
 * @param file {File} the browser File to upload
 * @param parent {Object} the parent document. Must contain _id and _modelType.
 * @param opts {Object} upload options.
 * @param opts.progress {Function} A progress callback for the upload. It will receive an Object
 * argument with either ``"indeterminate": true``, or numeric ``current`` and ``total`` fields.
 * @param opts.params {Object} Additional parameters to pass on the upload init request.
 * @returns Promise
 */
export async function uploadFile(file, parent, { progress = () => null, params = {} }) {
  progress({ indeterminate: true });

  let data;
  try {
    ({ data } = await rest.post('/file', formEncode({
      parentType: parent._modelType,
      parentId: parent._id,
      name: file.name,
      size: file.size,
      mimeType: file.type,
      ...params,
    })));
  } catch ({ response }) {
    throw new UploadError(response, 'init');
  }

  if (data.behavior && uploadBehaviors[data.behavior] &&
      uploadBehaviors[data.behavior].uploadFile) {
    return uploadBehaviors[data.behavior].uploadFile(file, data, { progress });
  }

  return sendChunks(file, data, { progress });
}

/**
 * Resume an existing upload.
 * @param file {File} the browser File to upload.
 * @param upload {Object} the upload document from the in-progress upload.
 * @param opts {Object} upload options.
 * @param opts.progress {Function} A progress callback for the upload. It will receive an Object
 * argument with either ``"indeterminate": true``, or numeric ``current`` and ``total`` fields.
 * @returns Promise
 */
export async function resumeUpload(file, upload, { progress = () => null }) {
  progress({ indeterminate: true });

  if (upload.behavior && uploadBehaviors[upload.behavior] &&
      uploadBehaviors[upload.behavior].resumeUpload) {
    return uploadBehaviors[upload.behavior].resumeUpload(file, upload, { progress });
  }

  let data;
  try {
    ({ data } = await rest.get(`file/offset?uploadId=${upload._id}`));
  } catch ({ response }) {
    throw new UploadError(response, 'resume', null, upload);
  }
  return sendChunks(file, upload, { progress, offset: data.offset });
}
