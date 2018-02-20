import _ from 'lodash';
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

  _finalizeMultipartXml(etags) {
    const doc = document.implementation.createDocument(null, null, null);
    const root = doc.createElement('CompleteMultipartUpload');

    _.each(etags, (etag, part) => {
      const partEl = doc.createElement('Part');
      const partNumberEl = doc.createElement('PartNumber');
      const etagEl = doc.createElement('ETag');

      partNumberEl.appendChild(doc.createTextNode(part));
      etagEl.appendChild(doc.createTextNode(etag));
      partEl.appendChild(partNumberEl);
      partEl.appendChild(etagEl);
      root.appendChild(partEl);
    });

    return new window.XMLSerializer().serializeToString(root);
  },

  async _multiChunkUpload(file, upload, { progress }) {
    let resp;

    // Initialize the multipart upload in S3
    try {
      const { headers, method, url } = upload.s3.request;
      resp = await axios.request({
        data: null,
        headers,
        method,
        url,
      });
    } catch ({ response }) {
      throw new UploadError(response, 's3_multipart_init', 0, upload);
    }

    const xml = new DOMParser().parseFromString(resp.data, 'text/xml');
    const s3UploadId = xml.querySelector('InitiateMultipartUploadResult > UploadId').textContent;

    // Upload the chunks
    const etags = {};
    let offset = 0;
    let partNumber = 1;
    const onUploadProgress = e => progress({
      current: offset + e.loaded,
      total: file.size,
      indeterminate: !e.lengthComputable,
    });

    // eslint-disable-next-line no-await-in-loop
    while (offset < file.size) {
      const blob = file.slice(offset, offset + upload.s3.chunkLength);
      try {
        resp = await rest.post('file/chunk', formEncode({
          chunk: JSON.stringify({
            contentLength: blob.size,
            partNumber,
            s3UploadId,
          }),
          offset: 0,
          uploadId: upload._id,
        }));
      } catch ({ response }) {
        throw new UploadError(response, 's3_multipart_authorize_chunk', offset, upload);
      }

      try {
        resp = await axios.request({
          data: blob,
          method: resp.data.s3.request.method,
          url: resp.data.s3.request.url,
          onUploadProgress,
        });
      } catch ({ response }) {
        throw new UploadError(response, 's3_multipart_chunk', offset, upload);
      }
      etags[partNumber] = resp.headers.etag;
      partNumber += 1;
      offset += blob.size;
    }

    progress({ indeterminate: true });

    // Finalize multipart upload in S3
    try {
      resp = await rest.post('file/completion', formEncode({ uploadId: upload._id }));
    } catch ({ response }) {
      throw new UploadError(response, 's3_multipart_authorize_finalize', offset, upload);
    }

    try {
      const { headers, method, url } = resp.data.s3FinalizeRequest;
      await axios.request({
        data: s3._finalizeMultipartXml(etags),
        headers,
        method,
        url,
      });
    } catch ({ response }) {
      throw new UploadError(response, 's3_multipart_finalize', offset, upload);
    }

    return resp.data;
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
