import _ from 'lodash';
import axios from 'axios';
import { UploadError } from '@/errors';
import rest, { formEncode } from '@/rest';

const finalizeMultipartXml = (etags) => {
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
};

async function sendChunks(file, upload, { progress }) {
  const { s3 } = upload;
  s3.etags = s3.etags || {};
  s3.offset = s3.offset || 0;
  s3.partNumber = s3.partNumber || 1;

  let resp;
  const onUploadProgress = e => progress({
    current: s3.offset + e.loaded,
    total: file.size,
    indeterminate: !e.lengthComputable,
  });

  // eslint-disable-next-line no-await-in-loop
  while (s3.offset < file.size) {
    const blob = file.slice(s3.offset, s3.offset + s3.chunkLength);
    try {
      resp = await rest.post('file/chunk', formEncode({
        chunk: JSON.stringify({
          contentLength: blob.size,
          partNumber: s3.partNumber,
          s3UploadId: s3.uploadId,
        }),
        offset: 0,
        uploadId: upload._id,
      }));
    } catch ({ response }) {
      throw new UploadError(response, 's3_multipart_authorize_chunk', s3.offset, upload);
    }

    try {
      resp = await axios.request({
        data: blob,
        method: resp.data.s3.request.method,
        url: resp.data.s3.request.url,
        onUploadProgress,
      });
    } catch ({ response }) {
      throw new UploadError(response, 's3_multipart_chunk', s3.offset, upload);
    }
    s3.etags[s3.partNumber] = resp.headers.etag;
    s3.partNumber += 1;
    s3.offset += blob.size;
  }

  progress({ indeterminate: true });

  // Finalize multipart upload in S3
  try {
    resp = await rest.post('file/completion', formEncode({ uploadId: upload._id }));
  } catch ({ response }) {
    throw new UploadError(response, 's3_multipart_authorize_finalize', s3.offset, upload);
  }

  try {
    const { headers, method, url } = resp.data.s3FinalizeRequest;
    await axios.request({
      data: finalizeMultipartXml(s3.etags),
      headers,
      method,
      url,
    });
  } catch ({ response }) {
    throw new UploadError(response, 's3_multipart_finalize', s3.offset, upload);
  }

  return resp.data;
}

async function multiChunkUpload(file, upload, { progress }) {
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
  upload.s3.uploadId = xml.querySelector('InitiateMultipartUploadResult > UploadId').textContent;

  return sendChunks(file, upload, { progress });
}

async function uploadFile(file, upload, { progress }) {
  if (upload.s3.chunked) {
    return multiChunkUpload(file, upload, { progress });
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

  progress({
    current: file.size,
    total: file.size,
    indeterminate: true,
  });

  try {
    return (await rest.post('file/completion', formEncode({ uploadId: upload._id }))).data;
  } catch ({ response }) {
    throw new UploadError(response, 's3_finalize', file.size, upload);
  }
}

async function resumeUpload(file, upload, { progress }) {
  if (upload.s3.chunked) {
    return sendChunks(file, upload, { progress });
  }

  let data;
  try {
    ({ data } = await rest.get(`file/offset?uploadId=${upload._id}`));
  } catch ({ response }) {
    throw new UploadError(response, 's3_resume', null, upload);
  }

  return uploadFile(file, Object.assign({}, upload, { s3: { request: data } }), { progress });
}

export default {
  resumeUpload,
  uploadFile,
};
