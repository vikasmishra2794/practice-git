const responseHandler = require('../handlers/response.handler');
const templateService = require('../services/template.service');
const codeTemplateValidation = require('../validations/code-template.validation');
const commonValidation = require('../validations/common.validation');

/**
 * @api {GET} unique-code-template/codes Get list of Unique code templates.
 * @apiName list_unique_code_template
 * @apiGroup unique_code
 * @apiVersion 0.1.0
 * @apiParam {Number} [page_no] used to get the paginated list.
 * @apiParam {Number} [page_size] used to get the paginated list.
 * @apiDescription This will give list of unique code template of an associated account.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  {
  "data": {
    "codes": [
      {
        "id": 1,
        "name": "Shaleen12",
        "description": "asdffdsdfdf",
        "code_table": {
          "name": "table 1",
          "id": 1
          }
        "status": 1
      },
      {
        "id": 2,
        "name": "Shalin",
        "description": "Shalin Yapsody",
        "code_table": {
          "name": "table 2",
          "id": 2
        }
        "status": 2
      }
    ]
  },
  "meta": {
    "version": 1,
    "timestamp": "2019-01-23T11:33:07.332Z"
  }
}
 */
const getCodeTemplates = async (req, res) => {
  const {
    account_id,
    whitelabel_id,
    user_id,
    page_no,
    page_size,
    sort_by,
    sort_order,
    search,
    status,
  } = { ...req.api_gateway_data, ...req.query };
  const isPaginated = (req.url === '/all') ? 0 : 1;
  try {
    await codeTemplateValidation.getCodeTemplatesValidation.validate({
      account_id,
      whitelabel_id,
      user_id,
      page_no,
      page_size,
      status,
    });
    const codeTemplates = await templateService.getCodeTemplateList({
      account_id,
      page_no,
      page_size,
      sort_by,
      sort_order,
      search,
      status,
    });
    const metaData = isPaginated ? {
      page_no,
      page_size,
      total_items: codeTemplates.count,
      sort_by,
      sort_order,
      search,
    } : '';
    const code_templates = codeTemplates.rows.map(codeTemplate => templateService.minifyCodeObject(codeTemplate));
    return res.send(responseHandler.getSuccessPayload({ code_templates }, metaData));
  } catch (err) {
    switch (err.name) {
      case 'ValidationError':
        return res.status(responseHandler.STATUS.BAD_REQUEST)
          .send(responseHandler.getJoiValidationErrorPayload(err, responseHandler.STATUS.BAD_REQUEST));
      default:
        return res.status(responseHandler.STATUS.INTERNAL_SERVER_ERROR)
          .send(responseHandler.getErrorPayload('Internal Server Error'));
    }
  }
};

/**
 * @api {GET} unique-code-template/codes/{code_id} Get specific Unique code template.
 * @apiName single_unique_code_template
 * @apiGroup unique_code
 * @apiVersion 0.1.0
 * @apiParam {Number} code_id Id of specific template.
 * @apiDescription This will give unique code template details of specific code.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  {
    "data": {
        "code": {
            "id": 1,
            "name": "Shaleen12",
            "description": "asdffdsdfdf",
            "code_table": {
              "name": "table 1",
              "id": 1
            }
            "status": 1
        }
    },
    "meta": {
        "version": 1,
        "timestamp": "2019-01-23T11:37:33.402Z"
    }
}
 */
const getCodeTemplate = async (req, res) => {
  const reqData = { ...req.params, ...req.api_gateway_data };
  try {
    const validatedData = await codeTemplateValidation.getSingleCodeTemplateValidation.validate(reqData);

    const codeTemplate = await templateService.getCodeTemplate(validatedData);
    if (!codeTemplate) {
      return res.status(responseHandler.STATUS.NOT_FOUND)
        .send(responseHandler.getErrorPayload('Code not found', responseHandler.STATUS.NOT_FOUND));
    }

    return res.send(responseHandler.getSuccessPayload({ codeTemplate }));
  } catch (err) {
    switch (err.name) {
      case 'ValidationError':
        return res.status(responseHandler.STATUS.BAD_REQUEST)
          .send(responseHandler.getJoiValidationErrorPayload(err, responseHandler.STATUS.BAD_REQUEST));
      default:
        return res.status(responseHandler.STATUS.INTERNAL_SERVER_ERROR)
          .send(responseHandler.getErrorPayload('Internal Server Error'));
    }
  }
};

/**
 * @api {POST} unique-code-template/codes Add a unique code template.
 * @apiName add_unique_code_template
 * @apiGroup unique_code
 * @apiVersion 0.1.0
 * @apiParam {String} name Name of the unique code template.
 * @apiParam {String} [description] Description of the unique code template.
 * @apiParam {Number} [code_table_id] Id of code table (Used as a reference of code table).
 * @apiParam {Number} [status] status of the unique code template.
 * @apiDescription This will give details of newly created unique code template.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  {
    "data": {
        "code": {
            "id": 11,
            "name": "Kundan Raj",
            "description": "kakakakakkakaf",
            "code_table_id": 1,
            "status": 2
        }
    },
    "meta": {
        "version": 1,
        "timestamp": "2019-01-23T11:48:54.169Z"
    }
}
 */
const createCodeTemplate = async (req, res) => {
  const reqData = {
    ...req.body,
    ...req.api_gateway_data,
  };
  try {
    const validatedReqData = await codeTemplateValidation.addTemplateValidation.validate(reqData);
    const codeTemplate = await templateService.createCodeTemplate(validatedReqData);
    return res.send(responseHandler.getSuccessPayload({ codeTemplate }));
  } catch (err) {
    switch (err.name) {
      case 'ValidationError':
        return res.status(responseHandler.STATUS.BAD_REQUEST)
          .send(responseHandler.getJoiValidationErrorPayload(err, responseHandler.STATUS.BAD_REQUEST));
      default:
        return res.status(responseHandler.STATUS.INTERNAL_SERVER_ERROR)
          .send(responseHandler.getErrorPayload('Internal Server Error'));
    }
  }
};

/**
 * @api {PUT} unique-code-template/codes Update a unique code template.
 * @apiName update_unique_code_template
 * @apiGroup unique_code
 * @apiVersion 0.1.0
 * @apiParam {String} [name] Name of the unique code template.
 * @apiParam {String} [description] Description of the unique code template.
 * @apiParam {Number} [code_table_id] Id of code table (Used as a reference of code table).
 * @apiParam {Number} [status] status of the unique code template.
 * @apiDescription This will give details of updated unique code template.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  {
    "data": {
        "code": {
            "id": 11,
            "name": "Kundan sdsd",
            "description": "vvkvkvkv",
            "code_table_id": 2,
            "status": 1
        }
    },
    "meta": {
        "version": 1,
        "timestamp": "2019-01-23T11:53:47.769Z"
    }
}
 */
const updateCodeTemplate = async (req, res) => {
  const reqData = {
    ...req.body['code template'],
    ...req.api_gateway_data,
    ...req.params,
  };

  try {
    const validatedReqData = await codeTemplateValidation.updateTemplateValidation.validate(reqData);
    await codeTemplateValidation.updateTemplateCustomValidation(reqData);
    const codeTemplate = await templateService.updateCodeTemplate(validatedReqData);
    if (!codeTemplate) {
      return res.status(responseHandler.STATUS.NOT_FOUND)
        .send(responseHandler.getErrorPayload('Code not found', responseHandler.STATUS.NOT_FOUND));
    }
    return res.send(responseHandler.getSuccessPayload({ code_template: codeTemplate }));
  } catch (err) {
    switch (err.name) {
      case 'ValidationError':
        return res.status(responseHandler.STATUS.BAD_REQUEST)
          .send(responseHandler.getJoiValidationErrorPayload(err, responseHandler.STATUS.BAD_REQUEST));
      case 'InvalidOperation':
        return res.status(responseHandler.STATUS.FORBIDDEN)
          .send(responseHandler.getErrorPayload(err, responseHandler.STATUS.FORBIDDEN));
      case 'StatusCodeError':
        return res.status(responseHandler.STATUS.FORBIDDEN)
          .send(responseHandler.getErrorPayload(err, responseHandler.STATUS.FORBIDDEN));
      default:
        return res.status(responseHandler.STATUS.INTERNAL_SERVER_ERROR)
          .send(responseHandler.getErrorPayload('Internal Server Error', responseHandler.STATUS.INTERNAL_SERVER_ERROR));
    }
  }
};

const cloneCodeTemplate = async (req, res) => {
  const reqData = {
    ...req.body,
    account_id: req.account.id,
    ...req.params,
  };

  try {
    // const validatedReqData = await updateTemplateValidation.validate(reqData);
    const codeTemplate = await templateService.cloneCodeTemplate(reqData);

    if (!codeTemplate) {
      return res.status(responseHandler.STATUS.NOT_FOUND)
        .send(responseHandler.getErrorPayload('Code not found', responseHandler.STATUS.NOT_FOUND));
    }
    return res.send(responseHandler.getSuccessPayload({ code_template: codeTemplate }));
  } catch (err) {
    switch (err.name) {
      case 'ValidationError':
        return res.status(responseHandler.STATUS.BAD_REQUEST)
          .send(responseHandler.getJoiValidationErrorPayload(err, responseHandler.STATUS.BAD_REQUEST));
      case 'InvalidOperation':
        return res.status(responseHandler.STATUS.FORBIDDEN)
          .send(responseHandler.getErrorPayload(err, responseHandler.STATUS.FORBIDDEN));
      case 'StatusCodeError':
        return res.status(responseHandler.STATUS.FORBIDDEN)
          .send(responseHandler.getErrorPayload(err, responseHandler.STATUS.FORBIDDEN));
      default:
        return res.status(responseHandler.STATUS.INTERNAL_SERVER_ERROR)
          .send(responseHandler.getErrorPayload('Internal Server Error', responseHandler.STATUS.INTERNAL_SERVER_ERROR));
    }
  }
};

/**
 * @api {DELETE} unique-code-template/codes/{code_id} Delete a unique code template.
 * @apiName delete_unique_code_template
 * @apiGroup unique_code
 * @apiVersion 0.1.0
 * @apiParam {Number} code_id Id of unique code template.
 * @apiDescription This will give details of deleted unique code template.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  {
    "data": {
        "code": {
            "id": 10,
            "name": "Vaibhavsd",
            "description": "asasddssd",
            "code_table_id": 1,
            "status": 3
        }
    },
    "meta": {
        "version": 1,
        "timestamp": "2019-01-23T11:58:30.965Z"
    }
}
 */
const deleteCodeTemplate = async (req, res) => {
  const { code_template_id, id: account_id } = {
    ...req.account,
    ...req.params,
  };

  try {
    await commonValidation.accountIdValidation.validate(account_id);
    await commonValidation.codeIdValidation.validate(code_template_id);
    const codeTemplate = await templateService.deleteCodeTemplate({ code_template_id, account_id });

    if (!codeTemplate) {
      return res.status(responseHandler.STATUS.NOT_FOUND)
        .send(responseHandler.getErrorPayload('Code not found', responseHandler.STATUS.NOT_FOUND));
    }
    return res.send(responseHandler.getSuccessPayload({ code_template: codeTemplate }));
  } catch (err) {
    switch (err.name) {
      case 'ValidationError':
        return res.status(responseHandler.STATUS.BAD_REQUEST)
          .send(responseHandler.getJoiValidationErrorPayload(err, responseHandler.STATUS.BAD_REQUEST));
      case 'InvalidOperation':
        return res.status(responseHandler.STATUS.FORBIDDEN)
          .send(responseHandler.getErrorPayload(err, responseHandler.STATUS.FORBIDDEN));
      case 'StatusCodeError':
        return res.status(responseHandler.STATUS.FORBIDDEN)
          .send(responseHandler.getErrorPayload(err, responseHandler.STATUS.FORBIDDEN));
      default:
        return res.status(responseHandler.STATUS.INTERNAL_SERVER_ERROR)
          .send(responseHandler.getErrorPayload('Internal Server Error', responseHandler.STATUS.INTERNAL_SERVER_ERROR));
    }
  }
};

const templateController = {
  getCodeTemplates,
  getCodeTemplate,
  createCodeTemplate,
  updateCodeTemplate,
  cloneCodeTemplate,
  deleteCodeTemplate,
};

module.exports = templateController;