const fs = require('fs');
const path = require('path');
const config = require('../config');
const logger = require('../logger');

class Controller {
    static sendResponse(response, payload) {
        /**
         * The default response-code is 200. We want to allow to change that. in That case,
         * payload will be an object consisting of a code and a payload. If not customized
         * send 200 and the payload as received in this method.
         */
        response.status(payload.code || 200);
        const responsePayload = payload.payload !== undefined ? payload.payload : payload;
        if (responsePayload instanceof Object) {
            response.json(responsePayload);
        } else {
            response.end(responsePayload);
        }
    }

    static sendError(response, error) {
        response.status(error.code || 500);
        if (error.error instanceof Object) {
            response.json(error.error);
        } else {
            response.end(error.error || error.message);
        }
    }

  static collectRequestParams(request) {
    const requestParams = {};
    if (request.openapi.schema.requestBody !== undefined) {
      const { content } = request.openapi.schema.requestBody;
      if (content['application/json'] !== undefined) {
        const schema = request.openapi.schema.requestBody.content['application/json'];
        if (schema.$ref) {
          requestParams[schema.$ref.substr(schema.$ref.lastIndexOf('.'))] = request.body;
        } else {
          requestParams.body = request.body;
        }
      } else if (content['multipart/form-data'] !== undefined) {
        Object.keys(content['multipart/form-data'].schema.properties).forEach(
          (property) => {
            const propertyObject = content['multipart/form-data'].schema.properties[property];
            if (propertyObject.format !== undefined && propertyObject.format === 'binary') {
              requestParams[property] = this.collectFile(request, property);
            } else {
              requestParams[property] = request.body[property];
            }
          },
        );
      }
    }
    // if (request.openapi.schema.requestBody.content['application/json'] !== undefined) {
    //   const schema = request.openapi.schema.requestBody.content['application/json'];
    //   if (schema.$ref) {
    //     requestParams[schema.$ref.substr(schema.$ref.lastIndexOf('.'))] = request.body;
    //   } else {
    //     requestParams.body = request.body;
    //   }
    // }
    request.openapi.schema.parameters.forEach((param) => {
      if (param.in === 'path') {
        requestParams[param.name] = request.openapi.pathParams[param.name];
      } else if (param.in === 'query') {
        requestParams[param.name] = request.query[param.name];
      } else if (param.in === 'header') {
        requestParams[param.name] = request.headers[param.name];
      }
    });
    return requestParams;
  }

    static async handleRequest(request, response, serviceOperation) {
        try {
            const serviceResponse = await serviceOperation(this.collectRequestParams(request));
            Controller.sendResponse(response, serviceResponse);
        } catch (error) {
            Controller.sendError(response, error);
        }
    }
}

module.exports = Controller;
