import axios from 'axios';
import { UPLOAD_CHUNK_SIZE } from '@/constants';
import rest, { formEncode } from '@/rest';

export class UploadError extends Error {
  constructor(response, when, offset = 0, upload = null) {
    super();
    this.response = response;
    this.when = when;
    this.offset = offset;
    this.upload = upload;
  }
}

const s3 = {
  async uploadFile(file, upload, { progress }) {
    if (upload.s3.chunked) {
      return s3._multiChunkUpload(file, upload, { progress });
    }

    const { headers, method, url } = upload.s3.request;

    try {
      await axios.request({
        data: file,
        headers,
        method,
        url,
        onUploadProgress: e => progress({
          current: e.loaded,
          total: file.size,
          indeterminate: !e.lengthComputable,
        }),
      });
    } catch ({ response }) {
      throw new UploadError(response, 's3_send', 0, upload);
    }

    progress({ indeterminate: true });

    try {
      return (await rest.post('file/completion', formEncode({ uploadId: upload._id }))).data;
    } catch ({ response }) {
      throw new UploadError(response, 's3_finalize', file.size, upload);
    }
  },

  async _multiChunkUpload(file, upload, { progress }) {
    // TODO implement multi-chunk.
    return null;
  },
};

/**
 * Custom upload behaviors should be registered in this object.
 */
export const uploadBehaviors = { s3 };

/**
 * Upload a file to the server. The returned Promise will be resolved with the Girder
 * file that was created, or rejected with an ``UploadError``.
 * @param file {File} the browser File to upload
 * @param parent {Object} the parent document. Must contain _id and _modelType.
 * @param opts {Object} upload options.
 * @param opts.progress {Function} A progress callback for the upload. It will receive an Object
 * argument with either ``"indeterminate": true``, or numeric ``current`` and ``total`` fields.
 * @param opts.params {Object} Additional parameters to pass on the upload init request.
 * @type Promise
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

  if (data.behavior && uploadBehaviors[data.behavior]) {
    return uploadBehaviors[data.behavior].uploadFile(file, data, { progress });
  }

  let offset = 0;
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
      ({ data } = (await rest.post(`file/chunk?offset=${offset}&uploadId=${data._id}`, blob, {
        onUploadProgress,
        headers: { 'Content-Type': 'application/octet-stream' },
      })));
    } catch ({ response }) {
      throw new UploadError(response, 'chunk', offset, data);
    }
    offset = end;
  }

  return data;
}
