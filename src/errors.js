export class UploadError extends Error {
  constructor(response, when, offset = 0, upload = null) {
    super();
    this.response = response;
    this.when = when;
    this.offset = offset;
    this.upload = upload;
  }
}
