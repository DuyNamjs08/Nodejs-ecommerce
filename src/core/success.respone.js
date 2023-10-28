"use strict";

const statusCodes = {
  OK: 200,
  CREATED: 201,
};
const reasonStatusCode = {
  OK: "Ok !",
  CREATED: "Created !",
};
class SuccessRespone {
  constructor({
    message,
    statusCode = statusCodes.OK,
    reasonStatus = reasonStatusCode.CREATED,
    metaData = {},
  }) {
    (this.message = !message ? reasonStatus : message),
      (this.status = statusCode),
      (this.metaData = metaData);
  }
  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}
class OkRespones extends SuccessRespone {
  constructor({ message, metaData }) {
    super({ message, metaData });
  }
}
class CreatedRespones extends SuccessRespone {
  constructor({
    message,
    statusCode = statusCodes.CREATED,
    reasonStatus = reasonStatusCode.CREATED,
    metaData,
    options = {},
  }) {
    super({ message, statusCode, reasonStatus, metaData });
    this.options = options;
  }
}

module.exports = { OkRespones, CreatedRespones, SuccessRespone };
