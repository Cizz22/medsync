import Joi from 'joi';

const getConnections = {
  // query: Joi.object().keys({
  //   name: Joi.string(),
  //   role: Joi.string(),
  //   sortBy: Joi.string(),
  //   limit: Joi.number().integer(),
  //   page: Joi.number().integer()
  // })
};

const createConnection = {
  body: Joi.object().keys({
    connection_type: Joi.string().required(),
    name: Joi.string().required(),
    connection_config: Joi.object().required()
  })
};

const getConnection = {
  params: Joi.object().keys({
    connectionId: Joi.string().required()
  })
};

const deleteConnection = {
  params: Joi.object().keys({
    connectionId: Joi.string().required()
  })
};

const checkConnectionConfig = {
  body: Joi.object().keys({
    connectionId: Joi.string().required()
  })
};

export default {
  getConnections,
  createConnection,
  getConnection,
  deleteConnection,
  checkConnectionConfig
};
